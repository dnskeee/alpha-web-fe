'use client';

import React from 'react';
import clsx from 'clsx';

import { BackIcon } from '@/components/icons/BackIcon';
import { ZapIcon } from '@/components/icons/ZapIcon';
import { LogoIcon } from '@/components/icons/LogoIcon';
import s from './BPTopBar.module.css';

interface Props {
  showLogo?: boolean;
  onBack?: () => void;
  title?: string;
  streak?: number;
  onStreakPress?: () => void;
  className?: string;
}

export function BPTopBar({ showLogo = true, onBack, title, streak, onStreakPress, className }: Props) {
  return (
    <div className={clsx(s.bar, className)}>
      <div className={s.left}>
        {onBack ? (
          <button type="button" onClick={onBack} className={s.backBtn}>
            <BackIcon size={18} color="var(--color-ink)" />
          </button>
        ) : showLogo ? (
          <div className={s.logo}>
            <LogoIcon background="var(--color-ink)" foreground="var(--color-bg-dark)" size={32} />
            <span className={s.logoText}>BePrime</span>
          </div>
        ) : (
          <div className={s.spacer} />
        )}
      </div>

      {title && (
        <span className={s.title}>{title}</span>
      )}

      <div className={s.right}>
        {typeof streak === 'number' ? (
          <button type="button" onClick={onStreakPress} className={s.streakChip}>
            <ZapIcon size={14} color="var(--color-zap)" />
            <span className={s.streakCount}>{streak}</span>
          </button>
        ) : (
          <div className={s.spacer} />
        )}
      </div>
    </div>
  );
}
