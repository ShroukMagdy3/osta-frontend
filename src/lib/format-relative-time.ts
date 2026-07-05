
export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'الآن';
  if (diffMin < 60) return `منذ ${diffMin} ${diffMin === 1 ? 'دقيقة' : 'دقائق'}`;
  if (diffHour < 24) return `منذ ${diffHour} ${diffHour === 1 ? 'ساعة' : 'ساعات'}`;
  if (diffDay < 7) return `منذ ${diffDay} ${diffDay === 1 ? 'يوم' : 'أيام'}`;

  return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
}