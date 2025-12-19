import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { allPoisMap } from '../data/mockData';
import { ArrowLeftIcon, AgentIcon } from '../components/icons';
import { ragService } from '../services/ragService';
import { openMap } from '../utils/navigation';
import type { POI } from '../types';

// Agent A: User-facing interaction logic
const agentA = {
  speak(text: string) {
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'zh-CN';
      utter.rate = 0.9;
      speechSynthesis.cancel();
      speechSynthesis.speak(utter);
    } catch (e) {
      alert("语音功能暂不可用。");
      console.error(e);
    }
  },
  async takePhotoAndExplain(): Promise<string> {
    alert('拍照讲解功能将模拟识别附近物体并提供讲解。请授权使用相机。');
    try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        // In a real app, you'd process the camera stream. Here we simulate.
        await new Promise(res => setTimeout(res, 1500)); // Simulate processing
        const mockLabel = Math.random() > 0.5 ? '石碑' : '台阶';
        const story = await ragService.search(`识别到${mockLabel}，讲讲它的故事`);
        this.speak(story.answer);
        return story.answer;
    } catch (err) {
        const message = '拍照失败，请检查相机权限。';
        alert(message);
        return message;
    }
  },
  navigateTo(name: string, gps: [number, number]) {
    // gps is [lng, lat], openMap expects (name, lat, lng)
    openMap(name, gps[1], gps[0]);
  }
};


export default function AttractionDetail() {
  const [, params] = useRoute<{ id: string }>("/attraction/:id");
  const [, setLocation] = useLocation();
  
  const [poi, setPoi] = useState<POI | null>(null);
  const [activeTab, setActiveTab] = useState('');
  const [photoStory, setPhotoStory] = useState('');

  // Since data is local, we can load it pretty much instantly.
  useEffect(() => {
    if (params) {
      const poiId = params.id;
      const foundPoi = allPoisMap.get(poiId) || null;
      setPoi(foundPoi);
      if (foundPoi && foundPoi.tags.length > 0) {
        setActiveTab(foundPoi.tags[0]);
      }
    } else {
      setPoi(null);
    }
  }, [params]);


  const handleTakePhoto = async () => {
      setPhotoStory('正在识别照片...');
      const story = await agentA.takePhotoAndExplain();
      setPhotoStory(story);
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation('/');
    }
  };

  // Common Header that is always visible to prevent jumping
  const Header = () => (
    <header className="px-4 py-3 flex items-center gap-4 bg-white sticky top-0 z-20 border-b shadow-sm/50 backdrop-blur-md bg-opacity-90">
      <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors">
          <ArrowLeftIcon />
      </button>
      <h1 className="text-lg font-bold truncate flex-1 text-gray-800">{poi ? poi.name : '加载中...'}</h1>
    </header>
  );

  if (!poi) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        {/* Loading Skeleton */}
        <div className="p-4 space-y-6 animate-pulse">
          <div className="w-full h-64 bg-gray-200 rounded-2xl"></div>
          <div className="flex justify-between items-center px-1">
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded-lg w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="bg-gray-50 p-5 rounded-xl space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      <Header />
      
      <div className="p-4 space-y-6">
        {/* Hero Image */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5 group">
          <img src={poi.image} alt={poi.name} className="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-105" />
           <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            AI导览中
          </div>
        </div>

        {/* Title Section */}
        <div className="px-1">
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{poi.name}</h2>
            <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">
                <span className="flex-shrink-0">📍</span>
                <span className="font-mono">{poi.gps[1].toFixed(5)}, {poi.gps[0].toFixed(5)}</span>
            </div>
        </div>

        {/* Intro Box */}
        <div className="bg-blue-50/80 p-5 rounded-2xl border border-blue-100">
          <h3 className="font-bold mb-2 text-blue-900 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-500 rounded-full"></span>
            景点介绍
          </h3>
          <p className="text-blue-800/90 text-sm leading-relaxed text-justify">{poi.longDesc}</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 text-center">
            <button onClick={() => agentA.speak(poi.story)} className="group bg-gradient-to-b from-green-50 to-green-100 text-green-800 p-4 rounded-2xl flex flex-col items-center justify-center border border-green-200 shadow-sm active:scale-95 transition-all">
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🔊</span>
                <span className="text-xs font-bold">语音问答</span>
            </button>
            <button onClick={handleTakePhoto} className="group bg-gradient-to-b from-blue-50 to-blue-100 text-blue-800 p-4 rounded-2xl flex flex-col items-center justify-center border border-blue-200 shadow-sm active:scale-95 transition-all">
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">📷</span>
                <span className="text-xs font-bold">拍照讲解</span>
            </button>
            <button onClick={() => agentA.navigateTo(poi.name, poi.gps)} className="group bg-gradient-to-b from-orange-50 to-orange-100 text-orange-800 p-4 rounded-2xl flex flex-col items-center justify-center border border-orange-200 shadow-sm active:scale-95 transition-all">
                <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">🗺️</span>
                <span className="text-xs font-bold">路线导航</span>
            </button>
        </div>
        
        {photoStory && (
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl text-white shadow-lg animate-[fadeIn_0.5s_ease-out]">
                <p className="text-sm font-medium opacity-90">{photoStory}</p>
            </div>
        )}

        {/* Tags Section - Improved Visuals */}
        <div>
            <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="font-bold text-gray-900 text-lg">探索关键词</h3>
                <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-md">点击切换视角</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
                {poi.tags.map((tag) => {
                    const isActive = activeTab === tag;
                    return (
                        <button 
                            key={tag}
                            onClick={() => setActiveTab(tag)}
                            className={`
                                relative px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 ease-out select-none
                                ${isActive 
                                    ? 'bg-gray-800 text-white shadow-lg shadow-gray-400/40 scale-105 -translate-y-0.5 ring-2 ring-gray-200 ring-offset-1' 
                                    : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                                }
                            `}
                        >
                            #{tag}
                        </button>
                    )
                })}
            </div>
        </div>

        {/* Story Content - Animated */}
         <div 
            key={activeTab} // Key change triggers re-render animation
            className="bg-gray-50 p-6 rounded-3xl relative border border-gray-100 animate-[fadeInUp_0.4s_ease-out_forwards]"
         >
            <div className="absolute -top-3 left-6 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm text-xs font-bold text-gray-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-gray-800"></span>
                {activeTab} 视角
            </div>
            <p className="text-gray-700 text-sm leading-7 text-justify pt-2">{poi.story}</p>
            
            <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex -space-x-2">
                     {[1,2,3].map(i => (
                         <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-[10px] text-gray-400">?</div>
                     ))}
                </div>
                <div className="flex items-center gap-2">
                    <div className="text-right">
                        <p className="text-xs font-bold text-gray-800">B仔</p>
                        <p className="text-[10px] text-gray-400">AI 讲解官</p>
                    </div>
                    <div className="w-10 h-10 bg-orange-100 rounded-full p-0.5 shadow-sm overflow-hidden">
                        <AgentIcon variant="B" />
                    </div>
                </div>
            </div>
         </div>
      </div>
      
      {/* Inline Animation Styles for this component */}
      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}