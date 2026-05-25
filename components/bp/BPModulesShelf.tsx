'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { BPCard } from './BPCard';
import { ApiModule } from '@/types/api';
import { lessonWord } from '@/lib/utils/plural';
import s from './BPModulesShelf.module.css';

const COURSE_COLORS = [
  'var(--color-icon-a)',
  'var(--color-icon-b)',
  'var(--color-icon-c)',
  'var(--color-icon-d)',
  'var(--color-icon-e)',
];

interface Props {
  modules: ApiModule[];
  title?: string;
}

export function BPModulesShelf({ modules, title = 'Темы' }: Props) {
  if (modules.length === 0) return null;

  return (
    <div>
      <div className={s.header}>
        <span className={s.title}>{title}</span>
        <Link href="/modules" className={s.allLink}>Все →</Link>
      </div>
      <div className={s.scroll}>
        {modules.map((mod, i) => {
          const fallbackColor = COURSE_COLORS[i % COURSE_COLORS.length] ?? 'var(--color-icon-a)';
          return (
            <Link key={mod.id} href={`/module/${mod.id}`} className={s.cardLink}>
              <BPCard padding={0} radius={20} flat className={s.card}>
                <div className={s.cover} style={{ backgroundColor: fallbackColor }}>
                  {mod.imageUrl && (
                    <Image src={mod.imageUrl} alt={mod.title} fill style={{ objectFit: 'cover' }} />
                  )}
                </div>
                <div className={s.info}>
                  <span className={s.lessons}>
                    {mod.totalLessons} {lessonWord(mod.totalLessons)}
                  </span>
                  <p className={s.modTitle}>{mod.title}</p>
                </div>
              </BPCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
