
import React, { useState, useEffect } from 'react';
import { INITIAL_PACKING_LIST, INITIAL_SHOPPING_LIST, LUGGAGE_WARNINGS } from '../constants';
import { Icon, Modal } from './Shared';

type ListType = 'prep' | 'luggage' | 'shopping';

export const ListsView = ({ type }: { type: ListType }) => {
  const getStorageKey = () => `tokyo_list_${type}`;
  
  const [items, setItems] = useState<any[]>(() => {
    const saved = localStorage.getItem(`tokyo_list_${type}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error("Parse error", e);
      }
    }
    if (type === 'luggage') return INITIAL_PACKING_LIST;
    if (type === 'shopping') return INITIAL_SHOPPING_LIST;
    return [
      {id: 'p-1', name: 'Visit Japan Web 完成', completed: false, category: 'general'},
      {id: 'p-2', name: '海外旅遊保險投保', completed: false, category: 'general'},
      {id: 'p-3', name: '日幣現金預兌換', completed: false, category: 'general'},
      {id: 'p-4', name: '網卡/漫遊數據設定', completed: false, category: 'general'},
    ];
  });

  // 修改預設值為 'carry-on'
  const [luggageTab, setLuggageTab] = useState<'carry-on'|'checked'>('carry-on');
  const [newItemName, setNewItemName] = useState('');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editName, setEditName] = useState('');

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
        id: `id-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        name: name,
        completed: false,
        category: type === 'luggage' ? luggageTab : 'general'
    };
    
    setItems(prev => [...prev, newItem]);
    setNewItemName('');
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
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
    ? items.filter(i => i.category === luggageTab)
    : items;

  const titleMap = { prep: '準備清單', luggage: '行李清單', shopping: '購物清單' };
  const subTitleMap = { prep: 'PREPARATION', luggage: 'LUGGAGE', shopping: 'SHOPPING' };

  return (
    <div className="pb-24 px-4 pt-4 min-h-full">
      <div className="flex flex-col mb-5 border-b border-gray-100 pb-4 px-1">
          <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest mb-1.5">{subTitleMap[type]}</span>
          <div className="flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-tokyo-ink tracking-wide">{titleMap[type]}</h2>
            {type === 'luggage' && (
                <div className="flex bg-gray-100 p-0.5 rect-ui shadow-inner border border-gray-200/50">
                    <button onClick={() => setLuggageTab('carry-on')} className={`px-3 py-1 text-[11px] font-bold transition-all ${luggageTab === 'carry-on' ? 'bg-white text-tokyo-ink shadow-sm' : 'text-gray-500'}`}>隨身</button>
                    <button onClick={() => setLuggageTab('checked')} className={`px-3 py-1 text-[11px] font-bold transition-all ${luggageTab === 'checked' ? 'bg-white text-tokyo-ink shadow-sm' : 'text-gray-500'}`}>託運</button>
                </div>
            )}
          </div>
      </div>

      {type === 'luggage' && (
        <div className="mb-5 p-3.5 bg-tokyo-red/5 border-l-4 border-tokyo-red rect-ui shadow-paper">
          <p className="text-[12px] font-bold text-tokyo-red leading-relaxed tracking-wider font-serif">{LUGGAGE_WARNINGS[luggageTab]}</p>
        </div>
      )}

      <form onSubmit={addItem} className="relative mb-8">
        <input 
          type="text"
          className="w-full pl-4 pr-12 py-4 bg-white border border-gray-200 rect-ui outline-none text-[16px] font-light text-tokyo-ink focus:border-tokyo-ink shadow-sm transition-all" 
          placeholder={`新增項目...`} 
          value={newItemName} 
          onChange={(e) => setNewItemName(e.target.value)} 
        />
        <button 
          type="submit" 
          className="absolute right-0 top-0 bottom-0 px-4 text-tokyo-ink flex items-center justify-center hover:text-tokyo-red transition-colors"
        >
          <Icon name="plus" className="w-6 h-6" />
        </button>
      </form>

      <div className="space-y-3">
        {displayItems.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm font-serif italic border-2 border-dashed border-gray-100 rect-ui font-light">目前無項目紀錄</div>
        ) : displayItems.map(item => (
            <div key={item.id} className="bg-white border border-gray-50 px-4 py-4 flex items-center justify-between active:bg-gray-50 rect-ui shadow-sm transition-colors">
                <div className="flex items-center flex-1 cursor-pointer" onClick={() => toggleItem(item.id)}>
                    <div className={`w-6 h-6 border-2 border-tokyo-ink mr-5 flex items-center justify-center transition-all rect-ui shrink-0 ${item.completed ? 'bg-tokyo-ink shadow-inner' : 'bg-white'}`}>
                        {item.completed && <Icon name="check" className="w-4 h-4 text-white" />}
                    </div>
                    {/* 改為中粗體 (font-medium) */}
                    <span className={`text-[15px] font-medium transition-all leading-snug tracking-wide ${item.completed ? 'line-through text-gray-400 opacity-60' : 'text-tokyo-ink'}`}>{item.name}</span>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                    <button onClick={() => openEdit(item)} className="text-gray-300 hover:text-tokyo-gold p-1.5 transition-colors"><Icon name="edit" className="w-5 h-5" /></button>
                    <button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-tokyo-red p-1.5 transition-colors"><Icon name="trash" className="w-5 h-5" /></button>
                </div>
            </div>
        ))}
      </div>

      <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title="編輯項目">
        <div className="space-y-6">
            <input 
              className="w-full px-4 py-4 bg-gray-50 border-b-4 border-tokyo-ink outline-none text-xl font-medium rect-ui" 
              value={editName} 
              onChange={e => setEditName(e.target.value)} 
              autoFocus 
            />
            <div className="grid grid-cols-2 gap-4 pt-2">
                <button onClick={() => setEditingItem(null)} className="py-4 border-2 border-gray-200 text-base font-bold text-gray-400 rect-ui active:bg-gray-50">取消</button>
                <button onClick={saveEdit} className="py-4 bg-tokyo-ink text-white font-bold text-base rect-ui shadow-lg tracking-widest">儲存變更</button>
            </div>
        </div>
      </Modal>
    </div>
  );
};
