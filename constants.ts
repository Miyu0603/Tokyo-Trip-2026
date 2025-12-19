
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
    dayLabel: 'Day 1 - 抵達東京',
    hotel: '東京皇家王子大飯店花園塔',
    hotelMapUrl: 'https://www.google.com/maps/search/?api=1&query=The+Prince+Park+Tower+Tokyo',
    items: [
      {
        id: '1-1',
        time: '09:10',
        title: 'TSA 台北松山機場 T1',
        transport: { type: 'flight', detail: '日本航空 JL096 | 經濟艙 | 波音 787-800' },
        location: { 
          description: '台北松山機場 T1', 
          address: '台北市松山區敦化北路340-9號',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=台北松山機場' 
        },
        notes: [
          '出發: 台北 - 東京 | 2026 年 1 月 10 日',
          '所有出發/抵達時間均為當地時間',
          '請提前 2.5 小時抵達機場辦理登機'
        ]
      },
      {
        id: '1-2',
        time: '13:00',
        title: 'HND 羽田機場 T3',
        location: { 
          description: '羽田機場第 3 航廈', 
          address: '東京都大田區羽田空港２丁目６−５',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=羽田空港第3ターミナル' 
        },
        notes: ['入境審查', '領取 Wifi/Sim 卡', '購買 Pasmo/Suica']
      },
      {
        id: '1-3',
        time: '14:00',
        title: '淺草神社',
        icon: '⛩️',
        location: { 
          description: '台東區淺草 2-3-1', 
          address: '東京都台東區淺草２丁目３−１',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=淺草神社' 
        },
        notes: ['淺草寺旁的清幽神社，供奉三位對淺草寺有功的人。']
      },
      {
        id: '1-4',
        time: '16:00',
        title: '今戶神社',
        icon: '⛩️',
        location: { 
          description: '台東區今戶 1-5-22', 
          address: '東京都台東區今戶１丁目５−２２',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=今戶神社' 
        },
        notes: ['招財貓發源地，也是著名的求姻緣聖地。']
      },
      {
        id: '1-5',
        time: '17:30',
        title: '晚餐：牛舌料理',
        isHighlight: true,
        notes: ['✅ 已預約', '推薦厚切牛舌，搭配麥飯與山藥泥。']
      },
      {
        id: '1-6',
        time: '19:00',
        title: '回飯店 Check-in',
        location: { 
          description: '東京皇家王子大飯店花園塔', 
          address: '東京都港區芝公園４丁目８−１',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=The+Prince+Park+Tower+Tokyo' 
        }
      },
      {
        id: '1-7',
        time: '20:45',
        title: '東京鐵塔 (Klook)',
        isHighlight: true,
        location: { 
          address: '東京都港區芝公園４丁目２−８',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=東京鐵塔' 
        },
        notes: ['✅ Klook 預約時間：20:45', '東京永恆的地標，冬季點燈非常浪漫。']
      }
    ]
  },
  {
    date: '2026/01/11',
    dayLabel: 'Day 2 - 明治神宮 × 新宿 × 池袋',
    hotel: '東京皇家王子大飯店花園塔',
    hotelMapUrl: 'https://www.google.com/maps/search/?api=1&query=The+Prince+Park+Tower+Tokyo',
    items: [
      {
        id: '2-1',
        time: '09:00',
        title: '明治神宮',
        icon: '⛩️',
        isHighlight: true,
        location: { 
          description: '澀谷區代代木神園町 1-1', 
          address: '東京都渋谷區代々木神園町１−１',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=明治神宮' 
        },
        notes: ['東京都心規模最大的綠地。', '清晨散步空氣極佳。']
      },
      {
        id: '2-2',
        time: '11:30',
        title: '新宿逛街',
        location: { 
          description: '新宿站南口 NEWoMan', 
          address: '東京都新宿區新宿４丁目１−６',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=NEWoMan+Shinjuku' 
        },
        notes: ['LUMINE 1/2 適合買衣服', 'NEWoMan 選物店多']
      },
      {
        id: '2-3',
        time: '16:30',
        title: '池袋 Sunshine City',
        location: { 
          description: '豐島區東池袋 3-1-1', 
          address: '東京都豊島區東池袋３丁目１−１',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Sunshine+City' 
        },
        notes: ['Pokemon Center、Animate 旗艦店都在這。']
      }
    ]
  },
  {
    date: '2026/01/12',
    dayLabel: 'Day 3 - 原宿與移動日',
    hotel: '東京灣凱悅飯店',
    hotelMapUrl: 'https://www.google.com/maps/search/?api=1&query=Hyatt+Regency+Tokyo+Bay',
    items: [
      { id: '3-1', time: '09:00', title: 'Check out' },
      { 
        id: '3-2', 
        time: '10:00', 
        title: '代代木公園', 
        location: { 
          address: '東京都渋谷區代々木神園町２−１',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=代代木公園' 
        } 
      },
      { 
        id: '3-3', 
        time: '13:30', 
        title: '東鄉神社', 
        icon: '⛩️', 
        location: { 
          address: '東京都渋谷區神宮前１丁目５−３',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=東鄉神社' 
        } 
      },
      { 
        id: '3-4', 
        time: '14:00', 
        title: '原宿 (niko and...)', 
        location: { 
          description: 'niko and... TOKYO',
          address: '東京都渋谷區神宮前６丁目１２−２０',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=niko+and+TOKYO' 
        } 
      },
      { 
        id: '3-5', 
        time: '15:00', 
        title: '表參道、涉谷', 
        notes: ['表參道精品街與澀谷十字路口散策。', '步行距離較長，建議穿好走的鞋子。'] 
      },
      { 
        id: '3-6', 
        time: '18:00', 
        title: '前往東京灣凱悅飯店', 
        location: { 
          description: '東京灣凱悅飯店', 
          address: '千葉県浦安市明海５丁目８−２３',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Hyatt+Regency+Tokyo+Bay' 
        } 
      }
    ]
  },
  {
    date: '2026/01/13',
    dayLabel: 'Day 4 - 迪士尼海洋',
    hotel: '東京灣凱悅飯店',
    hotelMapUrl: 'https://www.google.com/maps/search/?api=1&query=Hyatt+Regency+Tokyo+Bay',
    items: [
      { id: '4-1', time: '07:30', title: '飯店早餐' },
      { id: '4-2', time: '08:00', title: '接駁車到迪士尼', notes: ['車程約 20 min'] },
      { 
        id: '4-3', 
        time: '08:30', 
        title: 'Tokyo DisneySea', 
        isHighlight: true, 
        location: { 
          address: '千葉県浦安市舞浜１−１３',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=Tokyo+DisneySea' 
        }, 
        notes: ['Fantasy Springs 入園須抽預約等候卡。'] 
      }
    ]
  },
  {
    date: '2026/01/14',
    dayLabel: 'Day 5 - 藝術與銀座夜景',
    hotel: '東京灣凱悅飯店',
    hotelMapUrl: 'https://www.google.com/maps/search/?api=1&query=Hyatt+Regency+Tokyo+Bay',
    items: [
      { id: '5-1', time: '08:30', title: '飯店早餐' },
      { id: '5-2', time: '10:00', title: 'Check out / 寄放行李' },
      { 
        id: '5-3', 
        time: '12:30', 
        title: 'TeamLab 豐洲', 
        isHighlight: true, 
        location: { 
          address: '東京都江東區豐洲６丁目１−１６',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=teamLab+Planets' 
        }, 
        notes: ['需赤腳進入，建議著膝蓋以上長褲。'] 
      },
      { 
        id: '5-4', 
        time: '15:30', 
        title: '日枝神社', 
        icon: '⛩️', 
        location: { 
          address: '東京都千代田區永田町２丁目１０−５',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=日枝神社' 
        }, 
        notes: ['藏身於赤坂商業區的神社，有美麗的鳥居。'] 
      },
      { 
        id: '5-5', 
        time: '17:00', 
        title: '赤坂冰川神社', 
        icon: '⛩️', 
        location: { 
          address: '東京都港區赤坂６丁目１０−１２',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=赤坂冰川神社' 
        } 
      },
      { 
        id: '5-6', 
        time: '18:30', 
        title: '六本木夜景', 
        isHighlight: true, 
        location: { 
          address: '東京都港區六本木６丁目１０−１',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=六本木ヒルズ展望台' 
        }, 
        notes: ['森大樓 52 樓展望台。'] 
      }
    ]
  },
  {
    date: '2026/01/15',
    dayLabel: 'Day 6 - 築地與返程',
    hotel: '返程移動',
    items: [
      { 
        id: '6-1', 
        time: '08:30', 
        title: '築地市場', 
        location: { 
          address: '東京都中央區築地４丁目１６−２',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=築地市場' 
        }, 
        notes: ['雖然場內搬遷，場外市場依舊美食雲集。'] 
      },
      { 
        id: '6-2', 
        time: '10:30', 
        title: '東京大神宮', 
        icon: '⛩️', 
        location: { 
          address: '東京都千代田區富士見２丁目４−１',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=東京大神宮' 
        }, 
        notes: ['東京著名的結緣之神。'] 
      },
      { 
        id: '6-3', 
        time: '12:00', 
        title: '東京車站', 
        location: { 
          address: '東京都千代田區丸の内１丁目９−１',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=東京駅' 
        }, 
        notes: ['站內一番街非常大，可一次買齊伴手禮。'] 
      },
      { id: '6-4', time: '15:00', title: '前往羽田機場', notes: ['準備返台。'] },
      { 
        id: '6-5', 
        time: '18:10', 
        title: 'HND 羽田機場 T3', 
        transport: { type: 'flight', detail: '日本航空 JL099 | 經濟艙 | 波音 787-800' },
        location: { 
          address: '東京都大田區羽田空港２丁目６−５',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=羽田空港第3ターミナル' 
        },
        notes: [
          '返回: 東京 - 台北 | 2026 年 1 月 15 日',
          '所有出發/抵達時間均為當地時間'
        ]
      },
      { 
        id: '6-6', 
        time: '21:00', 
        title: 'TSA 台北松山機場 T1',
        location: { 
          address: '台北市松山區敦化北路340-9號',
          mapUrl: 'https://www.google.com/maps/search/?api=1&query=台北松山機場' 
        }
      }
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
  // Fix syntax error: removed duplicated 'id:' property definition
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
