'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { BPCard } from '@/components/bp/BPCard';
import { BPSectionTitle } from '@/components/bp/BPSectionTitle';
import { BPSoftCard } from '@/components/bp/BPSoftCard';
import { BPPageHeader } from '@/components/bp/BPPageHeader';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { ZapIcon } from '@/components/icons/ZapIcon';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { readStreakCache, writeStreakCache } from '@/lib/api/streakCache';
import { StreakDay } from '@/types/api';
import s from './page.module.css';

const WEEK_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getHabitText(days: number): string {
  if (days <= 6) return 'Начало — самый важный шаг';
  if (days <= 13) return 'Первая неделя позади — держись';
  if (days <= 20) return `До закрепления привычки ${21 - days} дней`;
  if (days <= 65) return `Привычка формируется — ещё ${66 - days} дней до автоматизма`;
  return 'Привычка закреплена. Это твой новый режим';
}

function buildCurrentWeek(activityMap: Record<string, boolean>): StreakDay[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + monOffset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    const date = toLocalDateString(d);
    return { date, hasActivity: activityMap[date] ?? false };
  });
}

const MILESTONES = [
  { days: 7, label: 'Первая неделя', hint: 'Сформирован первый цикл' },
  { days: 21, label: 'Привычка на старте', hint: 'Базовое закрепление' },
  { days: 66, label: 'Полный автоматизм', hint: 'Привычка стала режимом' },
];

export default function StreakPage() {
  const router = useRouter();
  const { withAuth } = useAuth();

  const [streakDays, setStreakDays] = useState(0);
  const [currentWeek, setCurrentWeek] = useState<StreakDay[]>(() => buildCurrentWeek({}));

  useEffect(() => {
    async function loadStreak() {
      const cached = await readStreakCache();
      if (cached) {
        setStreakDays(cached.streakDays);
        if (cached.currentWeek?.length === 7) setCurrentWeek(cached.currentWeek);
      }
      let weekPopulated = cached?.currentWeek?.length === 7;
      try {
        const fresh = await withAuth(() => api.streak.get());
        setStreakDays(fresh.streakDays);
        if (fresh.currentWeek?.length === 7) {
          setCurrentWeek(fresh.currentWeek);
          weekPopulated = true;
        }
        await writeStreakCache(fresh);
      } catch {
        // keep cached/zero state silently
      }
      if (!weekPopulated) {
        await fetchWeekFallback();
      }
    }

    async function fetchWeekFallback() {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      const from = toLocalDateString(new Date(year, month, 1));
      const to = toLocalDateString(new Date(year, month + 1, 0));
      try {
        const result = await withAuth(() => api.streak.getActivity(from, to));
        const map: Record<string, boolean> = {};
        result.days.forEach((d) => { map[d.date] = d.hasActivity; });
        setCurrentWeek(buildCurrentWeek(map));
      } catch {
        // ignore
      }
    }

    loadStreak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={s.safe}>
      <BPPageHeader onBack={() => router.back()} />

      <div className={s.scroll}>
        <div className={s.titleBlock}>
          <h1 className={s.title}>Серия</h1>
        </div>

        <BPCard className={s.heroCard}>
          <div className={s.heroInner}>
            <ZapIcon size={56} color="var(--color-zap)" />
            <span className={s.heroNumber}>{streakDays}</span>
            <span className={s.heroUnit}>дней подряд</span>
            <p className={s.heroHabit}>{getHabitText(streakDays)}</p>
          </div>
        </BPCard>

        <BPCard className={s.weekCard}>
          <span className={s.weekLabel}>Эта неделя</span>
          <div className={s.weekStrip}>
            {currentWeek.map((d, i) => (
              <div key={d.date ?? i} className={s.weekCol}>
                <div
                  className={s.weekBar}
                  data-active={d.hasActivity ? 'true' : 'false'}
                />
                <span className={s.weekDay}>{WEEK_LABELS[i]}</span>
              </div>
            ))}
          </div>
        </BPCard>

        <BPSectionTitle title="Цели" className={s.sectionTitle} />

        {MILESTONES.map((m) => {
          const reached = streakDays >= m.days;
          return (
            <BPSoftCard key={m.days} className={s.milestone}>
              <div
                className={s.milestoneIcon}
                data-reached={reached ? 'true' : 'false'}
              >
                {reached ? (
                  <CheckIcon size={16} color="var(--color-accent-ink)" />
                ) : (
                  <span className={s.milestoneDays}>{m.days}</span>
                )}
              </div>
              <div className={s.milestoneText}>
                <span className={s.milestoneLabel}>{m.label}</span>
                <span className={s.milestoneHint}>{m.hint}</span>
              </div>
            </BPSoftCard>
          );
        })}
      </div>
    </div>
  );
}
