
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
    <div className="pb-24 px-5 pt-8 space-y-10">
      
      {/* 緊急連絡區塊 */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between border-b-2 border-tokyo-ink pb-2">
            <h3 className="font-serif font-bold text-base text-tokyo-ink tracking-widest">緊急連絡</h3>
        </div>
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white border-2 border-tokyo-ink p-4 rect-ui shadow-paper flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-gray-400 mb-1">警察局</span>
                    <span className="text-xl font-mono font-bold text-tokyo-red">110</span>
                </div>
                <div className="bg-white border-2 border-tokyo-ink p-4 rect-ui shadow-paper flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-gray-400 mb-1">救護車 / 火警</span>
                    <span className="text-xl font-mono font-bold text-tokyo-red">119</span>
                </div>
            </div>
            <div className="bg-white border-2 border-tokyo-ink p-4 rect-ui shadow-paper flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400">外國人急難救助</span>
                <span className="text-lg font-mono font-bold text-tokyo-ink">050-3816-2787</span>
            </div>
        </div>
      </div>

      {/* 實用連結區塊 */}
      <div className="space-y-4">
        <div className="flex items-baseline justify-between border-b-2 border-tokyo-ink pb-2">
            <h3 className="font-serif font-bold text-base text-tokyo-ink tracking-widest">實用連結</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
            {links.map(l => (
                <a key={l.name} href={l.url} target="_blank" className="bg-white p-5 border-2 border-tokyo-ink flex flex-col items-center justify-center text-center space-y-3 hover:bg-gray-50 active:scale-[0.97] transition-all rect-ui shadow-paper">
                    <span className="text-4xl">{l.icon}</span>
                    <div className="border-t border-dashed border-gray-100 w-full pt-3">
                        <span className="block font-bold text-tokyo-ink text-[13px] tracking-tight leading-tight">{l.name}</span>
                    </div>
                </a>
            ))}
        </div>
      </div>

      {/* 注意事項 */}
      <div className="bg-tokyo-ink text-white p-7 rect-ui shadow-xl border-t-8 border-tokyo-gold relative overflow-hidden">
         <div className="absolute -right-4 -bottom-4 text-white/5 text-8xl font-serif select-none pointer-events-none">旅</div>
         <h3 className="font-serif font-bold text-base mb-6 flex items-center border-b border-white/10 pb-3 tracking-widest">
            <span className="bg-tokyo-gold text-tokyo-ink text-[10px] font-bold px-2 py-0.5 rect-ui mr-3">NOTICE</span>
            旅途叮嚀
         </h3>
         <ul className="space-y-4 text-xs font-medium leading-relaxed tracking-wider font-serif">
            <li className="flex items-start">
                <span className="text-tokyo-gold mr-3 font-mono mt-0.5">01</span>
                冬季日本乾燥，隨身攜帶保濕、護唇膏與眼藥水。
            </li>
            <li className="flex items-start">
                <span className="text-tokyo-gold mr-3 font-mono mt-0.5">02</span>
                1月平均氣溫 2°C - 10°C，建議洋蔥式穿法，室內外溫差大。
            </li>
            <li className="flex items-start">
                <span className="text-tokyo-gold mr-3 font-mono mt-0.5">03</span>
                冬季 16:50 左右即日落，戶外景點需及早出發。
            </li>
         </ul>
      </div>

    </div>
  );
};
