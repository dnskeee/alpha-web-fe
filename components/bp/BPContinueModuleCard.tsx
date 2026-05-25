'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

import { BPCard } from './BPCard';
import { BPPillButton } from './BPPillButton';
import { BPProgressBar } from './BPProgressBar';
import { lessonWord } from '@/lib/utils/plural';
import { ApiModule } from '@/types/api';
import s from './BPContinueModuleCard.module.css';

interface Props {
  module: ApiModule;
  className?: string;
}

export function BPContinueModuleCard({ module, className }: Props) {
  const router = useRouter();

  const progress = module.totalLessons > 0
    ? (module.completedLessons / module.totalLessons) * 100
    : 0;
  const lessonsLeft = module.totalLessons - module.completedLessons;

  return (
    <BPCard className={clsx(s.card, className)}>
      <div className={s.cover}>
        {module.imageUrl && (
          <Image src={module.imageUrl} alt="" fill className={s.coverImage} />
        )}
      </div>
      <div className={s.body}>
        <span className={s.label}>Продолжить</span>
        <p className={s.title}>{module.title}</p>
        <span className={s.lesson}>Урок {module.completedLessons + 1}</span>
        <BPProgressBar progress={progress} className={s.bar} />
        <div className={s.bottom}>
          <span className={s.meta}>
            {Math.round(progress)}% · ещё {lessonsLeft} {lessonWord(lessonsLeft)}
          </span>
          <BPPillButton
            label="Продолжить →"
            onClick={() => router.push(`/module/${module.id}`)}
          />
        </div>
      </div>
    </BPCard>
  );
}
