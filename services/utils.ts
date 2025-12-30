
export const formatDate = (date?: string | Date): string => {
  const d = date ? new Date(date) : new Date();
  if (isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

export const cleanDateString = (dateStr: string): string => {
  if (!dateStr) return '';
  return dateStr.substring(0, 10).replace(/-/g, '/').replace(/T.*/, '').trim();
};
