
import React, { useState, useEffect } from 'react';
import { INITIAL_PACKING_LIST, INITIAL_SHOPPING_LIST, LUGGAGE_WARNINGS } from '../constants';
import { Icon, Modal } from './Shared';

type ListType = 'prep' | 'luggage' | 'shopping';

// Define the component using React.FC to allow standard React props like 'key' in parent components
export const ListsView: React.FC<{ type: ListType }> = ({ type }) => {
  const getStorageKey = () => `tokyo_list_${type}`;
  
  // 使用延遲初始化 (Lazy Initializer)，確保組件一建立就拿到正確的資料
  const [items, setItems] = useState<any[]>(() => {
    const saved = localStorage.getItem(`tokyo_list_${type}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    // 預設資料
    if (type === 'luggage') return INITIAL_PACKING_LIST;
    if (type === 'shopping') return INITIAL_SHOPPING_LIST;
    return [
      {id: 'p-1', name: 'Visit Japan Web 完成', completed: false},
      {id: 'p-2', name: '海外旅遊保險投保', completed: false},
      {id: 'p-3', name: '日幣現金預兌換', completed: false},
      {id: 'p-4', name: '網卡/漫遊數據設定', completed: false},
    ];
  });

  const [activeTab, setActiveTab] = useState<'carry-on'|'checked'>('checked');
  const [newItemName, setNewItemName] = useState('');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editName, setEditName] = useState('');

  // 當 items 變動時，立即儲存
  useEffect(() => {
    localStorage.setItem(getStorageKey(), JSON.stringify(items));
  }, [items, type]);

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newItemName.trim();
    if (!name) return;

    const newItem = {
        id: `custom-${Date.now()}`,
        name: name,
        completed: false,
        category: type === 'luggage' ? activeTab : 'general'
    };
    
    setItems(prev => [...prev, newItem]);
    setNewItemName('');
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
    if (editingItem?.id === id) setEditingItem(null);
  };

  const openEdit = (item: any) => {
    setEditingItem(item);
    setEditName(item.name);
  };

  const saveEdit = () => {
    const name = editName.trim();
    if (!name) return;
    setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, name } : i));
    setEditingItem(null);
  };

  const displayItems = type === 'luggage' 
    ? items.filter(i => i.category === activeTab)
    : items;

  const titleMap = { prep: '準備清單', luggage: '行李清單', shopping: '購物清單' };
  const subTitleMap = { prep: 'PREPARATION', luggage: 'LUGGAGE', shopping: 'SHOPPING' };

  return (
    <div className="pb-24 px-6 pt-4 min-h-full">
      <div className="flex flex-col mb-4 border-b border-gray-100 pb-3">
          <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-widest mb-0.5">{subTitleMap[type]}</span>
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-tokyo-ink">{titleMap[type]}</h2>
            {type === 'luggage' && (
                <div className="flex bg-gray-100 p-0.5 rect-ui shadow-inner">
                    <button onClick={() => setActiveTab('carry-on')} className={`px-3 py-1 text-[9px] font-bold transition-all ${activeTab === 'carry-on' ? 'bg-white text-tokyo-ink shadow-sm' : 'text-gray-600'}`}>隨身行李</button>
                    <button onClick={() => setActiveTab('checked')} className={`px-3 py-1 text-[9px] font-bold transition-all ${activeTab === 'checked' ? 'bg-white text-tokyo-ink shadow-sm' : 'text-gray-500'}`}>託運行李</button>
                </div>
            )}
          </div>
      </div>

      {type === 'luggage' && (
        <div className="mb-4 p-3 bg-tokyo-red/5 border-l-4 border-tokyo-red rect-ui">
          <p className="text-[11px] font-bold text-tokyo-red leading-relaxed">{LUGGAGE_WARNINGS[activeTab]}</p>
        </div>
      )}

      <form onSubmit={addItem} className="relative mb-6">
        <input 
          className="w-full pl-4 pr-12 py-3 bg-white border border-gray-100 rect-ui outline-none text-xs font-bold text-tokyo-ink focus:border-tokyo-ink transition-colors" 
          placeholder="新增內容..." 
          value={newItemName} 
          onChange={(e) => setNewItemName(e.target.value)} 
        />
        <button type="submit" className="absolute right-0 top-0 bottom-0 px-4 text-tokyo-ink flex items-center justify-center hover:text-tokyo-red transition-colors">
          <Icon name="plus" className="w-5 h-5" />
        </button>
      </form>

      <div className="space-y-3">
        {displayItems.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs font-serif italic">目前無項目紀錄</div>
        ) : displayItems.map(item => (
            <div key={item.id} className="bg-white border border-gray-50 px-5 py-5 flex items-center justify-between active:bg-gray-50 transition-colors rect-ui shadow-sm">
                <div className="flex items-center flex-1 cursor-pointer" onClick={() => toggleItem(item.id)}>
                    <div className={`w-5 h-5 border-2 border-tokyo-ink mr-4 flex items-center justify-center transition-all rect-ui ${item.completed ? 'bg-tokyo-ink' : 'bg-white'}`}>
                        {item.completed && <Icon name="check" className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <span className={`text-[15px] font-bold transition-all ${item.completed ? 'line-through text-gray-400 font-normal' : 'text-tokyo-ink'}`}>{item.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                    <button onClick={() => openEdit(item)} className="text-gray-300 hover:text-tokyo-gold p-1.5 transition"><Icon name="edit" className="w-4 h-4" /></button>
                    <button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-tokyo-red p-1.5 transition"><Icon name="trash" className="w-4 h-4" /></button>
                </div>
            </div>
        ))}
      </div>

      <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title="編輯項目">
        <div className="space-y-4">
            <input 
              className="w-full px-4 py-3 bg-gray-50 border-b border-tokyo-ink outline-none text-base font-bold rect-ui" 
              value={editName} 
              onChange={e => setEditName(e.target.value)} 
              autoFocus 
            />
            <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setEditingItem(null)} className="py-3 border-2 border-gray-200 text-gray-500 font-bold rect-ui">取消</button>
                <button onClick={saveEdit} className="py-3 bg-tokyo-ink text-white font-bold rect-ui">儲存</button>
            </div>
        </div>
      </Modal>
    </div>
  );
};
