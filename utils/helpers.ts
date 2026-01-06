
import { CostItem } from '../types';

export const formatDate = (date: Date | string) => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date).substring(0, 10).replace(/-/g, '/');
  
  const year = d.getFullYear().toString(); // 取得完整四位年份
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

export const calculateShares = (item: Pick<CostItem, 'amount' | 'splitType' | 'manualAmount' | 'manualSplitPerson'>) => {
  if (item.splitType === 'average') {
    const half = Math.floor(item.amount / 2);
    return { anbao: half, tingbao: item.amount - half };
  }
  
  const manualAmt = item.manualAmount || 0;
  if (item.manualSplitPerson === 'Anbao') {
    return { anbao: manualAmt, tingbao: Math.max(0, item.amount - manualAmt) };
  } else {
    return { tingbao: manualAmt, anbao: Math.max(0, item.amount - manualAmt) };
  }
};

export const getDayOfWeek = (dateStr: string) => {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return days[new Date(dateStr).getDay()];
};
