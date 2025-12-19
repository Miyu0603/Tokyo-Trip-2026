
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
      case 'prep': return <ListsView type="prep" />;
      case 'luggage': return <ListsView type="luggage" />;
      case 'shopping': return <ListsView type="shopping" />;
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
        <div className="px-6 pt-6 pb-4 flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2 mb-1">
                <span className="bg-tokyo-ink text-white text-[8px] font-bold px-1.5 py-0.5 tracking-widest uppercase font-mono">2026</span>
                <span className="text-[8px] text-gray-600 font-bold tracking-[0.2em] uppercase font-serif">Tokyo Winter Trip</span>
            </div>
            <h1 className="text-xl font-serif font-bold text-tokyo-ink tracking-[0.1em] leading-none">
              東京冬之旅
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
             {weather ? (
                <div className="flex items-center space-x-1.5 text-tokyo-ink">
                    <Icon name={getWeatherIcon(weather.code)} className="w-5 h-5" />
                    <span className="text-sm font-bold font-mono">{weather.temperature}°C</span>
                </div>
             ) : (
                <div className="w-8 h-4 bg-gray-50 animate-pulse"></div>
             )}
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex w-full border-b border-gray-100 overflow-x-auto no-scrollbar bg-white">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[60px] flex flex-col items-center justify-center py-3 transition-all relative ${
                  isActive ? 'text-tokyo-ink' : 'text-gray-600 hover:text-tokyo-ink'
                }`}
              >
                <span className={`text-xs font-bold font-serif tracking-widest ${isActive ? 'scale-110' : ''}`}>
                  {tab.label}
                </span>
                {isActive && (
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-[2px] bg-tokyo-ink"></div>
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar bg-[#F7F6F2]">
        <div className="animate-in fade-in duration-500">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-50 py-2 px-6 flex justify-center items-center pointer-events-none">
          <span className="text-[8px] font-mono text-gray-400 tracking-[0.5em] uppercase">Memories 2026</span>
      </footer>
    </div>
  );
}

export default App;
