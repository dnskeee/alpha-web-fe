import React from 'react';
import clsx from 'clsx';

import s from './BPProgressBar.module.css';

interface Props {
  progress: number;
  height?: number;
  radius?: number;
  fillColor?: string;
  className?: string;
}

export function BPProgressBar({ progress, height = 8, radius = 4, fillColor, className }: Props) {
  const pct = Math.max(0, Math.min(100, progress));
  return (
    <div
      className={clsx(s.track, className)}
      style={{ height, borderRadius: radius }}
    >
      <div
        className={s.fill}
        style={{
          width: `${pct}%`,
          borderRadius: radius,
          backgroundColor: fillColor ?? undefined,
        }}
      />
    </div>
  );
}
