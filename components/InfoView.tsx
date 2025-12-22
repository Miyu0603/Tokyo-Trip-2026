
import React from 'react';
import { Icon } from './Shared';

export const InfoView = () => {
  const links = [
      { name: 'VJW 入境申報', url: 'https://vjw-lp.digital.go.jp/zh-hant/', icon: '📝' },
      { name: '日本即時天氣', url: 'https://www.jma.go.jp/bosai/forecast/', icon: '🌤️' },
      { name: '迪士尼 Sea 官網', url: 'https://www.tokyodisneyresort.jp/tc/tds/', icon: '🏰' },
      { name: 'teamLab 官網', url: 'https://www.teamlab.art/zh-hant/e/planets/', icon: '💐' },
  ];

  return (
    <div className="pb-24 px-6 pt-8 space-y-12">
      
      {/* 緊急連絡區塊 */}
      <div className="space-y-6">
        <div className="flex items-baseline justify-between border-b-2 border-tokyo-ink pb-3">
            <h3 className="font-serif font-bold text-lg text-tokyo-ink tracking-widest">緊急連絡 EMERGENCY</h3>
        </div>
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border-2 border-tokyo-ink p-5 rect-ui shadow-sm flex flex-col justify-center">
                    <span className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-tighter">警察局 Police</span>
                    <span className="text-3xl font-mono font-bold text-tokyo-red tracking-tighter">110</span>
                </div>
                <div className="bg-white border-2 border-tokyo-ink p-5 rect-ui shadow-sm flex flex-col justify-center">
                    <span className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-tighter">救護車 Ambulance</span>
                    <span className="text-3xl font-mono font-bold text-tokyo-red tracking-tighter">119</span>
                </div>
            </div>
            <div className="bg-white border-2 border-tokyo-ink p-5 rect-ui shadow-sm flex justify-between items-center">
                <span className="text-xs font-bold text-gray-600 uppercase tracking-tighter">外籍人士救援 Foreign Help</span>
                <span className="text-xl font-mono font-bold text-tokyo-ink">050-3816-2787</span>
            </div>
        </div>
      </div>

      {/* 實用連結區塊 */}
      <div className="space-y-6">
        <div className="flex items-baseline justify-between border-b-2 border-tokyo-ink pb-3">
            <h3 className="font-serif font-bold text-lg text-tokyo-ink tracking-widest">實用連結 LINKS</h3>
        </div>
        <div className="grid grid-cols-2 gap-5">
            {links.map(l => (
                <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer" className="bg-white p-6 border-2 border-tokyo-ink flex flex-col items-center justify-center text-center space-y-4 hover:bg-gray-50 active:scale-[0.97] transition-all rect-ui">
                    <span className="text-5xl" role="img" aria-label={l.name}>{l.icon}</span>
                    <div className="border-t border-dashed border-gray-100 w-full pt-4">
                        <span className="block font-bold text-tokyo-ink text-sm tracking-tight leading-tight">{l.name}</span>
                    </div>
                </a>
            ))}
        </div>
      </div>

      {/* 注意事項 */}
      <div className="bg-tokyo-ink text-white p-8 rect-ui border-t-8 border-tokyo-gold relative overflow-hidden">
         <h3 className="font-serif font-bold text-lg mb-8 flex items-center border-b border-white/10 pb-4 tracking-widest">
            <span className="bg-tokyo-gold text-tokyo-ink text-xs font-bold px-3 py-1 rect-ui mr-4">NOTICE</span>
            旅途叮嚀
         </h3>
         <ul className="space-y-6 text-sm font-medium leading-relaxed tracking-wider font-serif">
            <li className="flex items-start">
                <span className="text-tokyo-gold mr-4 font-mono text-base mt-0.5" aria-hidden="true">01</span>
                冬季日本極度乾燥，建議隨身攜帶保濕乳液、護唇膏與眼藥水。
            </li>
            <li className="flex items-start">
                <span className="text-tokyo-gold mr-4 font-mono text-base mt-0.5" aria-hidden="true">02</span>
                1月均溫 2°C - 10°C，建議採「洋蔥式穿法」。
            </li>
            <li className="flex items-start">
                <span className="text-tokyo-gold mr-4 font-mono text-base mt-0.5" aria-hidden="true">03</span>
                冬季 16:50 左右即日落，戶外行程務必規劃早出。
            </li>
         </ul>
      </div>

    </div>
  );
};
