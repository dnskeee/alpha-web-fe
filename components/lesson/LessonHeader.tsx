'use client';

import React from 'react';
import { BackIcon } from '@/components/icons/BackIcon';
import s from './LessonHeader.module.css';

interface LessonHeaderProps {
  lessonNumber?: number;
  estimatedTime: string;
  totalCards: number;
  currentCard: number;
  title?: string;
  onBack: () => void;
}

export function LessonHeader({
  totalCards,
  currentCard,
  title,
  onBack,
}: LessonHeaderProps) {
  const cur = currentCard + 1;

  return (
    <div>
      <div className={s.topBar}>
        <button
          onClick={onBack}
          className={s.backButton}
          aria-label="Назад"
        >
          <BackIcon size={18} color="var(--color-ink)" />
        </button>
        <div className={s.center}>
          {title ? (
            <span className={s.title}>{title}</span>
          ) : null}
        </div>
        <div className={s.pill}>
          <span className={s.pillText}>
            {cur} / {totalCards}
          </span>
        </div>
      </div>
      <div className={s.segments}>
        {Array.from({ length: totalCards }).map((_, i) => {
          const isFilled = i < currentCard;
          const isCurrent = i === currentCard;
          const isActive = isFilled || isCurrent;
          return (
            <div
              key={i}
              className={s.segment}
              style={{
                backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-track)',
                opacity: isCurrent ? 0.6 : 1,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
