'use client';

import React from 'react';
import clsx from 'clsx';

import { BackIcon } from '@/components/icons/BackIcon';
import { LogoIcon } from '@/components/icons/LogoIcon';
import s from './BPPageHeader.module.css';

interface Props {
  onBack: () => void;
  className?: string;
}

export function BPPageHeader({ onBack, className }: Props) {
  return (
    <div className={clsx(s.bar, className)}>
      <button type="button" onClick={onBack} className={s.backBtn}>
        <BackIcon size={18} color="var(--color-ink)" />
      </button>
      <div className={s.logo}>
        <LogoIcon background="var(--color-ink)" foreground="var(--color-bg-dark)" size={32} />
        <span className={s.logoText}>BePrime</span>
      </div>
    </div>
  );
}
