import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { allPoisMap } from '../data/mockData';
import { ArrowLeftIcon, AgentIcon } from '../components/icons';
import { ragService } from '../services/ragService';
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
  navigateTo(gps: [number, number]) {
    const [lng, lat] = gps;
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    alert(`即将跳转到地图导航至：${lat}, ${lng}`);
    window.open(url, '_blank');
  }
};


export default function AttractionDetail() {
  const [, params] = useRoute<{ id: string }>("/attraction/:id");
  const [, setLocation] = useLocation();
  
  const [poi, setPoi] = useState<POI | null>(null);
  const [activeTab, setActiveTab] = useState('');
  const [photoStory, setPhotoStory] = useState('');

  // Since data is local, we can load it pretty much instantly.
  // We keep a small effect just to sync with the route param change.
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

  // Common Header that is always visible to prevent jumping
  const Header = () => (
    <header className="p-4 flex items-center gap-4 bg-white sticky top-0 z-10 border-b shadow-sm">
      <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeftIcon />
      </button>
      <h1 className="text-xl font-semibold truncate flex-1">{poi ? poi.name : '加载中...'}</h1>
    </header>
  );

  if (!poi) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        {/* Loading Skeleton */}
        <div className="p-4 space-y-6 animate-pulse">
          <div className="w-full h-56 bg-gray-200 rounded-xl"></div>
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-7 bg-gray-200 rounded w-48"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg space-y-2">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
          <div className="grid grid-cols-3 gap-2">
              <div className="bg-gray-200 h-20 rounded-lg"></div>
              <div className="bg-gray-200 h-20 rounded-lg"></div>
              <div className="bg-gray-200 h-20 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <Header />
      
      <div className="p-4">
        <div className="relative mb-4 rounded-xl overflow-hidden shadow-lg">
          <img src={poi.image} alt={poi.name} className="w-full h-56 object-cover" />
           <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            -04:22
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
            <div>
                <h2 className="text-2xl font-bold">{poi.name}</h2>
                <p className="text-sm text-gray-500 mt-1">📍 {poi.gps[1].toFixed(5)}, {poi.gps[0].toFixed(5)}</p>
            </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
          <h3 className="font-semibold mb-2 text-blue-900">景点介绍</h3>
          <p className="text-blue-800 text-sm leading-relaxed">{poi.longDesc}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center mb-6">
            <button onClick={() => agentA.speak(poi.story)} className="bg-green-100 text-green-800 p-3 rounded-lg flex flex-col items-center justify-center hover:bg-green-200 transition-colors">
                <span className="text-2xl">🔊</span>
                <span className="text-xs font-semibold mt-1">语音问答</span>
            </button>
            <button onClick={handleTakePhoto} className="bg-blue-100 text-blue-800 p-3 rounded-lg flex flex-col items-center justify-center hover:bg-blue-200 transition-colors">
                <span className="text-2xl">📷</span>
                <span className="text-xs font-semibold mt-1">拍照讲解</span>
            </button>
            <button onClick={() => agentA.navigateTo(poi.gps)} className="bg-orange-100 text-orange-800 p-3 rounded-lg flex flex-col items-center justify-center hover:bg-orange-200 transition-colors">
                <span className="text-2xl">🗺️</span>
                <span className="text-xs font-semibold mt-1">路线导航</span>
            </button>
        </div>
        
        {photoStory && <div className="bg-blue-50 p-3 rounded-lg my-4 text-sm text-blue-800 animate-fade-in-up">{photoStory}</div>}

        <div className="mb-4">
            <h3 className="font-semibold mb-2">景点故事</h3>
            <div className="flex space-x-2 overflow-x-auto pb-2">
                {poi.tags.map(tag => (
                    <button 
                        key={tag}
                        onClick={() => setActiveTab(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tag ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>

         <div className="bg-gray-100 p-4 rounded-lg relative">
            <p className="text-gray-700 text-sm leading-relaxed mb-6">{poi.story}</p>
            <div className="absolute -bottom-5 right-5 w-16 h-16 text-blue-500">
                <AgentIcon />
            </div>
            <p className="absolute bottom-1 right-24 text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow">B仔 讲解官</p>
         </div>
      </div>
    </div>
  );
}