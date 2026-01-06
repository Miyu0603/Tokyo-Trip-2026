
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
  
  // Form States
  const [editingId, setEditingId] = useState<string | null>(null);
  const [date, setDate] = useState(formatDate(new Date()));
  const [desc, setDesc] = useState('');
  const [amt, setAmt] = useState('');
  const [curr, setCurr] = useState<'JPY'|'TWD'>('JPY');
  const [payer, setPayer] = useState<'Anbao'|'Tingbao'>('Anbao');
  const [split, setSplit] = useState<'average'|'manual'>('average');
  const [anbaoShare, setAnbaoShare] = useState('');
  const [tingbaoShare, setTingbaoShare] = useState('');
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

  const openAddModal = () => {
    setEditingId(null);
    setDate(formatDate(new Date()));
    setDesc('');
    setAmt('0');
    setCurr('JPY');
    setPayer('Anbao');
    setSplit('average');
    setAnbaoShare('0');
    setTingbaoShare('0');
    setNotes('');
    setShowModal(true);
  };

  const handleAmountChange = (val: string) => {
    setAmt(val);
    const total = parseFloat(val) || 0;
    if (split === 'average') {
      const half = Math.floor(total / 2);
      setAnbaoShare(half.toString());
      setTingbaoShare((total - half).toString());
    }
  };

  const toggleSplitMode = (mode: 'average'|'manual') => {
    setSplit(mode);
    if (mode === 'average') {
      const total = parseFloat(amt) || 0;
      const half = Math.floor(total / 2);
      setAnbaoShare(half.toString());
      setTingbaoShare((total - half).toString());
    }
  };

  const handleManualAnbao = (val: string) => {
    if (split === 'average') return;
    setAnbaoShare(val);
    const total = parseFloat(amt) || 0;
    const v = parseFloat(val) || 0;
    setTingbaoShare(Math.max(0, total - v).toString());
  };

  const handleManualTingbao = (val: string) => {
    if (split === 'average') return;
    setTingbaoShare(val);
    const total = parseFloat(amt) || 0;
    const v = parseFloat(val) || 0;
    setAnbaoShare(Math.max(0, total - v).toString());
  };

  const handleSave = async () => {
    if (!desc || !amt || !date) return;
    
    const newItem: CostItem = {
      id: editingId || Date.now().toString(),
      date,
      description: desc,
      amount: parseFloat(amt),
      currency: curr,
      payer,
      splitType: split,
      manualSplitPerson: 'Anbao', 
      manualAmount: parseFloat(anbaoShare || '0'),
      notes
    };

    const updatedCosts = editingId ? costs.map(c => c.id === editingId ? newItem : c) : [newItem, ...costs];
    setCosts(updatedCosts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCosts));
    setShowModal(false);

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
      jpy: { diff: anbaoDebtJPY - tingbaoDebtJPY, abs: Math.round(Math.abs(anbaoDebtJPY - tingbaoDebtJPY)) },
      twd: { diff: anbaoDebtTWD - tingbaoDebtTWD, abs: Math.round(Math.abs(anbaoDebtTWD - tingbaoDebtTWD)) }
    };
  }, [costs]);

  return (
    <div className="pb-32 px-4 pt-4 relative min-h-screen">
      {/* 總覽卡片 */}
      <div className="bg-white border-2 border-tokyo-ink mb-8 rect-ui shadow-float overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-serif font-bold text-lg text-tokyo-ink">旅費總覽</h3>
            <button onClick={handleSync} className={`p-1 ${isSyncing ? 'animate-spin text-tokyo-red' : 'text-gray-400'}`}>
                <Icon name="sync" className="w-5 h-5" />
            </button>
        </div>
        <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
            <div className="py-4 text-center">
                <span className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">JPY Total</span>
                <span className="text-2xl font-mono font-bold">¥{costs.filter(c => c.currency === 'JPY').reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
            </div>
            <div className="py-4 text-center">
                <span className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-widest">TWD Total</span>
                <span className="text-2xl font-mono font-bold">${costs.filter(c => c.currency === 'TWD').reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
            </div>
        </div>
        <button onClick={() => setShowSettleModal(true)} className="w-full py-4 bg-tokyo-ink text-white text-[12px] font-bold tracking-[0.2em] active:opacity-90 uppercase transition-all">
            結算精算 SETTLE
        </button>
      </div>

      {/* 列表標題與新增按鈕 */}
      <div className="flex justify-between items-end mb-5 px-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-[0.2em] mb-1.5">Expense Details</span>
            <h2 className="font-serif font-bold text-xl text-tokyo-ink tracking-wide">支出明細</h2>
          </div>
          <button 
            onClick={openAddModal}
            className="w-9 h-9 bg-tokyo-ink text-white flex items-center justify-center rect-ui shadow-md active:scale-95 transition-all"
            title="新增消費"
          >
            <Icon name="plus" className="w-6 h-6" />
          </button>
      </div>

      {/* 支出列表 */}
      <div className="space-y-3 mb-8">
        {costs.length === 0 ? (
          <div className="py-20 text-center text-gray-400 italic font-serif border-2 border-dashed border-gray-100 rect-ui">尚未有消費紀錄</div>
        ) : costs.map(item => (
          <div key={item.id} className="bg-white px-4 py-4 flex justify-between items-center rect-ui border border-gray-100 shadow-sm">
            <div className="flex flex-col flex-1 overflow-hidden mr-4">
              <div className="flex items-center space-x-2.5 mb-1.5">
                <span className={`px-2 py-0.5 text-[11px] font-bold rect-ui text-white ${item.payer === 'Anbao' ? 'bg-tokyo-red' : 'bg-tokyo-tingbao'}`}>
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
                  const shares = calculateShares(item);
                  setAnbaoShare(shares.anbao.toString());
                  setTingbaoShare(shares.tingbao.toString());
                  setNotes(item.notes || ''); setShowModal(true);
                }} className="text-gray-200 hover:text-tokyo-ink p-1.5 transition-colors"><Icon name="edit" className="w-5 h-5" /></button>
                <button onClick={() => setDeleteTargetId(item.id)} className="text-gray-200 hover:text-tokyo-red p-1.5 transition-colors"><Icon name="trash" className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 刪除確認彈窗 */}
      <Modal isOpen={!!deleteTargetId} onClose={() => setDeleteTargetId(null)} title="確認刪除">
          <div className="space-y-6">
              <p className="text-center font-bold text-tokyo-ink">確定要刪除這筆紀錄嗎？</p>
              <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setDeleteTargetId(null)} className="py-4 border-2 border-gray-200 font-bold rect-ui text-gray-400">取消</button>
                  <button onClick={executeDelete} className="py-4 bg-tokyo-red text-white font-bold rect-ui shadow-md">確定刪除</button>
              </div>
          </div>
      </Modal>

      {/* 結算精算彈窗優化 */}
      <Modal isOpen={showSettleModal} onClose={() => setShowSettleModal(false)} title="結算精算">
        <div className="space-y-6">
          {[
            { key: 'jpy', label: '日幣 JPY', symbol: '¥', data: settleSummary.jpy },
            { key: 'twd', label: '台幣 TWD', symbol: '$', data: settleSummary.twd }
          ].map((section) => (
            <div key={section.key} className="relative">
              <div className="flex items-center space-x-2 mb-3">
                <div className="h-[2px] flex-1 bg-gray-100"></div>
                <span className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">{section.label}</span>
                <div className="h-[2px] flex-1 bg-gray-100"></div>
              </div>

              {section.data.abs > 0 ? (
                <div className="bg-white border-2 border-tokyo-ink p-6 rect-ui shadow-paper flex flex-col items-center">
                  <div className="flex items-center justify-between w-full mb-6 relative">
                    {/* 付款方 */}
                    <div className="flex flex-col items-center z-10 bg-white px-2">
                        <div className={`w-12 h-12 flex items-center justify-center text-white font-bold rect-ui mb-2 shadow-md ${section.data.diff > 0 ? 'bg-tokyo-red' : 'bg-tokyo-tingbao'}`}>
                           {section.data.diff > 0 ? '安寶' : '婷寶'}
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">PAYER</span>
                    </div>

                    {/* 中間箭頭與金額 */}
                    <div className="flex-1 flex flex-col items-center justify-center -mx-4">
                        <div className="text-xl font-mono font-bold text-tokyo-ink mb-1">
                          {section.symbol}{section.data.abs.toLocaleString()}
                        </div>
                        <div className="w-full relative h-4 flex items-center">
                           <div className="w-full h-[2px] bg-gray-200"></div>
                           <div className="absolute right-0 w-2 h-2 border-r-2 border-t-2 border-gray-400 rotate-45"></div>
                        </div>
                        <span className="text-[9px] font-bold text-tokyo-gold tracking-widest mt-1">TRANSFER</span>
                    </div>

                    {/* 收款方 */}
                    <div className="flex flex-col items-center z-10 bg-white px-2">
                        <div className={`w-12 h-12 flex items-center justify-center text-white font-bold rect-ui mb-2 shadow-md ${section.data.diff > 0 ? 'bg-tokyo-tingbao' : 'bg-tokyo-red'}`}>
                           {section.data.diff > 0 ? '婷寶' : '安寶'}
                        </div>
                        <span className="text-[10px] font-bold text-gray-400">RECIPIENT</span>
                    </div>
                  </div>
                  
                  <div className="w-full pt-4 border-t border-dashed border-gray-100 text-center">
                    <p className="text-sm font-bold text-tokyo-ink leading-tight">
                       請 <span className={section.data.diff > 0 ? 'text-tokyo-red' : 'text-tokyo-tingbao'}>{section.data.diff > 0 ? '安寶' : '婷寶'}</span> 轉帳給 <span className={section.data.diff > 0 ? 'text-tokyo-tingbao' : 'text-tokyo-red'}>{section.data.diff > 0 ? '婷寶' : '安寶'}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-8 rect-ui text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-50 text-green-500 mb-3">
                    <Icon name="check" className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-gray-400 tracking-widest uppercase">已結清 Balanced</p>
                </div>
              )}
            </div>
          ))}

          <div className="pt-4">
            <button 
              onClick={() => setShowSettleModal(false)} 
              className="w-full py-4 bg-tokyo-ink text-white font-bold rect-ui shadow-lg active:scale-[0.98] transition-all tracking-widest"
            >
              完成確認 DONE
            </button>
          </div>
        </div>
      </Modal>

      {/* 新增/編輯消費彈窗 */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingId ? "編輯消費" : "新增消費"}>
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">日期 DATE</label>
              <div className="relative">
                <input 
                  type="text"
                  className="w-full px-3 py-2 bg-gray-50 border-none outline-none font-mono font-bold rect-ui text-sm" 
                  value={date} 
                  onChange={e => setDate(e.target.value)} 
                  placeholder="2026/01/06" 
                />
              </div>
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">支付者 PAYER</label>
              <div className="flex border-2 border-tokyo-ink overflow-hidden h-9 rect-ui">
                <button 
                  onClick={() => setPayer('Anbao')} 
                  className={`flex-1 font-bold text-xs transition-all ${payer === 'Anbao' ? 'bg-tokyo-red text-white' : 'bg-white text-tokyo-ink'}`}
                >
                  安寶
                </button>
                <button 
                  onClick={() => setPayer('Tingbao')} 
                  className={`flex-1 font-bold text-xs transition-all ${payer === 'Tingbao' ? 'bg-tokyo-tingbao text-white' : 'bg-white text-tokyo-ink'}`}
                >
                  婷寶
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">內容 DESCRIPTION</label>
            <input 
              className="w-full px-3 py-3 bg-gray-50 border-none outline-none text-base font-bold rect-ui placeholder:text-gray-300" 
              placeholder="輸入消費內容" 
              value={desc} 
              onChange={e => setDesc(e.target.value)} 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">金額 AMOUNT</label>
            <div className="flex items-center bg-gray-50 rect-ui h-12 pr-1.5">
              <input 
                className="flex-1 px-3 py-2 bg-transparent outline-none text-base font-mono font-bold text-tokyo-ink placeholder:text-gray-200" 
                type="number" 
                value={amt === '0' ? '' : amt} 
                onChange={e => handleAmountChange(e.target.value)} 
                placeholder="0" 
              />
              <div className="flex bg-white border border-gray-100 p-0.5 rect-ui shadow-sm h-9">
                <button 
                  onClick={() => setCurr('JPY')} 
                  className={`px-3 py-1 text-[10px] font-bold rect-ui transition-all ${curr === 'JPY' ? 'bg-tokyo-ink text-white shadow-sm' : 'text-gray-400'}`}
                >
                  JPY
                </button>
                <button 
                  onClick={() => setCurr('TWD')} 
                  className={`px-3 py-1 text-[10px] font-bold rect-ui transition-all ${curr === 'TWD' ? 'bg-tokyo-ink text-white shadow-sm' : 'text-gray-400'}`}
                >
                  TWD
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">分帳 SPLIT MODE</span>
              <div className="flex bg-gray-100 p-0.5 rect-ui shadow-inner h-8">
                <button 
                  onClick={() => toggleSplitMode('average')} 
                  className={`px-3 py-1 text-[10px] font-bold rect-ui transition-all ${split === 'average' ? 'bg-white text-tokyo-ink shadow-sm' : 'text-gray-500'}`}
                >
                  Average
                </button>
                <button 
                  onClick={() => toggleSplitMode('manual')} 
                  className={`px-3 py-1 text-[10px] font-bold rect-ui transition-all ${split === 'manual' ? 'bg-white text-tokyo-ink shadow-sm' : 'text-gray-500'}`}
                >
                  Custom
                </button>
              </div>
            </div>
            
            <div className="border-t border-dashed border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className={`text-[10px] font-bold block uppercase tracking-tighter ${split === 'average' ? 'text-gray-400' : 'text-tokyo-red'}`}>安寶負擔</label>
                        <div className={`rect-ui p-0.5 ${split === 'average' ? 'bg-gray-100/50 cursor-not-allowed' : 'bg-gray-50'}`}>
                        <input 
                            type="number" 
                            className="w-full bg-transparent px-2 py-2 font-mono font-bold text-base outline-none" 
                            value={anbaoShare} 
                            onChange={e => handleManualAnbao(e.target.value)}
                            readOnly={split === 'average'}
                        />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className={`text-[10px] font-bold block uppercase tracking-tighter ${split === 'average' ? 'text-gray-400' : 'text-tokyo-tingbao'}`}>婷寶負擔</label>
                        <div className={`rect-ui p-0.5 ${split === 'average' ? 'bg-gray-100/50 cursor-not-allowed' : 'bg-gray-50'}`}>
                        <input 
                            type="number" 
                            className="w-full bg-transparent px-2 py-2 font-mono font-bold text-base outline-none" 
                            value={tingbaoShare} 
                            onChange={e => handleManualTingbao(e.target.value)}
                            readOnly={split === 'average'}
                        />
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">備註 NOTE</label>
            <input 
              className="w-full px-3 py-2 bg-gray-50 border-none outline-none text-xs font-medium rect-ui placeholder:text-gray-300" 
              placeholder="選填項目細節" 
              value={notes} 
              onChange={e => setNotes(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button 
                onClick={() => setShowModal(false)} 
                className="py-3.5 border-2 border-gray-100 font-bold text-gray-400 rect-ui text-sm hover:bg-gray-50 transition-colors"
            >
                取消
            </button>
            <button 
                onClick={handleSave} 
                className="py-3.5 bg-tokyo-ink text-white font-bold rect-ui shadow-lg text-sm hover:opacity-90 active:scale-[0.98] transition-all"
            >
                儲存項目
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
