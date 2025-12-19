import React, { useState, useEffect, useRef } from 'react';
import { useRoute, useLocation } from 'wouter';
import { allPoisMap, routes } from '../data/mockData';
import { ArrowLeftIcon, AgentIcon, ChevronRightIcon, LocationIcon } from '../components/icons';
import { openMap } from '../utils/navigation';
import type { RouteInfo, POI } from '../types';

export default function RouteDetail() {
  const [, params] = useRoute<{ id: string }>("/route/:id");
  const [, setLocation] = useLocation();
  
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [selectedPoiId, setSelectedPoiId] = useState<string | null>(null);
  
  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (params) {
      const foundRoute = routes.find(r => r.id === params.id) || null;
      setRoute(foundRoute);
      if (foundRoute && foundRoute.pois.length > 0) {
        setSelectedPoiId(foundRoute.pois[0]);
      }
      
      // Auto-play welcome message via Agent (simulated)
      setTimeout(() => {
        setIsPlaying(true);
      }, 800);
    }
  }, [params]);

  useEffect(() => {
     if(isPlaying) {
         // Simulate speech end after 3 seconds
         const timer = setTimeout(() => setIsPlaying(false), 3000);
         return () => clearTimeout(timer);
     }
  }, [isPlaying]);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation('/');
    }
  };

  // Simple Coordinate Mapping Logic for Schematic Map
  // This maps GPS coordinates to % positions on the container
  const getPosition = (gps: [number, number]) => {
      // Dongli Village approximate bounding box
      const minLng = 118.2030;
      const maxLng = 118.2100;
      const minLat = 25.2340;
      const maxLat = 25.2390;

      const lngPct = (gps[0] - minLng) / (maxLng - minLng) * 100;
      const latPct = (maxLat - gps[1]) / (maxLat - minLat) * 100; // Invert Lat because screen Y is down
      
      // Clamp values to keep inside map 
      return {
          left: `${Math.max(5, Math.min(95, lngPct))}%`,
          top: `${Math.max(5, Math.min(95, latPct))}%`
      };
  }

  const poisInRoute = route ? route.pois.map(id => allPoisMap.get(id)).filter(Boolean) as POI[] : [];
  const selectedPoi = allPoisMap.get(selectedPoiId || '');

  const handleNavigate = () => {
      if (selectedPoi) {
          openMap(selectedPoi.name, selectedPoi.gps[1], selectedPoi.gps[0]);
      }
  };

  if (!route) return null;

  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden relative">
      {/* 1. Header (Floating) */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-4">
         <div className="bg-white/90 backdrop-blur-md shadow-sm rounded-full px-4 py-2 flex items-center gap-3">
             <button onClick={handleBack} className="p-1 rounded-full hover:bg-gray-100"><ArrowLeftIcon /></button>
             <span className="font-bold text-gray-800 text-sm">{route.title}</span>
             <div className="ml-auto flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 导览中
             </div>
         </div>
      </div>

      {/* 2. Map Area (Full Screen Background) */}
      <div className="absolute inset-0 z-0 bg-[#eef2f5]">
          {/* Map Background Image - Simplified Schematic */}
          <div className="w-full h-full relative overflow-hidden">
               <img 
                    src="http://t61i76pjk.hn-bkt.clouddn.com/dongli/pic/640.webp?e=1763669843&token=KPjDX5JKdPj4uqjNpBSO-Eln4XWXDvgjed5-J4kE:xOqRqfALt2CSyxSlV1Y9U3fLVAk=" 
                    className="w-full h-full object-cover opacity-30 scale-150 origin-center filter grayscale contrast-125"
                    alt="Map Background"
                />
               {/* Routes Polyline (Simulated with SVG) */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                   <path d="M 50 100 Q 150 300 300 500 T 500 800" stroke="#3b82f6" strokeWidth="4" fill="none" strokeDasharray="10,5"/>
               </svg>

               {/* POI Markers */}
               {poisInRoute.map((poi, index) => {
                   const pos = getPosition(poi.gps);
                   const isSelected = selectedPoiId === poi.id;
                   return (
                       <div 
                        key={poi.id}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 cursor-pointer ${isSelected ? 'z-10 scale-110' : 'z-0 scale-90 opacity-80'}`}
                        style={{ left: pos.left, top: pos.top }}
                        onClick={() => setSelectedPoiId(poi.id)}
                       >
                           <div className={`flex flex-col items-center gap-1 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                               <div className={`w-8 h-8 rounded-full border-2 shadow-lg flex items-center justify-center font-bold text-xs bg-white ${isSelected ? 'border-blue-500 text-blue-600' : 'border-gray-400 text-gray-500'}`}>
                                   {index + 1}
                               </div>
                               <span className="text-[10px] font-bold bg-white/80 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">{poi.name}</span>
                           </div>
                           {isSelected && <div className="absolute w-24 h-24 bg-blue-500/10 rounded-full -z-10 animate-ping top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>}
                       </div>
                   )
               })}
          </div>
      </div>

      {/* 3. Bottom Sheet (Agent & Cards) */}
      <div className="absolute bottom-0 left-0 right-0 z-30 flex flex-col justify-end pointer-events-none">
          
          {/* Agent Chat Bubble */}
          <div className="px-4 mb-2 flex items-end gap-2 pointer-events-auto">
              <div className="w-12 h-12 bg-white rounded-full p-1 shadow-lg border border-white relative z-10">
                  <AgentIcon variant="A" />
                  {isPlaying && <span className="absolute top-0 right-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                  </span>}
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-md border border-gray-100 max-w-[75%] mb-4 animate-[fadeInUp_0.3s_ease-out]">
                  <p className="text-sm text-gray-700">
                      咱们正在体验【{route.title}】，点击地图红点可以查看详情哦！
                  </p>
              </div>
          </div>

          {/* Draggable/Scrollable Panel */}
          <div className="bg-white rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.1)] pointer-events-auto pb-6">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-3 mb-4"></div>
              
              <div className="overflow-x-auto flex gap-4 px-4 pb-2 snap-x hide-scrollbar">
                  {poisInRoute.map(poi => (
                      <div 
                        key={poi.id}
                        id={`card-${poi.id}`}
                        onClick={() => setSelectedPoiId(poi.id)}
                        className={`snap-center flex-shrink-0 w-[85%] sm:w-[300px] bg-white border rounded-2xl p-3 flex gap-3 transition-all duration-300 ${selectedPoiId === poi.id ? 'border-blue-500 ring-1 ring-blue-500 shadow-md bg-blue-50/30' : 'border-gray-100 shadow-sm'}`}
                      >
                          <img src={poi.image} className="w-20 h-20 rounded-xl object-cover flex-shrink-0 bg-gray-200" alt={poi.name} />
                          <div className="flex flex-col justify-between flex-1 py-1">
                              <div>
                                  <h3 className="font-bold text-gray-800 text-sm line-clamp-1">{poi.name}</h3>
                                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">{poi.shortDesc}</p>
                              </div>
                              <div className="flex gap-2 mt-2">
                                  <button onClick={handleNavigate} className="flex-1 bg-blue-600 text-white text-xs py-1.5 rounded-lg font-medium active:bg-blue-700 flex items-center justify-center gap-1">
                                      <LocationIcon /> 去这里
                                  </button>
                                  <button onClick={() => setLocation(`/attraction/${poi.id}`)} className="px-3 bg-gray-100 text-gray-600 text-xs py-1.5 rounded-lg font-medium active:bg-gray-200">
                                      看详情
                                  </button>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
      
      {/* Sync Scroll Effect */}
      <style>{`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}