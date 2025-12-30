
import { CostItem } from '../types';

/**
 * 儲存消費紀錄到 Google Sheets
 */
export const saveCostToGAS = async (item: CostItem, url: string, action: 'add' | 'edit' | 'delete' = 'add') => {
  if (!url) return;
  
  const amountTwd = item.currency === 'TWD' ? item.amount : 0;
  const amountJpy = item.currency === 'JPY' ? item.amount : 0;
  
  let splitXiangTwd = 0, splitXiangJpy = 0, splitQianTwd = 0, splitQianJpy = 0;
  
  // 計算分帳份額
  let xiangShare = 0;
  let qianShare = 0;

  if (item.splitType === 'average') {
    xiangShare = item.amount / 2;
    qianShare = item.amount / 2;
  } else {
    // 手動分攤
    const manualAmt = item.manualAmount || 0;
    if (item.manualSplitPerson === 'Anbao') {
      xiangShare = manualAmt;
      qianShare = item.amount - manualAmt;
    } else {
      qianShare = manualAmt;
      xiangShare = item.amount - manualAmt;
    }
  }

  if (item.currency === 'TWD') {
    splitXiangTwd = xiangShare;
    splitQianTwd = qianShare;
  } else {
    splitXiangJpy = xiangShare;
    splitQianJpy = qianShare;
  }

  const payload = {
    action,
    date: item.date.replace(/-/g, '/'),
    item: item.description,
    payer: item.payer === 'Anbao' ? '安寶' : '婷寶',
    amountTwd,
    amountJpy,
    splitXiangTwd,
    splitXiangJpy,
    splitQianTwd,
    splitQianJpy,
    note: item.notes || "",
    rowIndex: item.id
  };

  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("GAS API Error:", e);
  }
};

/**
 * 從 Google Sheets 讀取資料並自動判定分帳類型
 */
export const fetchCostsFromGAS = async (url: string): Promise<CostItem[] | null> => {
  if (!url) return null;
  try {
    const response = await fetch(`${url}?_t=${Date.now()}`);
    const result = await response.json();
    
    if (result && result.status === 'success' && Array.isArray(result.data)) {
        return result.data.map((row: any) => {
            const jpyVal = Number(row.jpy || 0);
            const twdVal = Number(row.twd || 0);
            const isJPY = jpyVal > 0;
            const total = isJPY ? jpyVal : twdVal;
            
            // 關鍵：從雲端份額判定分帳模式
            const cloudXiangShare = isJPY ? Number(row.splitXiangJpy || 0) : Number(row.splitXiangTwd || 0);
            const isAverage = Math.abs(cloudXiangShare - (total / 2)) < 0.1;

            return {
                id: String(row.rowIndex),
                date: String(row.date || "").replace(/'/g, "").replace(/-/g, '/'),
                description: String(row.item || ""),
                payer: (row.payer === '婷寶' || row.payer === 'Tingbao') ? 'Tingbao' : 'Anbao',
                amount: total,
                currency: isJPY ? 'JPY' : 'TWD',
                splitType: isAverage ? 'average' : 'manual',
                manualSplitPerson: isAverage ? undefined : 'Anbao',
                manualAmount: isAverage ? undefined : cloudXiangShare,
                notes: String(row.note || ""),
            };
        });
    }
    return [];
  } catch (e) {
    console.error("GAS Fetch Error:", e);
    return null; 
  }
};
