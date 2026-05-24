import React from 'react';
import clsx from 'clsx';

import s from './BPSoftCard.module.css';

interface Props {
  children: React.ReactNode;
  className?: string;
  radius?: number;
  padding?: number;
}

export function BPSoftCard({ children, className, radius = 18, padding = 14 }: Props) {
  return (
    <div
      className={clsx(s.card, className)}
      style={{ borderRadius: radius, padding }}
    >
      {children}
    </div>
  );
}
