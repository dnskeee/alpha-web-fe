'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { BPLessonNode } from '@/components/bp/BPLessonNode';
import { BPPillButton } from '@/components/bp/BPPillButton';
import { BPProgressBar } from '@/components/bp/BPProgressBar';
import { BPStatBox } from '@/components/bp/BPStatBox';
import { LockIcon } from '@/components/icons/LockIcon';
import { ApiModuleDetail } from '@/types/api';
import { lessonWord } from '@/lib/utils/plural';

import { BuyModuleInlineCard } from './BuyModuleInlineCard';
import s from './LessonsTab.module.css';

type LessonRow = ApiModuleDetail['lessons'][number];

interface LessonsTabProps {
  module: ApiModuleDetail;
  sorted: LessonRow[];
  lastDoneIdx: number;
  pct: number;
  onRequestBuy: () => void;
}

export function LessonsTab({
  module,
  sorted,
  lastDoneIdx,
  pct,
  onRequestBuy,
}: LessonsTabProps) {
  const remaining = Math.max(0, module.totalLessons - module.completedLessons);
  const remainingLabel = lessonWord(remaining);

  let splitIdx = sorted.length;
  if (!module.isOwned) {
    const lastUnlockedIdx = sorted.reduce(
      (acc, l, idx) => (l.isLocked ? acc : idx),
      -1,
    );
    splitIdx = lastUnlockedIdx + 1;
  }

  return (
    <div>
      <div className={s.statsRow}>
        <div className={s.statCell}>
          <BPStatBox
            label="Пройдено"
            value={String(module.completedLessons)}
            suffix={` / ${module.totalLessons}`}
          />
        </div>
        <div className={s.statCell}>
          <BPStatBox label="Прогресс" value={`${pct}%`} highlight />
        </div>
      </div>

      <div className={s.lessonMap}>
        {sorted.map((l, i) => (
          <React.Fragment key={l.id}>
            <LessonRowItem
              lesson={l}
              index={i}
              isLast={i === sorted.length - 1}
              lastDoneIdx={lastDoneIdx}
            />
            {!module.isOwned && i === splitIdx - 1 && (
              <BuyModuleInlineCard
                onPress={onRequestBuy}
                connector={splitIdx < sorted.length}
              />
            )}
          </React.Fragment>
        ))}

        {!module.isOwned && splitIdx === 0 && (
          <BuyModuleInlineCard
            onPress={onRequestBuy}
            connector={sorted.length > 0}
          />
        )}

        {module.isOwned && (
          <div className={s.completionCard}>
            <span className={s.completionLabel}>До завершения модуля</span>
            <span className={s.completionValue}>
              {remaining === 0 ? 'Тема завершена' : `${remaining} ${remainingLabel}`}
            </span>
            <BPProgressBar progress={pct} height={6} radius={3} className={s.completionBar} />
          </div>
        )}
      </div>
    </div>
  );
}

interface LessonRowItemProps {
  lesson: LessonRow;
  index: number;
  isLast: boolean;
  lastDoneIdx: number;
}

function LessonRowItem({ lesson, index, isLast, lastDoneIdx }: LessonRowItemProps) {
  const router = useRouter();
  const isDone = lesson.progressStatus === 'Done';
  const isActive = lesson.progressStatus === 'Active' || index === lastDoneIdx + 1;
  const isLocked = lesson.isLocked;
  const state: 'done' | 'active' | 'pending' = isDone
    ? 'done'
    : isActive && !isLocked
    ? 'active'
    : 'pending';

  const handlePress = () => {
    if (isLocked) {
      alert('Урок заблокирован. Купите тему, чтобы открыть.');
      return;
    }
    router.push(`/lesson/${lesson.id}`);
  };

  const cardClass = [
    s.lessonCard,
    state === 'active' ? s.lessonCardActive : s.lessonCardSoft,
    isLocked ? s.lessonCardLocked : state === 'pending' ? s.lessonCardPending : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={s.lessonRow}>
      <BPLessonNode number={index + 1} state={state} connector={!isLast} />
      <button
        type="button"
        disabled={state === 'pending' && !isLocked}
        onClick={handlePress}
        className={cardClass}
      >
        <div className={s.lessonMeta}>
          <span className={s.lessonLabel}>Урок {index + 1}</span>
          {isLocked && <LockIcon size={11} color="var(--color-muted)" />}
        </div>
        <p
          className={s.lessonTitle}
          style={{ marginBottom: state === 'active' ? 10 : 0 }}
        >
          {lesson.title}
        </p>
        {state === 'active' && (
          <BPPillButton
            label="Начать →"
            variant="accent"
            onClick={() => router.push(`/lesson/${lesson.id}`)}
          />
        )}
        {state === 'done' && (
          <span className={s.doneLabel}>Пройдено ✓</span>
        )}
      </button>
    </div>
  );
}
