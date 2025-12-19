
import React, { useState } from 'react';
import { ITINERARY_DATA } from '../constants';
import { ItineraryItem } from '../types';
import { Icon, Modal } from './Shared';

export const ItineraryView = () => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<ItineraryItem | null>(null);

  const currentDay = ITINERARY_DATA[selectedDateIndex];
  const dayLabels = ["六", "日", "一", "二", "三", "四"];
  const isLastDay = selectedDateIndex === ITINERARY_DATA.length - 1;

  return (
    <div className="pb-24">
      {/* Date Selector */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-4 py-3 flex justify-center">
        <div className="flex w-full justify-between items-center">
            {ITINERARY_DATA.map((day, idx) => {
            const dateParts = day.date.split('/');
            const dayNum = dateParts[2];
            const isActive = idx === selectedDateIndex;
            
            return (
                <button
                key={day.date}
                onClick={() => setSelectedDateIndex(idx)}
                className={`flex flex-col items-center justify-center w-10 h-12 transition-all duration-200 rect-ui ${
                    isActive ? 'bg-tokyo-ink text-white' : 'text-gray-600'
                }`}
                >
                <span className="text-[10px] font-bold font-serif leading-none mb-1">{dayLabels[idx]}</span>
                <span className="text-xs font-bold font-mono leading-none opacity-60">{dayNum}</span>
                </button>
            );
            })}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-2">
        <div className="mb-6 flex flex-col border-b border-gray-100 pb-3">
            <span className="text-[10px] font-bold text-tokyo-gold uppercase tracking-[0.2em] mb-1">Itinerary Log</span>
            <h2 className="text-2xl font-serif font-bold text-tokyo-ink leading-tight mb-1">
                {currentDay.dayLabel.includes(' - ') ? currentDay.dayLabel.split(' - ')[1] : currentDay.dayLabel}
            </h2>
            {currentDay.hotel && (
              <div className="flex items-center text-[11px] font-bold text-gray-400">
                <Icon name="luggage" className="w-3.5 h-3.5 mr-1 opacity-50" />
                {(!isLastDay && currentDay.hotelMapUrl) ? (
                  <a 
                    href={currentDay.hotelMapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="underline decoration-gray-200 underline-offset-2 hover:text-tokyo-ink transition-colors"
                  >
                    {currentDay.hotel}
                  </a>
                ) : (
                  <span>{currentDay.hotel}</span>
                )}
              </div>
            )}
        </div>
        
        <div className="relative pl-2">
          <div className="absolute left-[3.25rem] top-4 bottom-4 w-[1px] bg-gray-200"></div>
          <div className="space-y-6">
            {currentDay.items.map((item) => (
              <div key={item.id} className="relative flex items-start group">
                  <div className="flex flex-col items-center w-12 mr-6 pt-1">
                      <span className="text-[10px] font-mono font-bold text-gray-600 mb-2">{item.time}</span>
                      <div className={`w-3 h-3 z-10 border-2 border-white rounded-full ${item.isHighlight ? 'bg-tokyo-red' : 'bg-tokyo-ink'}`}></div>
                  </div>
                  <div 
                      onClick={() => setSelectedItem(item)}
                      className={`flex-1 bg-white border border-gray-200 p-3 rect-ui shadow-sm active:bg-gray-50 transition-all cursor-pointer ${
                          item.isHighlight ? 'border-l-4 border-l-tokyo-red' : ''
                      }`}
                  >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {item.icon && <span className="text-lg">{item.icon}</span>}
                            <h3 className="font-bold text-tokyo-ink text-sm leading-tight truncate">{item.title}</h3>
                        </div>
                      </div>
                      {item.transport && (
                          <div className="text-[9px] text-tokyo-gold font-bold uppercase mt-1 px-1.5 py-0.5 bg-tokyo-gold/5 inline-block">
                              {item.transport.detail}
                          </div>
                      )}
                  </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title={selectedItem?.title || ''}>
        <div className="space-y-6">
            {selectedItem?.location && (
              <div className="space-y-3 pt-2">
                <h4 className="font-serif font-bold text-[9px] text-gray-400 uppercase tracking-widest">地點資訊 LOCATION</h4>
                <div className="flex flex-col space-y-3">
                  <div className="space-y-1">
                    {selectedItem.location.description && (
                      <p className="text-sm font-bold text-tokyo-ink">{selectedItem.location.description}</p>
                    )}
                    {selectedItem.location.address && (
                      <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{selectedItem.location.address}</p>
                    )}
                  </div>
                  {selectedItem.location.mapUrl && (
                    <a 
                      href={selectedItem.location.mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-full py-3 bg-tokyo-ink text-white rect-ui font-bold text-xs transition-opacity active:opacity-90"
                    >
                      <span>開啟Google Maps</span>
                    </a>
                  )}
                </div>
              </div>
            )}

            {selectedItem?.notes && selectedItem.notes.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-serif font-bold text-[9px] text-gray-400 uppercase tracking-widest">備註 NOTES</h4>
                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-4 rect-ui">
                        <ul className="space-y-2 text-tokyo-ink text-[11px] font-bold list-none">
                            {selectedItem.notes.map((note, i) => (
                                <li key={i} className="flex items-start">
                                    <span className="text-tokyo-red mr-2 font-mono">▸</span> 
                                    <span className="leading-relaxed">{note}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
      </Modal>
    </div>
  );
};
