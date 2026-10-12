import React from 'react';
import { getStatusBadgeConfig } from '../../utils/formatters';

export default function Badge({ status, label, variant = 'default', size = 'md' }) {
  const config = getStatusBadgeConfig(status || variant);
  const displayLabel = label || config.label;

  const sizeClasses = size === 'sm' 
    ? 'px-2 py-0.5 text-xs' 
    : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      {displayLabel}
    </span>
  );
}
