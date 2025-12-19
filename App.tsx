
import React, { useState, useEffect } from 'react';
import { TabType, WeatherData } from './types';
import { ItineraryView } from './components/ItineraryView';
import { CostView } from './components/CostView';
import { ListsView } from './components/ListsView';
import { InfoView } from './components/InfoView';
import { Icon } from './components/Shared';
import { fetchTokyoWeather, getWeatherIcon } from './services/weatherService';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('itinerary');
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchTokyoWeather().then(setWeather);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'itinerary': return <ItineraryView />;
      case 'cost': return <CostView />;
      case 'prep': return <ListsView key="prep" type="prep" />;
      case 'luggage': return <ListsView key="luggage" type="luggage" />;
      case 'shopping': return <ListsView key="shopping" type="shopping" />;
      case 'info': return <InfoView />;
      default: return <ItineraryView />;
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: 'itinerary', label: '行程' },
    { id: 'cost', label: '記帳' },
    { id: 'prep', label: '準備' },
    { id: 'luggage', label: '行李' },
    { id: 'shopping', label: '購物' },
    { id: 'info', label: '資訊' },
  ];

  return (
    <div className="h-screen flex flex-col font-sans text-tokyo-ink max-w-md mx-auto bg-white border-x border-gray-100 relative shadow-2xl overflow-hidden">
      
      {/* Header */}
      <header className="z-40 bg-white pt-safe-top">
        <div className="px-5 pt-6 pb-4 flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
                <span className="bg-tokyo-ink text-white text-[10px] font-bold px-1.5 py-0.5 tracking-widest uppercase font-mono">2026</span>
                <span className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase font-serif">Tokyo Trip</span>
            </div>
            {/* 標題縮小 1 級 (2xl -> xl) */}
            <h1 className="text-xl font-serif font-bold text-tokyo-ink tracking-[0.05em] leading-tight">
              東京冬之旅
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 mt-1">
             {weather ? (
                <div className="flex items-center space-x-1 text-tokyo-ink bg-gray-50 px-2 py-1 rect-ui border border-gray-100">
                    <Icon name={getWeatherIcon(weather.code)} className="w-4 h-4 text-tokyo-gold" />
                    <span className="text-sm font-bold font-mono">{weather.temperature}°</span>
                </div>
             ) : (
                <div className="w-8 h-4 bg-gray-50 animate-pulse"></div>
             )}
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="grid grid-cols-6 w-full border-b border-gray-100 bg-white">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-3.5 transition-all relative ${
                  isActive ? 'text-tokyo-ink bg-gray-50/50' : 'text-gray-400'
                }`}
              >
                <span className={`text-[13px] font-bold font-serif tracking-tight transition-transform ${isActive ? 'scale-105' : ''}`}>
                  {tab.label}
                </span>
                {isActive && (
                    <div className="absolute bottom-0 left-1 right-1 h-[2.5px] bg-tokyo-ink"></div>
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar bg-[#F7F6F2]">
        <div className="animate-in fade-in duration-500 h-full">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-50 py-2.5 px-6 flex justify-center items-center pointer-events-none">
          <span className="text-[9px] font-mono text-gray-400 tracking-[0.4em] uppercase">Memories 2026</span>
      </footer>
    </div>
  );
}

export default App;
