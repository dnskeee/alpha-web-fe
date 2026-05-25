'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { BPProgressBar } from '@/components/bp/BPProgressBar';
import { TagBadge, TagBadgeVariant } from '@/components/ui/TagBadge';
import { ApiModule } from '@/types/api';
import { lessonWord } from '@/lib/utils/plural';
import s from './BPModuleListCard.module.css';

const COURSE_COLORS = [
  'var(--color-icon-a)',
  'var(--color-icon-b)',
  'var(--color-icon-c)',
  'var(--color-icon-d)',
  'var(--color-icon-e)',
];

interface Props {
  module: ApiModule;
  index: number;
}

export function BPModuleListCard({ module, index }: Props) {
  const router = useRouter();
  const color = COURSE_COLORS[index % COURSE_COLORS.length] ?? COURSE_COLORS[0];
  const pct = module.totalLessons > 0
    ? Math.round((module.completedLessons / module.totalLessons) * 100)
    : 0;
  const hasProgress = module.completedLessons > 0;
  const isOwned = module.isOwned;
  const isDone = module.completedLessons === module.totalLessons && module.totalLessons > 0;
  const isInProgress = hasProgress && !isDone;
  const isEmpty = !isOwned && !hasProgress;

  const showBadge = !isInProgress;
  const badgeVariant: TagBadgeVariant = isDone ? 'success' : 'badge';
  const badgeLabel = isDone ? 'Пройден' : 'Не начат';

  const showProgressBar = !isEmpty;
  const descriptionLines = isEmpty ? 3 : 2;
  const lessonsText = isEmpty
    ? `${module.totalLessons} ${lessonWord(module.totalLessons)}`
    : `${module.completedLessons} / ${module.totalLessons} ${lessonWord(module.totalLessons)}`;

  const open = () => router.push(`/module/${module.id}`);

  return (
    <div
      className={s.wrap}
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => e.key === 'Enter' && open()}
    >
      <div className={s.card}>
        {isOwned && <div className={s.ownedStripe} />}

        <div className={s.cover} style={{ backgroundColor: color }}>
          {module.imageUrl && (
            <Image src={module.imageUrl} alt="" fill className={s.coverImage} />
          )}
        </div>

        <div className={s.body}>
          <div className={s.badgeRow}>
            {showBadge && <TagBadge variant={badgeVariant} label={badgeLabel} />}
            <span className={s.lessonsText}>{lessonsText}</span>
            {isOwned && (
              <span className={s.ownedBadge}>
                <TagBadge variant="success" label="ПРИОБРЕТЕНО" />
              </span>
            )}
          </div>
          <p className={s.moduleTitle}>{module.title}</p>
          {module.description && (
            <p
              className={s.moduleDesc}
              style={{ WebkitLineClamp: descriptionLines }}
            >
              {module.description}
            </p>
          )}
          {showProgressBar && (
            <div className={s.progressRow}>
              <div className={s.progressBar}>
                <BPProgressBar progress={pct} height={4} radius={2} />
              </div>
              <span className={s.progressPct}>{pct}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
