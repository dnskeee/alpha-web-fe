'use client';

import { PropsWithChildren, useState } from 'react';
import clsx from 'clsx';
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon';
import s from './collapsible.module.css';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        className={s.heading}
        onClick={() => setIsOpen((v) => !v)}
      >
        <div className={clsx(s.chevron, isOpen && s.chevronOpen)}>
          <ChevronDownIcon size={18} color="var(--color-muted)" />
        </div>
        <span className={s.title}>{title}</span>
      </button>
      {isOpen && <div className={s.content}>{children}</div>}
    </div>
  );
}
