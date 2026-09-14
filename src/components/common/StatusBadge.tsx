import React from 'react';
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const normalizedStatus = status.toUpperCase().replace(' ', '_');
  
  let colors = 'bg-gray-100 text-gray-800 border-gray-200';
  
  switch (normalizedStatus) {
    case 'ACTIVE':
    case 'ON_TIME':
    case 'APPROVED':
      colors = 'bg-green-100 text-green-800 border-green-200';
      break;
    case 'DELAYED':
    case 'MAINTENANCE':
    case 'PENDING':
    case 'WARNING':
      colors = 'bg-yellow-100 text-yellow-800 border-yellow-200';
      break;
    case 'CANCELLED':
    case 'INACTIVE':
    case 'REJECTED':
    case 'CRITICAL':
    case 'DANGER':
      colors = 'bg-red-100 text-red-800 border-red-200';
      break;
    case 'BOARDING':
    case 'INFO':
      colors = 'bg-blue-100 text-blue-800 border-blue-200';
      break;
  }

  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium border', colors)}>
      {status.replace('_', ' ')}
    </span>
  );
};
