import { CostItem } from '../types';

export const formatDate = (date: Date | string) => {
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

export const calculateShares = (item: Pick<CostItem, 'amount' | 'splitType' | 'manualAmount'>) => {
  if (item.splitType === 'average') {
    return { anbao: item.amount / 2, tingbao: item.amount / 2 };
  }
  const anbaoShare = item.manualAmount || 0;
  return {
    anbao: anbaoShare,
    tingbao: Math.max(0, item.amount - anbaoShare)
  };
};

export const getDayOfWeek = (dateStr: string) => {
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  return days[new Date(dateStr).getDay()];
};