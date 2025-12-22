import React, { useState, useEffect } from 'react';
import { INITIAL_PACKING_LIST, INITIAL_SHOPPING_LIST, LUGGAGE_WARNINGS } from '../constants';
import { Icon, Modal } from './Shared';

type ListType = 'prep' | 'luggage' | 'shopping';

export const ListsView: React.FC<{ type: ListType }> = ({ type }) => {
  const getStorageKey = () => `tokyo_list_${type}`;
  
  const getDefaultItems = () => {
    if (type === 'luggage') return INITIAL_PACKING_LIST;
    if (type === 'shopping') return INITIAL_SHOPPING_LIST;
    return [
      {id: 'p-1', name: 'Visit Japan Web 完成', completed: false, category: 'general'},
      {id: 'p-2', name: '海外旅遊保險投保', completed: false, category: 'general'},
      {id: 'p-3', name: '日幣現金預兌換', completed: false, category: 'general'},
      {id: 'p-4', name: '網卡/漫遊數據設定', completed: false, category: 'general'},
    ];
  };

  const [items, setItems] = useState<any[]>(() => {
    const saved = localStorage.getItem(getStorageKey());
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return getDefaultItems();
  });

  const [luggageTab, setLuggageTab] = useState<'carry-on'|'checked'>('carry-on');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    localStorage.setItem(getStorageKey(), JSON.stringify(items));
  }, [items, type]);

  const toggleItem = (id: string) => {
    setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const openAddModal = () => {
    setEditingItem(null);
    setNewItemName('');
    setShowAddModal(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setNewItemName(item.name);
    setShowAddModal(true);
  };

  const handleSave = () => {
    if (!newItemName.trim()) return;
    
    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? { ...item, name: newItemName } : item));
    } else {
      const newItem = {
        id: Date.now().toString(),
        name: newItemName,
        completed: false,
        category: type === 'luggage' ? luggageTab : 'general'
      };
      setItems([...items, newItem]);
    }
    
    setNewItemName('');
    setShowAddModal(false);
    setEditingItem(null);
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const filteredItems = type === 'luggage' 
    ? items.filter(i => i.category === luggageTab)
    : items;

  return (
    <div className="pb-24 px-6 pt-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif font-bold text-lg text-tokyo-ink tracking-widest uppercase">
          {type === 'luggage' ? '行李清單' : type === 'shopping' ? '購物清單' : '事前準備'}
        </h3>
        <button onClick={openAddModal} className="w-10 h-10 bg-tokyo-ink text-white flex items-center justify-center rect-ui shadow-md active:scale-95 transition-transform" aria-label="新增項目">
          <Icon name="plus" className="w-6 h-6" />
        </button>
      </div>

      {type === 'luggage' && (
        <div className="grid grid-cols-2 gap-2 mb-6">
          <button onClick={() => setLuggageTab('carry-on')} className={`py-3 text-xs font-bold tracking-widest rect-ui border-2 transition-all ${luggageTab === 'carry-on' ? 'bg-tokyo-ink text-white border-tokyo-ink shadow-lg' : 'bg-white text-gray-600 border-gray-100'}`}>隨身行李</button>
          <button onClick={() => setLuggageTab('checked')} className={`py-3 text-xs font-bold tracking-widest rect-ui border-2 transition-all ${luggageTab === 'checked' ? 'bg-tokyo-ink text-white border-tokyo-ink shadow-lg' : 'bg-white text-gray-600 border-gray-100'}`}>託運行李</button>
        </div>
      )}

      {type === 'luggage' && (
        <div className="mb-6 p-4 bg-tokyo-gold/10 border-l-4 border-tokyo-gold rect-ui">
          <p className="text-[11px] font-bold text-tokyo-gold leading-relaxed">{LUGGAGE_WARNINGS[luggageTab]}</p>
        </div>
      )}

      <div className="space-y-3">
        {filteredItems.map(item => (
          <div key={item.id} className="flex items-center space-x-3 bg-white p-4 border border-gray-100 rect-ui shadow-sm active:bg-gray-50 transition-colors">
            <button onClick={() => toggleItem(item.id)} className={`w-6 h-6 rect-ui border-2 flex items-center justify-center transition-all ${item.completed ? 'bg-tokyo-ink border-tokyo-ink text-white' : 'border-gray-200'}`} aria-label={item.completed ? "標記為未完成" : "標記為已完成"}>
              {item.completed && <Icon name="check" className="w-4 h-4" />}
            </button>
            <span className={`flex-1 text-sm font-bold tracking-wide transition-all font-serif ${item.completed ? 'text-gray-400 line-through' : 'text-tokyo-ink'}`}>{item.name}</span>
            <div className="flex items-center space-x-2">
              <button onClick={() => openEditModal(item)} className="p-1 text-gray-400 hover:text-tokyo-ink" aria-label="編輯項目">
                <Icon name="edit" className="w-4 h-4" />
              </button>
              <button onClick={() => deleteItem(item.id)} className="p-1 text-gray-400 hover:text-tokyo-red" aria-label="刪除項目">
                <Icon name="trash" className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title={editingItem ? "編輯項目" : "新增項目"}>
        <div className="space-y-6">
          <input autoFocus className="w-full px-4 py-3 bg-gray-50 border-b-2 border-gray-200 outline-none text-lg font-bold rect-ui focus:border-tokyo-ink font-serif" placeholder="輸入名稱..." value={newItemName} onChange={e => setNewItemName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSave()} />
          <button onClick={handleSave} className="w-full py-4 bg-tokyo-ink text-white font-bold tracking-widest rect-ui shadow-lg active:opacity-90 uppercase">
            {editingItem ? '儲存變更' : '確定新增'}
          </button>
        </div>
      </Modal>
    </div>
  );
};
