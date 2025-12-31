import React, { useState, useEffect, useMemo } from 'react';
import { CostItem } from '../types';
import { Icon, Modal } from './Shared';
import { saveCostToGAS, fetchCostsFromGAS } from '../services/gasService';
import { APP_CONFIG } from '../constants';
import { formatDate, calculateShares } from '../utils/helpers';

const STORAGE_KEY = 'tokyo_trip_costs';

export const CostView = () => {
  const [costs, setCosts] = useState<CostItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState(formatDate(new Date()));
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [curr, setCurr] = useState<'JPY'|'TWD'>('JPY');
  const [payer, setPayer] = useState<'Anbao'|'Tingbao'>('Anbao');
  const [split, setSplit] = useState<'average'|'manual'>('average');
  const [manualAmount, setManualAmount] = useState(''); 
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setCosts(JSON.parse(saved)); } catch (e) {}
    }
    handleSync(); 
  }, []);

  const handleSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const cloudCosts = await fetchCostsFromGAS(APP_CONFIG.gasApiUrl);
      if (cloudCosts !== null) {
        setCosts(cloudCosts);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudCosts));
      }
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSave = async () => {
    if (!desc || !amt || !date) return;
    const total = parseFloat(amt);
    const newItem: CostItem = {
      id: editingId || Date.now().toString(),
      date: formatDate(date),
      description: desc,
      amount: total,
      currency: curr,
      payer,
      splitType: split,
      manualSplitPerson: split === 'manual' ? 'Anbao' : undefined,
      manualAmount: split === 'manual' ? parseFloat(manualAmount || '0') : undefined,
      notes
    };

    // Optimistic Update
    const updatedCosts = editingId ? costs.map(c => c.id === editingId ? newItem : c) : [newItem, ...costs];
    setCosts(updatedCosts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCosts));
    setShowModal(false);

    // Background Save & Sync
    await saveCostToGAS(newItem, APP_CONFIG.gasApiUrl, editingId ? 'edit' : 'add');
    handleSync(); 
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    const item = costs.find(c => c.id === deleteTargetId);
    if (!item) return;
    const updated = costs.filter(c => c.id !== deleteTargetId);
    setCosts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setDeleteTargetId(null);
    await saveCostToGAS(item, APP_CONFIG.gasApiUrl, 'delete');
    handleSync();
  };

  const settleSummary = useMemo(() => {
    let anbaoDebtJPY = 0, tingbaoDebtJPY = 0;
    let anbaoDebtTWD = 0, tingbaoDebtTWD = 0;

    costs.forEach(item => {
      const shares = calculateShares(item);
      if (item.currency === 'JPY') {
        if (item.payer === 'Anbao') tingbaoDebtJPY += shares.tingbao;
        else anbaoDebtJPY += shares.anbao;
      } else {
        if (item.payer === 'Anbao') tingbaoDebtTWD += shares.tingbao;
        else anbaoDebtTWD += shares.anbao;
      }
    });

    return {
      jpy: { diff: anbaoDebtJPY - tingbaoDebtJPY, abs: Math.abs(anbaoDebtJPY - tingbaoDebtJPY) },
      twd: { diff: anbaoDebtTWD - tingbaoDebtTWD, abs: Math.abs(anbaoDebtTWD - tingbaoDebtTWD) }
    };
  }, [costs]);

  return (
    <div className="pb-32 px-4 pt-4">
      {/* 總覽卡片 */}
      <div className="bg-white border-2 border-tokyo-ink mb-6 rect-ui shadow-float overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-serif font-bold text-lg">旅費總覽</h3>
            <button onClick={handleSync} className={`p-1 ${isSyncing ? 'animate-spin text-tokyo-red' : 'text-gray-400'}`}>
                <Icon name="sync" className="w-5 h-5" />
            </button>
        </div>
        <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
            <div className="py-4 text-center">
                <span className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">JPY</span>
                <span className="text-2xl font-mono font-bold">¥{costs.filter(c => c.currency === 'JPY').reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
            </div>
            <div className="py-4 text-center">
                <span className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">TWD</span>
                <span className="text-2xl font-mono font-bold">${costs.filter(c => c.currency === 'TWD').reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
            </div>
        </div>
        <button onClick={() => setShowSettleModal(true)} className="w-full py-4 bg-tokyo-ink text-white text-[12px] font-bold tracking-[0.2em] active:opacity-90">
            結算精算 SETTLE
        </button>
      </div>

      <div className="space-y-3 mb-8">
        {costs.map(item => (
          <div key={item.id} className="bg-white px-4 py-4 flex justify-between items-center rect-ui border border-gray-100 shadow-sm">
            <div className="flex flex-col flex-1 overflow-hidden mr-4">
              <div className="flex items-center space-x-2.5 mb-1.5">
                <span className={`px-2 py-0.5 text-[11px] font-bold rect-ui text-white ${item.payer === 'Anbao' ? 'bg-tokyo-anbao' : 'bg-tokyo-tingbao'}`}>
                    {item.payer === 'Anbao' ? '安' : '婷'}
                </span>
                <span className="font-medium text-tokyo-ink text-[15px] truncate">{item.description}</span>
              </div>
              <span className="font-mono text-[11px] text-gray-400 font-bold">{item.date}</span>
            </div>
            <div className="text-right flex items-center space-x-4">
              <span className="font-mono font-bold text-lg whitespace-nowrap">
                {item.currency === 'JPY' ? '¥' : '$'}{item.amount.toLocaleString()}
              </span>
              <div className="flex items-center space-x-1.5">
                <button onClick={() => {
                  setEditingId(item.id); setDate(item.date); setDesc(item.description); setAmt(item.amount.toString());
                  setCurr(item.currency); setPayer(item.payer); setSplit(item.splitType);
                  setManualAmount(item.splitType === 'manual' ? (item.manualAmount?.toString() || '') : '');
                  setNotes(item.notes || ''); setShowModal(true);
                }} className="text-gray-300 hover:text-tokyo-ink p-1.5"><Icon name="edit" className="w-5 h-5" /></button>
                <button onClick={() => setDeleteTargetId(item.id)} className="text-gray-300 hover:text-tokyo-red p-1.5"><Icon name="trash" className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={!!deleteTargetId} onClose={() => setDeleteTargetId(null)} title="確認刪除">
          <div className="space-y-6">
              <p className="text-center font-bold text-tokyo-ink">確定要刪除這筆紀錄嗎？</p>
              <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setDeleteTargetId(null)} className="py-4 border-2 border-gray-200 font-bold rect-ui text-gray-400">取消</button>
                  <button onClick={executeDelete} className="py-4 bg-tokyo-red text-white font-bold rect-ui shadow-md">確定刪除</button>
              </div>
          </div>
      </Modal>

      <Modal isOpen={showSettleModal} onClose={() => setShowSettleModal(false)} title="結算精算">
        <div className="space-y-6">
          <div className="bg-gray-50 border-2 border-tokyo-ink p-6 rect-ui text-center space-y-4">
            <div>
                <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">日幣 JPY</h4>
                <p className="text-2xl font-mono font-bold text-tokyo-red">
                    {settleSummary.jpy.abs > 0 ? `${settleSummary.jpy.diff > 0 ? '安寶 ➔ 婷寶' : '婷寶 ➔ 安寶'} ¥${settleSummary.jpy.abs.toLocaleString()}` : '已結清'}
                </p>
            </div>
            <div className="w-8 h-[1px] bg-gray-200 mx-auto"></div>
            <div>
                <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">台幣 TWD</h4>
                <p className="text-2xl font-mono font-bold text-tokyo-red">
                    {settleSummary.twd.abs > 0 ? `${settleSummary.twd.diff > 0 ? '安寶 ➔ 婷寶' : '婷寶 ➔ 安寶'} $${settleSummary.twd.abs.toLocaleString()}` : '已結清'}
                </p>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? "編輯消費" : "新增消費"}>
        <div className="space-y-5">
          <input className="w-full px-3 py-3 bg-gray-50 border-b-2 border-gray-200 outline-none font-mono rect-ui" value={date} onChange={e => setDate(e.target.value)} placeholder="YYYY/MM/DD" />
          <input className="w-full px-3 py-3 bg-gray-50 border-b-2 border-gray-200 outline-none text-lg font-medium rect-ui" placeholder="內容..." value={desc} onChange={e => setDesc(e.target.value)} />
          <div className="flex items-center bg-gray-50 border-b-2 border-gray-200">
              <input className="flex-1 px-3 py-3 bg-transparent outline-none text-3xl font-mono font-bold" type="number" value={amt} onChange={e => setAmt(e.target.value)} placeholder="0" />
              <div className="flex bg-white">
                  <button onClick={() => setCurr('JPY')} className={`px-4 py-2 font-bold ${curr === 'JPY' ? 'bg-tokyo-ink text-white' : 'text-gray-400'}`}>JPY</button>
                  <button onClick={() => setCurr('TWD')} className={`px-4 py-2 font-bold ${curr === 'TWD' ? 'bg-tokyo-ink text-white' : 'text-gray-400'}`}>TWD</button>
              </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setShowModal(false)} className="py-4 border-2 border-gray-200 font-bold text-gray-400 rect-ui">取消</button>
            <button onClick={handleSave} className="py-4 bg-tokyo-ink text-white font-bold rect-ui shadow-lg">儲存</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};