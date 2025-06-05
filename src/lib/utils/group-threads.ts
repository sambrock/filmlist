import { Thread } from '../types';

export const groupThreadsByTime = (threads: Thread[]) => {
  const now = new Date();

  const today = new Date(now.setHours(0, 0, 0, 0)).getTime();
  const last7Days = new Date(now.setDate(now.getDate() - 7)).getTime();
  const last30Days = new Date(now.setDate(now.getDate() - 30)).getTime();
  const year = new Date(now.setMonth(0, 1)).getTime();

  const grouped: Map<string, Thread[]> = new Map();

  threads.forEach((thread) => {
    const createdDate = new Date(thread.createdAt);

    if (createdDate.getTime() >= today) {
      grouped.set('Today', [...(grouped.get('Today') || []), thread]);
    } else if (createdDate.getTime() >= last7Days) {
      grouped.set('Last 7 Days', [...(grouped.get('Last 7 Days') || []), thread]);
    } else if (createdDate.getTime() >= last30Days) {
      grouped.set('Last 30 Days', [...(grouped.get('Last 30 Days') || []), thread]);
    } else if (createdDate.getTime() >= year) {
      const monthKey = `${createdDate.toLocaleString('default', { month: 'long' })}`;
      grouped.set(monthKey, [...(grouped.get(monthKey) || []), thread]);
    } else {
      const yearKey = createdDate.getFullYear().toString();
      grouped.set(yearKey, [...(grouped.get(yearKey) || []), thread]);
    }
  });

  return grouped;
};
