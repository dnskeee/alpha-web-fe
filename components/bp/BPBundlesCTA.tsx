'use client';

import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import { StarIcon } from '@/components/icons/StarIcon';
import s from './BPBundlesCTA.module.css';

interface Props {
  className?: string;
}

export function BPBundlesCTA({ className }: Props) {
  return (
    <Link href="/roadmap" className={clsx(s.link, className)}>
      <div className={s.inner}>
        <div className={s.icon}>
          <StarIcon size={20} color="var(--color-accent-ink)" />
        </div>
        <div className={s.text}>
          <span className={s.kicker}>Пакеты курсов</span>
          <span className={s.label}>Скидка до −40% на наборы</span>
        </div>
        <div className={s.pill}>
          <span className={s.pillText}>Смотреть</span>
        </div>
      </div>
    </Link>
  );
}
