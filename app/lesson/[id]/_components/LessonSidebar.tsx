'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { CheckIcon } from '@/components/icons/CheckIcon';
import { LockIcon } from '@/components/icons/LockIcon';
import { PlayIcon } from '@/components/icons/PlayIcon';
import { ApiLesson } from '@/types/api';
import s from './LessonSidebar.module.css';

interface LessonSidebarProps {
  lessons: ApiLesson[];
  currentLessonId: number;
  moduleTitle: string;
  loading: boolean;
}

export function LessonSidebar({ lessons, currentLessonId, moduleTitle, loading }: LessonSidebarProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className={s.sidebar}>
        <div className={s.spinner} />
      </div>
    );
  }

  const sorted = [...lessons].sort((a, b) => a.sortOrder - b.sortOrder);

  const handleClick = (lesson: ApiLesson) => {
    if (lesson.id === currentLessonId) return;
    if (lesson.isLocked) return;
    router.push(`/lesson/${lesson.id}`);
  };

  return (
    <div className={s.sidebar}>
      {moduleTitle && <p className={s.moduleTitle}>{moduleTitle}</p>}
      <div className={s.list}>
        {sorted.map((lesson, index) => {
          const isCurrent = lesson.id === currentLessonId;
          const isDone = lesson.progressStatus === 'Done';
          const isLocked = lesson.isLocked;
          const rowClass = [
            s.row,
            isCurrent ? s.rowCurrent : '',
            isLocked && !isCurrent ? s.rowLocked : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={lesson.id}
              type="button"
              className={rowClass}
              onClick={() => handleClick(lesson)}
              aria-current={isCurrent ? 'page' : undefined}
              disabled={isLocked && !isCurrent}
            >
              <span className={s.badge}>
                {isLocked ? (
                  <LockIcon size={12} color="var(--color-muted)" />
                ) : isDone ? (
                  <CheckIcon size={13} color="var(--color-accent)" />
                ) : (
                  <PlayIcon size={11} color={isCurrent ? 'var(--color-accent)' : 'var(--color-muted)'} />
                )}
              </span>
              <span className={s.texts}>
                <span className={s.label}>Урок {index + 1}</span>
                <span className={s.title}>{lesson.title}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
