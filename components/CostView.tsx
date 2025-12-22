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

const cleanDate = (dateStr: string) => {
  if (!dateStr) return '';
  return dateStr.substring(0, 10).replace(/-/g, '/').replace(/T.*/, '').trim();
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
      // 靜默處理
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
    setDate(cleanDate(item.date));
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
      date: cleanDate(date),
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

  const splitPreview = useMemo(() => {
    const total = parseFloat(amt || '0');
    const anbaoShare = parseFloat(manualAmount || '0');
    return {
      anbao: anbaoShare,
      tingbao: Math.max(0, total - anbaoShare)
    };
  }, [amt, manualAmount]);

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

  return (
    <div className="pb-32 px-4 pt-4">
      {/* 總覽卡片 */}
      <div className="bg-white border-2 border-tokyo-ink mb-6 rect-ui shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-serif font-bold text-lg">旅費總覽</h3>
            <button onClick={handleSync} className={`p-1 ${isSyncing ? 'animate-spin text-tokyo-red' : 'text-gray-500'}`} aria-label="同步資料">
                <Icon name="sync" className="w-5 h-5" />
            </button>
        </div>
        <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
            <div className="py-4 text-center">
                <span className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">JPY</span>
                <span className="text-2xl font-mono font-bold text-tokyo-ink">¥{totals.jpy.toLocaleString()}</span>
            </div>
            <div className="py-4 text-center">
                <span className="block text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-widest">TWD</span>
                <span className="text-2xl font-mono font-bold text-tokyo-ink">${totals.twd.toLocaleString()}</span>
            </div>
        </div>
        <button onClick={() => setShowSettleModal(true)} className="w-full py-4 bg-tokyo-ink text-white text-[12px] font-bold tracking-[0.2em] active:opacity-90">
            結算精算 SETTLE
        </button>
      </div>

      <div className="flex justify-between items-center mb-5 px-1">
        <h3 className="font-serif font-bold text-base text-tokyo-ink tracking-widest underline decoration-tokyo-gold decoration-4 underline-offset-4">支出明細</h3>
        <button onClick={openAddModal} className="w-10 h-10 bg-tokyo-ink text-white flex items-center justify-center rect-ui shadow-lg active:scale-95 transition-transform" aria-label="新增項目">
          <Icon name="plus" className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-3 mb-8">
        {costs.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-sm italic border-2 border-dashed border-gray-200 rect-ui font-light">尚無紀錄</div>
        ) : costs.map(item => (
          <div key={item.id} className="bg-white px-4 py-4 flex justify-between items-center rect-ui border border-gray-100 shadow-sm active:bg-gray-50 transition-colors">
            <div className="flex flex-col flex-1 overflow-hidden mr-4">
              <div className="flex items-center space-x-2.5 mb-1.5">
                <span className={`px-2 py-0.5 text-[11px] font-bold rect-ui text-white shrink-0 ${item.payer === 'Anbao' ? 'bg-tokyo-anbao' : 'bg-tokyo-tingbao'}`}>
                    {item.payer === 'Anbao' ? '安寶' : '婷寶'}
                </span>
                <span className="font-medium text-tokyo-ink text-[15px] truncate leading-tight tracking-wide font-serif">{item.description}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-mono text-[11px] text-gray-600 font-bold tracking-wider">{cleanDate(item.date)}</span>
                {item.splitType === 'manual' && <span className="text-[9px] text-tokyo-gold font-bold px-1.5 py-0.5 bg-tokyo-gold/5 border border-tokyo-gold/10 tracking-widest">手動分帳</span>}
              </div>
            </div>
            <div className="text-right flex items-center space-x-4 shrink-0">
              <span className="font-mono font-bold text-lg text-tokyo-ink whitespace-nowrap">
                {item.currency === 'JPY' ? '¥' : '$'}{item.amount.toLocaleString()}
              </span>
              <div className="flex items-center space-x-1.5">
                <button onClick={() => openEditModal(item)} className="text-gray-500 hover:text-tokyo-ink p-1.5 transition-colors" aria-label="編輯"><Icon name="edit" className="w-5 h-5" /></button>
                <button onClick={() => setShowDeleteConfirm(item.id)} className="text-gray-500 hover:text-tokyo-red p-1.5 transition-colors" aria-label="刪除"><Icon name="trash" className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-1">
          <a href={SHEET_URL} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full py-4 border-2 border-dashed border-gray-200 text-gray-600 text-sm font-bold rect-ui active:bg-gray-50 transition-all tracking-widest uppercase">
              <Icon name="link" className="w-4 h-4 mr-2 opacity-70" />
              <span>Google Sheets Report</span>
          </a>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)}></div>
            <div className="relative bg-white p-6 border-t-8 border-tokyo-red shadow-2xl rect-ui w-full max-sm text-center">
                <p className="font-bold text-base mb-5 text-tokyo-ink">確定要刪除這筆紀錄嗎？</p>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setShowDeleteConfirm(null)} className="py-3 border-2 border-gray-200 text-sm font-bold rect-ui text-gray-600">取消</button>
                    <button onClick={() => executeDelete(showDeleteConfirm)} className="py-3 bg-tokyo-red text-white text-sm font-bold rect-ui shadow-md">確定刪除</button>
                </div>
            </div>
        </div>
      )}

      {/* 結算 Modal */}
      <Modal isOpen={showSettleModal} onClose={() => setShowSettleModal(false)} title="結算精算">
        <div className="space-y-6">
          <div className="bg-gray-50 border-2 border-tokyo-ink p-6 rect-ui text-center space-y-6">
            <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">日幣結算 JPY</h4>
                {settleSummary.jpy.abs > 0 ? (
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-tokyo-ink font-light">{settleSummary.jpy.diff > 0 ? '安寶 應支付 婷寶' : '婷寶 應支付 安寶'}</p>
                        <p className="text-4xl font-mono font-bold text-tokyo-red">¥{settleSummary.jpy.abs.toLocaleString()}</p>
                    </div>
                ) : <p className="text-gray-500 italic text-sm font-light">日幣項目已結清</p>}
            </div>
            <div className="w-12 h-[1px] bg-gray-200 mx-auto"></div>
            <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">台幣結算 TWD</h4>
                {settleSummary.twd.abs > 0 ? (
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-tokyo-ink font-light">{settleSummary.twd.diff > 0 ? '安寶 應支付 婷寶' : '婷寶 應支付 安寶'}</p>
                        <p className="text-4xl font-mono font-bold text-tokyo-red">${settleSummary.twd.abs.toLocaleString()}</p>
                    </div>
                ) : <p className="text-gray-500 italic text-sm font-light">台幣項目已結清</p>}
            </div>
          </div>
          <button onClick={() => setShowSettleModal(false)} className="w-full py-4 bg-tokyo-ink text-white font-bold text-base rect-ui active:opacity-90 shadow-lg tracking-widest">確認完成</button>
        </div>
      </Modal>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? "編輯消費" : "新增消費"}>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-[1.5]">
              <label className="text-[10px] text-gray-600 font-bold block mb-1 uppercase">日期 DATE</label>
              <input className="w-full px-3 py-2 bg-gray-50 border-b-2 border-gray-200 outline-none text-[14px] font-mono rect-ui focus:border-tokyo-ink transition-colors" value={date} onChange={e => setDate(e.target.value)} placeholder="YYYY/MM/DD" />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-gray-600 font-bold block mb-1 uppercase">支付者 PAYER</label>
              <div className="grid grid-cols-2 border-2 border-tokyo-ink rect-ui overflow-hidden h-[38px]">
                <button onClick={() => setPayer('Anbao')} className={`text-[12px] font-bold ${payer === 'Anbao' ? 'bg-tokyo-anbao text-white' : 'bg-white text-gray-600'}`}>安</button>
                <button onClick={() => setPayer('Tingbao')} className={`text-[12px] font-bold ${payer === 'Tingbao' ? 'bg-tokyo-tingbao text-white' : 'bg-white text-gray-600'}`}>婷</button>
              </div>
            </div>
          </div>
          <div>
            <label className="text-[10px] text-gray-600 font-bold block mb-1 uppercase">內容 DESCRIPTION</label>
            <input className="w-full px-3 py-2 bg-gray-50 border-b-2 border-gray-200 outline-none text-[16px] font-medium rect-ui focus:border-tokyo-ink transition-colors font-serif" placeholder="消費內容..." value={desc} onChange={e => setDesc(e.target.value)} />
          </div>
          <div>
            <label className="text-[10px] text-gray-600 font-bold block mb-1 uppercase">金額 AMOUNT</label>
            <div className="flex items-center bg-gray-50 border-b-2 border-gray-200 focus-within:border-tokyo-ink transition-colors overflow-hidden">
                <input className="flex-1 min-w-0 px-3 py-2 bg-transparent outline-none text-2xl font-mono font-bold text-tokyo-ink" type="number" inputMode="decimal" value={amt} onChange={e => setAmt(e.target.value)} placeholder="0" />
                <div className="flex shrink-0 bg-white h-[44px] border-l border-gray-100">
                    <button onClick={() => setCurr('JPY')} className={`px-2.5 py-1 text-[11px] font-bold ${curr === 'JPY' ? 'bg-tokyo-ink text-white' : 'text-gray-600'}`}>JPY</button>
                    <button onClick={() => setCurr('TWD')} className={`px-2.5 py-1 text-[11px] font-bold ${curr === 'TWD' ? 'bg-tokyo-ink text-white' : 'text-gray-600'}`}>TWD</button>
                </div>
            </div>
          </div>
          <div className="bg-gray-50 p-3 border border-gray-200 rect-ui space-y-3 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-tokyo-ink font-bold">分帳模式</span>
              <select value={split} onChange={(e) => setSplit(e.target.value as any)} className="bg-white px-2 py-1 border-2 border-tokyo-ink text-[11px] font-bold rect-ui outline-none">
                <option value="average">平均分攤</option>
                <option value="manual">自定義金額</option>
              </select>
            </div>
            {split === 'manual' && (
              <div className="flex gap-3 pt-3 border-t border-dashed border-gray-300">
                <div className="flex-1">
                  <label className="text-[9px] text-tokyo-anbao font-bold block mb-1">安寶負擔</label>
                  <input className="w-full px-2 py-1.5 bg-white border border-gray-200 rect-ui text-[14px] font-mono font-bold outline-none focus:border-tokyo-anbao" type="number" value={manualAmount} onChange={e => setManualAmount(e.target.value)} />
                </div>
                <div className="flex-1">
                  <label className="text-[9px] text-tokyo-tingbao font-bold block mb-1 opacity-80">婷寶負擔</label>
                  <div className="w-full px-2 py-1.5 bg-gray-100 text-[14px] font-mono font-bold text-gray-600 rect-ui font-medium">{splitPreview.tingbao.toLocaleString()}</div>
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={() => setShowModal(false)} className="py-3 border-2 border-gray-200 text-sm font-bold text-gray-600 rect-ui active:bg-gray-50">取消</button>
            <button onClick={handleSave} className="py-3 bg-tokyo-ink text-white text-sm font-bold rect-ui active:opacity-90 shadow-lg tracking-widest uppercase">儲存項目</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
