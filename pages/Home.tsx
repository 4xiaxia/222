import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { routes, allPoisMap } from '../data/mockData';
import type { RouteInfo } from '../types';
import { LocationIcon, ChevronDownIcon, ChevronRightIcon, AgentIcon } from '../components/icons';

// Define component outside to prevent re-creation on render
const RouteCard: React.FC<{ route: RouteInfo, onSelect: (id: string) => void }> = ({ route, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const poisInRoute = route.pois.map(pid => allPoisMap.get(pid)).filter(Boolean);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ease-in-out mb-4 border border-gray-100">
      <div className="p-4 flex items-start gap-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <img src={route.image} alt={route.title} className="w-20 h-20 object-cover rounded-lg" />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold text-gray-800">{route.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${route.tagColor}`}>{route.tag}</span>
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{route.description}</p>
          <p className="text-sm text-gray-500 mt-1">{route.pois.length}个景点</p>
        </div>
        <button className="text-gray-400 self-center">
            {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <ul className="mt-3 space-y-2">
            {poisInRoute.map(poi => poi && (
              <li key={poi.id} onClick={() => onSelect(poi.id)} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-100 active:bg-gray-200 transition-colors">
                <div>
                    <h4 className="font-semibold text-gray-700">{poi.name}</h4>
                    <p className="text-sm text-gray-500 truncate w-48">{poi.shortDesc}</p>
                </div>
                <ChevronRightIcon />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const [, setLocation] = useLocation();
  // Directly set routes since data is imported and available synchronously.
  const [routesData] = useState<RouteInfo[]>(routes);

  const handleSelectAttraction = (id: string) => {
    setLocation(`/attraction/${id}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Hero Section with Village Background */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src="http://t61i76pjk.hn-bkt.clouddn.com/dongli/pic/640.webp?e=1763669843&token=KPjDX5JKdPj4uqjNpBSO-Eln4XWXDvgjed5-J4kE:xOqRqfALt2CSyxSlV1Y9U3fLVAk=" 
          alt="东里村" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60 flex flex-col justify-end p-6">
           <header className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
                <div className="text-white drop-shadow-md"><LocationIcon /></div>
                <h1 className="text-xl font-bold drop-shadow-md">东里村智能体</h1>
            </div>
            <button className="px-3 py-1.5 text-sm font-medium text-white border border-white/50 rounded-full hover:bg-white/20 backdrop-blur-sm">村委管理</button>
          </header>
          <div className="text-white">
             <h2 className="text-3xl font-bold mb-1">发现东里</h2>
             <p className="opacity-90">追忆革命岁月 · 探寻花海山水</p>
          </div>
        </div>
      </div>

      <div className="p-4 -mt-4 relative z-10">
        {routesData.map(route => (
            <RouteCard key={route.id} route={route} onSelect={handleSelectAttraction}/>
        ))}
      </div>
    </div>
  );
}