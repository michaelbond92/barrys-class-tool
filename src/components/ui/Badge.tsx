import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = ''
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
      {children}
    </span>
  );
}

interface EnergyBadgeProps {
  level: 'L1' | 'L2' | 'L3';
}

export function EnergyBadge({ level }: EnergyBadgeProps) {
  const levelClasses = {
    L1: 'bg-energy-l1 text-green-800',
    L2: 'bg-energy-l2 text-yellow-800',
    L3: 'bg-energy-l3 text-pink-800'
  };

  const levelLabels = {
    L1: 'Warmup',
    L2: 'Building',
    L3: 'Finisher'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${levelClasses[level]}`}>
      {levelLabels[level]}
    </span>
  );
}
