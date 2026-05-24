import React from 'react';
import clsx from 'clsx';

import s from './BPCard.module.css';

interface Props {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  radius?: number;
  padding?: number;
  flat?: boolean;
}

export function BPCard({ children, className, style, radius = 22, padding = 18, flat = false }: Props) {
  return (
    <div
      className={clsx(s.card, !flat && s.shadow, className)}
      style={{ borderRadius: radius, padding, ...style }}
    >
      {children}
    </div>
  );
}
