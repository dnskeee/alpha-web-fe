'use client';

import React, { useEffect, useReducer } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { BPBundlesCTA } from '@/components/bp/BPBundlesCTA';
import { BPCard } from '@/components/bp/BPCard';
import { BPProgressBar } from '@/components/bp/BPProgressBar';
import { BPSectionTitle } from '@/components/bp/BPSectionTitle';
import { BPTopBar } from '@/components/bp/BPTopBar';
import { TagBadge, TagBadgeVariant } from '@/components/ui/TagBadge';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { ApiCourse } from '@/types/api';
import { lessonWord } from '@/lib/utils/plural';
import s from './page.module.css';

const COURSE_ID = 1;

const COURSE_COLORS = [
  'var(--color-icon-a)',
  'var(--color-icon-b)',
  'var(--color-icon-c)',
  'var(--color-icon-d)',
  'var(--color-icon-e)',
];

interface ModulesState {
  course: ApiCourse | null;
  loading: boolean;
  error: string | null;
}

type ModulesAction =
  | { type: 'loaded'; course: ApiCourse | null }
  | { type: 'error'; message: string }
  | { type: 'retry' };

function reducer(state: ModulesState, action: ModulesAction): ModulesState {
  switch (action.type) {
    case 'loaded':
      return { course: action.course, loading: false, error: null };
    case 'error':
      return { ...state, loading: false, error: action.message };
    case 'retry':
      return { ...state, loading: true, error: null };
  }
}

const initial: ModulesState = { course: null, loading: true, error: null };

export default function ModulesScreen() {
  const { callMaybeAuthed } = useAuth();
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    let cancelled = false;

    callMaybeAuthed(() => api.courses.getList())
      .then((data) => {
        if (cancelled) return;
        const found = data.courses.find((c) => c.id === COURSE_ID) ?? data.courses[0] ?? null;
        dispatch({ type: 'loaded', course: found });
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : 'Ошибка загрузки';
        dispatch({ type: 'error', message: msg });
      });

    return () => { cancelled = true; };
  }, [callMaybeAuthed]);

  function handleRetry() {
    dispatch({ type: 'retry' });
  }

  const { course, loading, error } = state;

  if (loading) {
    return (
      <div className={s.safe}>
        <div className={s.center}>
          <div className={s.spinner} />
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className={s.safe}>
        <div className={s.center}>
          <p className={s.errorText}>{error || 'Курс не найден'}</p>
          <button type="button" onClick={handleRetry} className={s.retryBtn}>
            Повторить
          </button>
        </div>
      </div>
    );
  }

  const sorted = course.modules;

  return (
    <div className={s.safe}>
      <div className={s.scroll}>
        <BPTopBar showLogo />

        <div className={s.header}>
          <BPSectionTitle title="Обучение" display="Все темы" />
        </div>

        <BPBundlesCTA className={s.bundlesCta} />

        <div className={s.moduleList}>
          {sorted.map((m, i) => {
            const color = COURSE_COLORS[i % COURSE_COLORS.length] ?? COURSE_COLORS[0];
            const pct =
              m.totalLessons > 0
                ? Math.round((m.completedLessons / m.totalLessons) * 100)
                : 0;
            const hasProgress = m.completedLessons > 0;
            const isOwned = m.isOwned;
            const isEmpty = !isOwned && !hasProgress;
            const isDone = m.completedLessons === m.totalLessons && m.totalLessons > 0;
            const isInProgress = hasProgress && !isDone;

            const badgeVariant: TagBadgeVariant = isInProgress
              ? 'progress'
              : isDone
              ? 'success'
              : 'badge';
            const badgeLabel = isInProgress
              ? 'В процессе'
              : isDone
              ? 'Пройден'
              : 'Не начат';
            const showProgressBar = !isEmpty;
            const descriptionLines = isEmpty ? 3 : 2;
            const lessonsText = isEmpty
              ? `${m.totalLessons} ${lessonWord(m.totalLessons)}`
              : `${m.completedLessons} / ${m.totalLessons} ${lessonWord(m.totalLessons)}`;

            return (
              <div
                key={m.id}
                className={s.moduleItem}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/module/${m.id}`)}
                onKeyDown={(e) => e.key === 'Enter' && router.push(`/module/${m.id}`)}
              >
                <BPCard padding={0} radius={22} style={{ overflow: 'hidden' }}>
                  {isOwned && <div className={s.ownedStripe} />}

                  <div className={s.cover} style={{ backgroundColor: color }}>
                    {m.imageUrl && (
                      <Image
                        src={m.imageUrl}
                        alt=""
                        fill
                        className={s.coverImage}
                      />
                    )}
                    <span className={s.coverNumber}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className={s.body}>
                    <div className={s.badgeRow}>
                      <TagBadge variant={badgeVariant} label={badgeLabel} />
                      <span className={s.lessonsText}>{lessonsText}</span>
                      {isOwned && (
                        <span className={s.ownedBadge}>
                          <TagBadge variant="success" label="ПРИОБРЕТЕНО" />
                        </span>
                      )}
                    </div>
                    <p className={s.moduleTitle}>{m.title}</p>
                    {m.description && (
                      <p
                        className={s.moduleDesc}
                        style={{
                          WebkitLineClamp: descriptionLines,
                          marginBottom: showProgressBar ? 12 : 0,
                        }}
                      >
                        {m.description}
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
                </BPCard>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
