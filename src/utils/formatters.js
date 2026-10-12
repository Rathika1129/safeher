// Formatting utilities for SafeHer

export function formatDateTime(isoStringOrTimestamp) {
  if (!isoStringOrTimestamp) return 'N/A';
  const d = new Date(isoStringOrTimestamp);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

export function formatTimeOnly(isoStringOrTimestamp) {
  if (!isoStringOrTimestamp) return 'N/A';
  const d = new Date(isoStringOrTimestamp);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
}

export function formatSecondsToTimer(totalSeconds) {
  if (totalSeconds <= 0) return '00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => n.toString().padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
}

export function formatDistance(km) {
  if (km == null || isNaN(km)) return 'Distance unavailable';
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return `${meters} m away`;
  }
  return `${km.toFixed(1)} km away`;
}

export function getStatusBadgeConfig(status) {
  switch (status) {
    case 'ACTIVE':
    case 'SOS_TRIGGERED':
      return { label: 'Active Emergency', bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' };
    case 'OVERDUE':
      return { label: 'Journey Overdue', bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', dot: 'bg-amber-500' };
    case 'RESOLVED':
    case 'SAFE':
      return { label: 'Marked Safe', bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200', dot: 'bg-emerald-500' };
    case 'CANCELLED':
    case 'FALSE_ALARM':
      return { label: 'Cancelled / False Alarm', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-400' };
    case 'IN_TRANSIT':
      return { label: 'Journey Active', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', dot: 'bg-purple-500' };
    default:
      return { label: status, bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-400' };
  }
}
