
import React, { useState, useEffect, useMemo } from 'react';
import { CostItem } from '../types';
import { Icon, Modal } from './Shared';
import { saveCostToGAS, fetchCostsFromGAS } from '../services/gasService';
import { APP_CONFIG } from '../constants';

const STORAGE_KEY = 'tokyo_trip_costs';
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/116baK9qPQns_08hKuMYnp_OzXzC6lZdkVwUFn0Ry7lg/edit?gid=1478645828#gid=1478645828';

const getLocalDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

export const CostView = () => {
  const [costs, setCosts] = useState<CostItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showSettleModal, setShowSettleModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState(getLocalDate());
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
    } catch (err) {
      console.error("Sync Error:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setDate(getLocalDate());
    setDesc(''); setAmt(''); setCurr('JPY'); setPayer('Anbao'); setSplit('average'); setManualAmount(''); setNotes('');
    setShowModal(true);
  };

  const openEditModal = (item: CostItem) => {
    setEditingId(item.id);
    setDate(item.date.replace(/-/g, '/'));
    setDesc(item.description);
    setAmt(item.amount.toString());
    setCurr(item.currency);
    setPayer(item.payer);
    setSplit(item.splitType || 'average');
    const anbaoShare = item.manualSplitPerson === 'Anbao' ? item.manualAmount : (item.amount - (item.manualAmount || 0));
    setManualAmount(item.splitType === 'manual' ? anbaoShare?.toString() || '' : '');
    setNotes(item.notes || '');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!desc || !amt || !date) return;
    const total = parseFloat(amt);
    const newItem: CostItem = {
      id: editingId || Date.now().toString(),
      date: date.replace(/-/g, '/'),
      description: desc,
      amount: total,
      currency: curr,
      payer,
      splitType: split,
      manualSplitPerson: split === 'manual' ? 'Anbao' : undefined,
      manualAmount: split === 'manual' ? parseFloat(manualAmount || '0') : undefined,
      notes
    };

    const updatedCosts = editingId ? costs.map(c => c.id === editingId ? newItem : c) : [newItem, ...costs];
    setCosts(updatedCosts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCosts));
    setShowModal(false);

    await saveCostToGAS(newItem, APP_CONFIG.gasApiUrl, editingId ? 'edit' : 'add');
    setTimeout(handleSync, 1500);
  };

  const executeDelete = async (id: string) => {
    const item = costs.find(c => c.id === id);
    if (!item) return;
    const updated = costs.filter(c => c.id !== id);
    setCosts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setShowDeleteConfirm(null);
    await saveCostToGAS(item, APP_CONFIG.gasApiUrl, 'delete');
  };

  const totals = useMemo(() => ({
    jpy: costs.filter(c => c.currency === 'JPY').reduce((a, b) => a + b.amount, 0),
    twd: costs.filter(c => c.currency === 'TWD').reduce((a, b) => a + b.amount, 0)
  }), [costs]);

  const settleSummary = useMemo(() => {
    let anbaoDebtJPY = 0, tingbaoDebtJPY = 0;
    let anbaoDebtTWD = 0, tingbaoDebtTWD = 0;

    costs.forEach(item => {
      const isJPY = item.currency === 'JPY';
      let aShare = item.splitType === 'average' ? item.amount/2 : (item.manualSplitPerson === 'Anbao' ? (item.manualAmount||0) : (item.amount - (item.manualAmount||0)));
      let tShare = item.amount - aShare;

      if (isJPY) {
        if (item.payer === 'Anbao') tingbaoDebtJPY += tShare;
        else anbaoDebtJPY += aShare;
      } else {
        if (item.payer === 'Anbao') tingbaoDebtTWD += tShare;
        else anbaoDebtTWD += aShare;
      }
    });

    return {
      jpy: { diff: anbaoDebtJPY - tingbaoDebtJPY, abs: Math.abs(anbaoDebtJPY - tingbaoDebtJPY) },
      twd: { diff: anbaoDebtTWD - tingbaoDebtTWD, abs: Math.abs(anbaoDebtTWD - tingbaoDebtTWD) }
    };
  }, [costs]);

  const splitPreview = useMemo(() => {
    const total = parseFloat(amt) || 0;
    const anbao = split === 'average' ? total/2 : (parseFloat(manualAmount) || 0);
    return { anbao, tingbao: Math.max(0, total - anbao) };
  }, [amt, split, manualAmount]);

  return (
    <div className="pb-32 px-4 pt-4">
      <div className="bg-white border-2 border-tokyo-ink mb-8 rect-ui shadow-float overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-serif font-bold text-lg">旅費總覽</h3>
            <button onClick={handleSync} className={`p-2 ${isSyncing ? 'animate-spin text-tokyo-red' : 'text-gray-400'}`}>
                <Icon name="sync" className="w-5 h-5" />
            </button>
        </div>
        <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
            <div className="p-5 text-center">
                <span className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">JPY</span>
                <span className="text-xl font-mono font-bold">¥{totals.jpy.toLocaleString()}</span>
            </div>
            <div className="p-5 text-center">
                <span className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">TWD</span>
                <span className="text-xl font-mono font-bold">${totals.twd.toLocaleString()}</span>
            </div>
        </div>
        <button onClick={() => setShowSettleModal(true)} className="w-full py-4 bg-tokyo-ink text-white text-[11px] font-bold tracking-[0.2em] active:opacity-90">
            結算精算 ACCOUNT SETTLE
        </button>
      </div>

      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="font-serif font-bold text-base text-tokyo-ink tracking-widest underline decoration-tokyo-gold decoration-4 underline-offset-4">支出明細</h3>
        <button onClick={openAddModal} className="w-9 h-9 bg-tokyo-ink text-white flex items-center justify-center rect-ui shadow-md active:scale-95 transition-transform">
          <Icon name="plus" className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-2 mb-12">
        {costs.length === 0 ? (
            <div className="py-12 text-center text-gray-300 text-xs italic border-2 border-dashed border-gray-100 rect-ui">尚無紀錄</div>
        ) : costs.map(item => (
          <div key={item.id} className="bg-white px-4 py-4 flex justify-between items-center rect-ui active:bg-gray-50 transition-colors">
            <div className="flex flex-col flex-1">
              <div className="flex items-center space-x-2">
                <span className={`px-1.5 py-0.5 text-[9px] font-bold rect-ui text-white ${item.payer === 'Anbao' ? 'bg-tokyo-anbao' : 'bg-tokyo-tingbao'}`}>
                    {item.payer === 'Anbao' ? '安寶' : '婷寶'}
                </span>
                <span className="font-bold text-tokyo-ink text-sm truncate max-w-[150px]">{item.description}</span>
              </div>
              <div className="mt-1 flex items-center space-x-2">
                <span className="font-mono text-[10px] text-gray-300 font-bold">{item.date}</span>
                {item.splitType === 'manual' && <span className="text-[9px] text-tokyo-gold font-bold">手動分攤</span>}
              </div>
            </div>
            <div className="text-right flex items-center space-x-4">
              <span className="font-mono font-bold text-base text-tokyo-ink whitespace-nowrap">
                {item.currency === 'JPY' ? '¥' : '$'}{item.amount.toLocaleString()}
              </span>
              <div className="flex items-center">
                <button onClick={() => openEditModal(item)} className="text-gray-200 hover:text-tokyo-ink p-1.5"><Icon name="edit" className="w-4 h-4" /></button>
                <button onClick={() => setShowDeleteConfirm(item.id)} className="text-gray-200 hover:text-tokyo-red p-1.5"><Icon name="trash" className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 px-1">
          <a href={SHEET_URL} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full py-4 border-2 border-dashed border-gray-200 text-gray-400 text-sm font-bold rect-ui active:bg-gray-50 transition-all">
              <span>open Google Sheets</span>
          </a>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)}></div>
            <div className="relative bg-white p-6 border-t-4 border-tokyo-red shadow-2xl rect-ui w-full max-w-xs text-center">
                <h4 className="font-bold mb-4">確定要刪除嗎？</h4>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setShowDeleteConfirm(null)} className="py-2 border border-gray-200 text-sm font-bold rect-ui text-gray-400">取消</button>
                    <button onClick={() => executeDelete(showDeleteConfirm)} className="py-2 bg-tokyo-red text-white text-sm font-bold rect-ui">確定</button>
                </div>
            </div>
        </div>
      )}

      <Modal isOpen={showSettleModal} onClose={() => setShowSettleModal(false)} title="結算結果">
        <div className="space-y-6">
          <div className="bg-gray-50 border-2 border-tokyo-ink p-8 rect-ui text-center space-y-8">
            <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">日幣結算 JPY</h4>
                {settleSummary.jpy.abs > 0 ? (
                    <div className="space-y-1">
                        <p className="text-sm font-bold">{settleSummary.jpy.diff > 0 ? '安寶 應支付給 婷寶' : '婷寶 應支付給 安寶'}</p>
                        <p className="text-4xl font-mono font-bold text-tokyo-red">¥{settleSummary.jpy.abs.toLocaleString()}</p>
                    </div>
                ) : <p className="text-gray-400 italic text-sm">日幣已結清</p>}
            </div>
            <div className="w-12 h-[1px] bg-gray-200 mx-auto"></div>
            <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">台幣結算 TWD</h4>
                {settleSummary.twd.abs > 0 ? (
                    <div className="space-y-1">
                        <p className="text-sm font-bold">{settleSummary.twd.diff > 0 ? '安寶 應支付給 婷寶' : '婷寶 應支付給 安寶'}</p>
                        <p className="text-4xl font-mono font-bold text-tokyo-red">${settleSummary.twd.abs.toLocaleString()}</p>
                    </div>
                ) : <p className="text-gray-400 italic text-sm">台幣已結清</p>}
            </div>
          </div>
          <button onClick={() => setShowSettleModal(false)} className="w-full py-4 bg-tokyo-ink text-white font-bold text-sm rect-ui active:opacity-90">完成結算</button>
        </div>
      </Modal>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? "編輯項目" : "新增項目"}>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-[1.2]">
              <label className="text-[10px] text-gray-400 font-bold block mb-1">日期 (YYYY/MM/DD)</label>
              <input className="w-full px-3 py-2 bg-gray-50 border-b border-gray-200 outline-none text-sm font-mono rect-ui" value={date} onChange={e => setDate(e.target.value)} placeholder="2026/01/10" />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-gray-400 font-bold block mb-1">支付者</label>
              <div className="grid grid-cols-2 border-2 border-tokyo-ink rect-ui overflow-hidden">
                <button onClick={() => setPayer('Anbao')} className={`py-1.5 text-[10px] font-bold ${payer === 'Anbao' ? 'bg-tokyo-anbao text-white' : 'bg-white text-gray-400'}`}>安寶</button>
                <button onClick={() => setPayer('Tingbao')} className={`py-1.5 text-[10px] font-bold ${payer === 'Tingbao' ? 'bg-tokyo-tingbao text-white' : 'bg-white text-gray-400'}`}>婷寶</button>
              </div>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-bold block mb-1">項目</label>
            <input className="w-full px-3 py-2 bg-gray-50 border-b border-gray-200 outline-none text-base font-bold rect-ui" placeholder="內容..." value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] text-gray-400 font-bold block mb-1">金額</label>
            <div className="flex items-center bg-gray-50 border-b border-gray-200">
                <input className="flex-1 px-3 py-2 bg-transparent outline-none text-xl font-mono font-bold text-tokyo-ink" type="number" inputMode="decimal" value={amt} onChange={e => setAmt(e.target.value)} placeholder="0" />
                <div className="flex bg-white">
                    <button onClick={() => setCurr('JPY')} className={`px-3 py-2 text-[10px] font-bold ${curr === 'JPY' ? 'bg-tokyo-ink text-white' : 'text-gray-400'}`}>JPY</button>
                    <button onClick={() => setCurr('TWD')} className={`px-3 py-2 text-[10px] font-bold ${curr === 'TWD' ? 'bg-tokyo-ink text-white' : 'text-gray-400'}`}>TWD</button>
                </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 border border-gray-200 rect-ui space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-tokyo-ink font-bold">分帳方式</span>
              <select value={split} onChange={(e) => setSplit(e.target.value as any)} className="bg-white px-2 py-1.5 border-2 border-tokyo-ink text-[10px] font-bold rect-ui outline-none">
                <option value="average">平均分攤</option>
                <option value="manual">手動分攤</option>
              </select>
            </div>
            {split === 'manual' && (
              <div className="flex gap-4 pt-4 border-t border-dashed border-gray-300">
                <div className="flex-1">
                  <label className="text-[9px] text-tokyo-anbao font-bold block mb-1">安寶負擔</label>
                  <input className="w-full px-2 py-1.5 bg-white border border-gray-200 rect-ui text-sm font-mono font-bold" type="number" value={manualAmount} onChange={e => setManualAmount(e.target.value)} />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] text-tokyo-tingbao font-bold block mb-1 opacity-40">婷寶自動</label>
                  <div className="w-full px-2 py-1.5 bg-gray-100 text-sm font-mono font-bold text-gray-400">{splitPreview.tingbao.toLocaleString()}</div>
                </div>
              </div>
            )}
            <div className="pt-2 border-t border-gray-200">
                <label className="text-[10px] text-gray-400 font-bold block mb-1">備註</label>
                <textarea 
                    className="w-full px-3 py-2 bg-white border border-gray-200 rect-ui outline-none text-xs font-medium min-h-[60px]" 
                    placeholder="輸入備註..." 
                    value={notes} 
                    onChange={e => setNotes(e.target.value)} 
                />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="py-3 border-2 border-gray-200 text-sm font-bold text-gray-400 rect-ui">取消</button>
            <button onClick={handleSave} className="py-3 bg-tokyo-ink text-white text-sm font-bold rect-ui active:opacity-90">儲存</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
