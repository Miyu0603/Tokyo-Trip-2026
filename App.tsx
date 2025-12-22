import React, { useState, useEffect, lazy, Suspense } from 'react';
import { TabType, WeatherData } from './types';
import { ItineraryView } from './components/ItineraryView';
import { Icon } from './components/Shared';
import { fetchTokyoWeather, getWeatherIcon } from './services/weatherService';

// 延遲載入非首頁必要元件
const CostView = lazy(() => import('./components/CostView').then(m => ({ default: m.CostView })));
const ListsView = lazy(() => import('./components/ListsView').then(m => ({ default: m.ListsView })));
const InfoView = lazy(() => import('./components/InfoView').then(m => ({ default: m.InfoView })));

// 載入中的佔位元件
const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-4 animate-in fade-in duration-500">
    <div className="w-8 h-8 border-4 border-tokyo-ink border-t-transparent animate-spin rect-ui"></div>
    <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">Loading...</span>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('itinerary');
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    // 延遲抓取天氣，讓主線程優先處理 UI 渲染
    const timer = setTimeout(() => {
      fetchTokyoWeather().then(setWeather);
    }, 500);

    const handleFocusOut = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
      }
    };

    window.addEventListener('focusout', handleFocusOut);
    return () => {
      window.removeEventListener('focusout', handleFocusOut);
      clearTimeout(timer);
    };
  }, []);

  const renderContent = () => {
    return (
      <Suspense fallback={<LoadingFallback />}>
        {(() => {
          switch (activeTab) {
            case 'itinerary': return <ItineraryView />;
            case 'cost': return <CostView />;
            case 'prep': return <ListsView key="prep" type="prep" />;
            case 'luggage': return <ListsView key="luggage" type="luggage" />;
            case 'shopping': return <ListsView key="shopping" type="shopping" />;
            case 'info': return <InfoView />;
            default: return <ItineraryView />;
          }
        })()}
      </Suspense>
    );
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
    <div className="h-[100dvh] flex flex-col font-sans text-tokyo-ink max-w-md mx-auto bg-white border-x border-gray-100 relative shadow-2xl overflow-hidden">
      
      {/* Header */}
      <header className="z-40 bg-white pt-safe-top shrink-0">
        <div className="px-5 pt-6 pb-4 flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
                <span className="bg-tokyo-ink text-white text-[10px] font-bold px-1.5 py-0.5 tracking-widest uppercase font-mono">2026</span>
                <span className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase font-serif">Tokyo Trip</span>
            </div>
            <h1 className="text-xl font-serif font-bold text-tokyo-ink tracking-[0.05em] leading-tight">
              東京冬之旅
            </h1>
          </div>
          
          {/* CLS 優化：精準控制寬高，確保 skeleton 與實體內容大小完全一致 */}
          <div className="mt-1 w-[60px] h-[30px] flex items-center justify-end">
             {weather ? (
                <div className="flex items-center space-x-1 text-tokyo-ink bg-gray-50 px-2 h-[28px] rect-ui border border-gray-100 animate-in fade-in zoom-in-95 duration-300">
                    <Icon name={getWeatherIcon(weather.code)} className="w-4 h-4 text-tokyo-gold shrink-0" />
                    <span className="text-sm font-bold font-mono leading-none">{weather.temperature}°</span>
                </div>
             ) : (
                <div className="w-14 h-[28px] bg-gray-50 rect-ui border border-gray-100 animate-pulse"></div>
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

      {/* Main Content Area: CLS 優化 - 提供最小高度 */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar bg-[#F7F6F2] min-h-0">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 h-full min-h-[500px]">
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-50 py-2.5 px-6 flex justify-center items-center pointer-events-none shrink-0">
          <span className="text-[9px] font-mono text-gray-400 tracking-[0.4em] uppercase">Memories 2026</span>
      </footer>
    </div>
  );
}

export default App;
