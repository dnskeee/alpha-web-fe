'use client';

import React, { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { BPSoftCard } from '@/components/bp/BPSoftCard';
import { BPTopBar } from '@/components/bp/BPTopBar';
import { ForwardIcon } from '@/components/icons/ForwardIcon';
import { ApiModule } from '@/types/api';
import { lessonWord, themeWord } from '@/lib/utils/plural';
import s from './page.module.css';

const COURSE_COLORS = [
  'var(--color-icon-a)',
  'var(--color-icon-b)',
  'var(--color-icon-c)',
  'var(--color-icon-d)',
  'var(--color-icon-e)',
];

export default function CourseScreen() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const title = searchParams.get('title') ?? '';
  const modulesJson = searchParams.get('modules') ?? '';

  const modules = useMemo<ApiModule[]>(() => {
    if (!modulesJson) return [];
    try {
      return JSON.parse(modulesJson) as ApiModule[];
    } catch {
      return [];
    }
  }, [modulesJson]);

  const sorted = [...modules].sort((a, b) => a.sortOrder - b.sortOrder);
  const moduleWord = themeWord(sorted.length);

  return (
    <div className={s.safe}>
      <BPTopBar onBack={() => router.back()} />

      <div className={s.scroll}>
        <h1 className={s.title}>{title}</h1>
        <p className={s.subtitle}>
          {sorted.length} {moduleWord}
        </p>

        <div className={s.list}>
          {sorted.map((mod, i) => {
            const color = COURSE_COLORS[i % COURSE_COLORS.length];
            return (
              <button
                key={mod.id}
                type="button"
                className={s.moduleBtn}
                onClick={() => router.push(`/module/${mod.id}`)}
              >
                <BPSoftCard className={s.moduleCard}>
                  <div className={s.colorDot} style={{ backgroundColor: color }} />
                  <div className={s.moduleInfo}>
                    <span className={s.moduleTitle}>{mod.title}</span>
                    <span className={s.moduleMeta}>
                      {mod.totalLessons} {lessonWord(mod.totalLessons)}
                    </span>
                  </div>
                  <ForwardIcon size={16} color="var(--color-muted)" />
                </BPSoftCard>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
