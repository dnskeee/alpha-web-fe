'use client';

import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import { BPCard } from './BPCard';
import { ApiModule } from '@/types/api';
import s from './BPRecommendedModuleCard.module.css';

interface Props {
  module: ApiModule;
  className?: string;
}

export function BPRecommendedModuleCard({ module, className }: Props) {
  return (
    <Link href={`/module/${module.id}`} className={clsx(s.link, className)}>
      <BPCard className={s.card} padding={22}>
        <span className={s.kicker}>Рекомендуемая тема</span>
        <p className={s.title}>{module.title}</p>
        {module.description && (
          <p className={s.description}>{module.description}</p>
        )}
        <div className={s.cta}>
          <span className={s.ctaText}>Начать тему →</span>
        </div>
      </BPCard>
    </Link>
  );
}
