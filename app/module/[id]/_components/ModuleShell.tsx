'use client';

import type { ReactNode } from 'react';
import s from './ModuleShell.module.css';

type Tab = 'about' | 'lessons';

interface Props {
  tab: Tab;
  onTabChange: (t: Tab) => void;
  children: ReactNode;
}

export function ModuleShell({ tab, onTabChange, children }: Props) {
  return (
    <div className={s.wrap}>
      <aside className={s.sidebar}>
        <button
          type="button"
          onClick={() => onTabChange('about')}
          className={tab === 'about' ? s.linkActive : s.link}
        >
          <span>О теме</span>
        </button>
        <button
          type="button"
          onClick={() => onTabChange('lessons')}
          className={tab === 'lessons' ? s.linkActive : s.link}
        >
          <span>Уроки</span>
        </button>
      </aside>
      <div className={s.main}>{children}</div>
    </div>
  );
}
