
import { DailyItinerary, LuggageItem, ShoppingItem } from './types';

export const APP_CONFIG = {
  gasApiUrl: 'https://script.google.com/macros/s/AKfycbwWvL3KQ8oVMftbL9kdMHfj47Ijp2tSlrYMUBegEAvQPEmsATivodE8wPiD_VfJjWXShg/exec',
  defaultCurrency: 'JPY',
};

export const LUGGAGE_WARNINGS = {
  'carry-on': '⚠️ 液體容器限 100ml 以內，且需裝入透明夾鏈袋。',
  'checked': '🚫 嚴禁攜帶行動電源、鋰電池及打火機於托運行李。'
};

export const ITINERARY_DATA: DailyItinerary[] = [
  {
    date: '2026/01/10',
    dayLabel: 'Day 1 - 抵達與淺草散策',
    hotel: '東京皇家王子大飯店花園塔',
    hotelMapUrl: 'https://www.google.com/maps/search/?api=1&query=The+Prince+Park+Tower+Tokyo',
    items: [
      { id: '1-1', time: '13:00', title: '抵達機場', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Haneda+Airport+International+Terminal' }, notes: ['13:40 預計完成出關'] },
      { 
        id: '1-2', 
        time: '14:00', 
        title: '濱松町站寄放行李', 
        location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hamamatsucho+Station' },
        notes: ['ecbo cloak 預約 locker'] 
      },
      { 
        id: '1-3', 
        time: '15:00', 
        title: '今戶神社', 
        icon: '⛩️',
        location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Imado+Shrine' },
        notes: ['介紹：招財貓與求姻緣聖地', '營業：⚠️ 16:00 關門'] 
      },
      { 
        id: '1-4', 
        time: '16:00', 
        title: '淺草散策', 
        location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Senso-ji+Asakusa' },
        notes: ['仲見世商店街、淺草寺 (18:00關)、西參道商店街'] 
      },
      { id: '1-5', time: '17:30', title: '晚餐：牛舌', isHighlight: true, location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Asakusa+Gyutan+Restaurant' }, notes: ['✅ 已預約'] },
      { id: '1-6', time: '19:00', title: '回濱松町北口取行李', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hamamatsucho+Station+North+Exit' } },
      { id: '1-7', time: '19:45', title: '接駁車往飯店', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=The+Prince+Park+Tower+Tokyo' } },
      { id: '1-8', time: '20:45', title: '東京鐵塔 (Klook)', isHighlight: true, location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Tokyo+Tower' }, notes: ['✅ 已預約 (Klook)'] }
    ]
  },
  {
    date: '2026/01/11',
    dayLabel: 'Day 2 - 表參道與池袋',
    hotel: '東京皇家王子大飯店花園塔',
    items: [
      { id: '2-1', time: '09:00', title: "Sarabeth's 表參道", isHighlight: true, location: { mapUrl: 'https://maps.app.goo.gl/TRdicotgqEPzv3E27' }, notes: ['✅ 已預約', '介紹：紐約早餐女王'] },
      { id: '2-2', time: '10:30', title: "I'm donut ? 表參道", location: { mapUrl: 'https://maps.app.goo.gl/R8wpcfsMXVvcrUyY8' }, notes: ['介紹：排隊名店生甜甜圈'] },
      { id: '2-3', time: '12:00', title: "明治神宮", icon: '⛩️', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Meiji+Jingu' } },
      { id: '2-4', time: '13:00', title: "東鄉神社", icon: '⛩️', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Togo+Shrine' } },
      { id: '2-5', time: '14:00', title: "Flying Tiger 表參道", location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Flying+Tiger+Copenhagen+Omotesando' }, notes: ['介紹：北歐平價設計雜貨'] },
      { id: '2-6', time: '14:45', title: "TokiiRo 文具×時計", location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=TokiiRo+Omotesando' }, notes: ['介紹：特色文具選物店'] },
      { id: '2-7', time: '15:30', title: "新宿 Lumine EST", location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Lumine+EST+Shinjuku' }, notes: ['流行服飾購物'] },
      { id: '2-8', time: '18:00', title: "池袋散策", location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sunshine+City+Ikebukuro' }, notes: ['安利美特池袋本店、太陽城'] },
      { id: '2-9', time: '19:30', title: "晚餐：和牛壽喜燒 極", isHighlight: true, location: { mapUrl: 'https://maps.app.goo.gl/r9zWaYzdfr6ciyPm7' }, notes: ['✅ 已預約 (150g)', '地點：池袋東口店'] },
      { id: '2-10', time: '20:45', title: "PUBLIC TOKYO 池袋", location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=PUBLIC+TOKYO+Ikebukuro' }, notes: ['⚠️ 21:00 關門', '重點：佳穎的大衣'] }
    ]
  },
  {
    date: '2026/01/12',
    dayLabel: 'Day 3 - 澀谷與移動日',
    hotel: '東京灣凱悅飯店',
    hotelMapUrl: 'https://www.google.com/maps/search/?api=1&query=Hyatt+Regency+Tokyo+Bay',
    items: [
      { id: '3-1', time: '08:00', title: 'Path 鐵鍋鬆餅', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=PATH+Yoyogi+Hachiman' }, notes: ['需排隊', '介紹：代代木名店'] },
      { id: '3-2', time: '10:00', title: '代代木公園 & 原宿商圈', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Yoyogi+Park' }, notes: ['行李已由 Airporter 送往飯店', '.st niko and...', 'The North Face'] },
      { id: '3-3', time: '12:00', title: '午餐：烏龍義大利麵/AFURI', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=AFURI+Harajuku' }, notes: ['うどん伊呂波 或 AFURI原宿'] },
      { id: '3-4', time: '14:00', title: '小杉湯 原宿', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kosugiyu+Harajuku' }, notes: ['介紹：入駐原宿的百年錢湯分店'] },
      { id: '3-5', time: '15:00', title: 'Kenyan Shibuya 奶茶', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Kenyan+Shibuya' }, notes: ['介紹：澀谷經典伯爵奶茶'] },
      { id: '3-6', time: '16:00', title: '澀谷購物巡禮', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Shibuya+Scramble+Crossing' }, notes: ['EMIS, HARE, FREAK\'S STORE', 'RAGEBLUE, Tower Records, shinq shiro'] },
      { id: '3-7', time: '17:30', title: '澀谷 PARCO', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Shibuya+PARCO' }, notes: ['Ikushika'] },
      { id: '3-8', time: '19:30', title: 'Loft & Muji', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Loft+Shibuya' }, notes: ['澀谷旗艦店'] },
      { id: '3-9', time: '21:00', title: '抵達飯店', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hyatt+Regency+Tokyo+Bay' }, notes: ['東京灣凱悅飯店'] }
    ]
  },
  {
    date: '2026/01/13',
    dayLabel: 'Day 4 - 迪士尼海洋',
    hotel: '東京灣凱悅飯店',
    items: [
      { id: '4-1', time: '07:30', title: '飯店早餐', isHighlight: true, location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hyatt+Regency+Tokyo+Bay+Restaurant' }, notes: ['✅ 已預訂'] },
      { id: '4-2', time: '08:00', title: '接駁車往迪士尼', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Tokyo+DisneySea' }, notes: ['車程約 20 min'] },
      { id: '4-3', time: '08:30', title: 'Disney SEA', isHighlight: true, location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Tokyo+DisneySea+Entrance' } }
    ]
  },
  {
    date: '2026/01/14',
    dayLabel: 'Day 5 - 豐洲與六本木',
    hotel: '三井花園飯店銀座築地',
    hotelMapUrl: 'https://www.google.com/maps/search/?api=1&query=Mitsui+Garden+Hotel+Ginza+Tsukiji',
    items: [
      { id: '5-1', time: '08:30', title: '飯店早餐', isHighlight: true, location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hyatt+Regency+Tokyo+Bay' }, notes: ['✅ 已預訂'] },
      { id: '5-2', time: '09:30', title: 'Check out', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hyatt+Regency+Tokyo+Bay' }, notes: ['前往三井築地銀座飯店'] },
      { id: '5-3', time: '11:00', title: '飯店寄放行李', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Mitsui+Garden+Hotel+Ginza+Tsukiji' }, notes: ['三井花園飯店銀座築地'] },
      { id: '5-4', time: '11:15', title: '午餐', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Tsukiji+Outer+Market+Restaurants' }, notes: ['飯店附近用餐'] },
      { id: '5-5', time: '12:30', title: 'teamLab 豐洲', isHighlight: true, location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=teamLab+Planets+TOKYO' }, notes: ['✅ 已預約 (12:30-15:00)', '需從飯店叫車前往'] },
      { id: '5-6', time: '15:30', title: '日枝神社', icon: '⛩️', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hie+Shrine' }, notes: ['叫車前往'] },
      { id: '5-7', time: '16:00', title: '赤坂冰川神社', icon: '⛩️', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Akasaka+Hikawa+Shrine' }, notes: ['叫車前往'] },
      { id: '5-8', time: '16:30', title: '六本木購物', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Roppongi+Hills' }, notes: ['UQ, Muji, HARBS'] },
      { id: '5-9', time: '18:00', title: '晚餐：Iruca Tokyo 拉麵', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Iruca+Tokyo+Roppongi' }, notes: ['介紹：六本木松露拉麵名店'] },
      { id: '5-10', time: '19:30', title: '六本木夜景', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Mori+Tower+Tokyo+City+View' }, notes: ['森大樓展望台'] },
      { id: '5-11', time: '20:00', title: 'OYOGE 鯛魚燒', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=OYOGE+Roppongi' }, notes: ['回飯店泡湯休息'] }
    ]
  },
  {
    date: '2026/01/15',
    dayLabel: 'Day 6 - 築地與返程',
    hotel: '返程移動',
    items: [
      { id: '6-1', time: '08:30', title: '築地市場', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Tsukiji+Outer+Market' }, notes: ['築地山長玉子燒', 'Senriken, 鳥藤分店'] },
      { id: '6-2', time: '11:00', title: 'Check out', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Mitsui+Garden+Hotel+Ginza+Tsukiji' }, notes: ['行李寄放飯店'] },
      { id: '6-3', time: '11:30', title: '東京大神宮', icon: '⛩️', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Tokyo+Daijingu' } },
      { id: '6-4', time: '12:00', title: '午餐：かつ吉 水道橋店', isHighlight: true, location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Katsukichi+Suidobashi' }, notes: ['✅ 已預約', '介紹：炸豬排名店'] },
      { id: '6-5', time: '14:00', title: '伴手禮採買', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Tokyo+Station+Ichibangai' }, notes: ['治一郎、MARLOWE 布丁'] },
      { id: '6-6', time: '15:00', title: '回飯店出發羽田機場', location: { mapUrl: 'https://www.google.com/maps/search/?api=1&query=Haneda+Airport+Terminal+3' }, notes: ['預備返程'] }
    ]
  }
];

export const INITIAL_PACKING_LIST: LuggageItem[] = [
  // Carry-on 隨身行李
  { id: 'co-1', name: '護照', category: 'carry-on', completed: false },
  { id: 'co-2', name: '台灣駕照', category: 'carry-on', completed: false },
  { id: 'co-3', name: '駕照譯本', category: 'carry-on', completed: false },
  { id: 'co-4', name: '錢包（日幣&信用卡）', category: 'carry-on', completed: false },
  { id: 'co-5', name: '耳機', category: 'carry-on', completed: false },
  { id: 'co-6', name: '行動電源', category: 'carry-on', completed: false },
  { id: 'co-7', name: '充電線', category: 'carry-on', completed: false },
  { id: 'co-8', name: '充電頭', category: 'carry-on', completed: false },
  { id: 'co-9', name: '保溫杯', category: 'carry-on', completed: false },
  { id: 'co-10', name: '牙線棒', category: 'carry-on', completed: false },
  { id: 'co-11', name: '護唇膏', category: 'carry-on', completed: false },
  { id: 'co-12', name: '雨傘', category: 'carry-on', completed: false },
  { id: 'co-13', name: '袖珍包面紙', category: 'carry-on', completed: false },
  { id: 'co-14', name: '口罩', category: 'carry-on', completed: false },
  { id: 'co-15', name: '眼藥水', category: 'carry-on', completed: false },
  { id: 'co-16', name: '常備藥品', category: 'carry-on', completed: false },
  { id: 'co-17', name: '手機掛繩', category: 'carry-on', completed: false },

  // Checked 託運行李
  { id: 'ch-1', name: '浴巾毛巾', category: 'checked', completed: false },
  { id: 'ch-2', name: '錢包台幣', category: 'checked', completed: false },
  { id: 'ch-3', name: '換洗衣物（衣褲鞋襪）', category: 'checked', completed: false },
  { id: 'ch-4', name: '保養品', category: 'checked', completed: false },
  { id: 'ch-5', name: '化妝品', category: 'checked', completed: false },
  { id: 'ch-6', name: '防曬', category: 'checked', completed: false },
  { id: 'ch-7', name: '護髮', category: 'checked', completed: false },
  { id: 'ch-8', name: '牙刷牙膏', category: 'checked', completed: false },
  { id: 'ch-9', name: '折疊衣架', category: 'checked', completed: false },
  { id: 'ch-10', name: '梳子', category: 'checked', completed: false },
  { id: 'ch-11', name: '睡衣', category: 'checked', completed: false },
  { id: 'ch-12', name: '藥品（內外用、痠痛藥）', category: 'checked', completed: false },
  { id: 'ch-13', name: '牙線棒', category: 'checked', completed: false },
  { id: 'ch-14', name: '離子夾', category: 'checked', completed: false },
  { id: 'ch-15', name: '行李袋', category: 'checked', completed: false },
  { id: 'ch-16', name: '指甲剪', category: 'checked', completed: false },
];

export const INITIAL_SHOPPING_LIST: ShoppingItem[] = [
  { id: 's-1', name: 'Uniqlo 發熱衣', completed: false },
  { id: 's-2', name: '日本限定零食', completed: false },
  { id: 's-3', name: '藥妝 (合利他命/眼藥水)', completed: false },
];
