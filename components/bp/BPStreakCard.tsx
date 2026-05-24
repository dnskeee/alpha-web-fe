'use client';

import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';

import { BPCard } from './BPCard';
import { ZapIcon } from '@/components/icons/ZapIcon';
import { StreakDay } from '@/types/api';
import s from './BPStreakCard.module.css';

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function getHabitText(days: number): string {
  if (days <= 6) return 'Начало — самый важный шаг';
  if (days <= 13) return 'Первая неделя позади — держись';
  if (days <= 20) return `До закрепления привычки ${21 - days} дней`;
  if (days <= 65) return `Привычка формируется — ещё ${66 - days} дней до автоматизма`;
  return 'Привычка закреплена. Это твой новый режим';
}

interface Props {
  streakDays: number;
  currentWeek: StreakDay[];
  className?: string;
}

export function BPStreakCard({ streakDays, currentWeek, className }: Props) {
  return (
    <Link href="/streak" className={clsx(s.link, className)}>
      <BPCard>
        <div className={s.header}>
          <div className={s.streakRow}>
            <ZapIcon size={20} color="var(--color-zap)" />
            <span className={s.streakCount}>{streakDays} дней подряд</span>
          </div>
          <span className={s.habitText}>{getHabitText(streakDays)}</span>
        </div>
        <div className={s.days}>
          {DAYS.map((day, i) => {
            const done = currentWeek[i]?.hasActivity ?? false;
            return (
              <div key={i} className={s.dayItem}>
                <div className={clsx(s.dayBar, done && s.dayBarDone)} />
                <span className={s.dayLabel}>{day}</span>
              </div>
            );
          })}
        </div>
      </BPCard>
    </Link>
  );
}
