import React from 'react';
import clsx from 'clsx';

import { BPCard } from './BPCard';
import { SunIcon } from '@/components/icons/SunIcon';
import s from './BPThoughtCard.module.css';

const MOCK_THOUGHT = {
  text: 'Уверенность — это не отсутствие страха. Это решение действовать, несмотря на него.',
  source: 'Уверенность в себе',
};

interface Props {
  className?: string;
}

export function BPThoughtCard({ className }: Props) {
  return (
    <BPCard className={clsx(s.wrapper, className)}>
      <div className={s.header}>
        <div className={s.iconWrap}>
          <SunIcon size={14} color="var(--color-accent)" />
        </div>
        <span className={s.label}>Мысль дня</span>
      </div>
      <p className={s.text}>{MOCK_THOUGHT.text}</p>
      <span className={s.source}>Из курса · {MOCK_THOUGHT.source}</span>
    </BPCard>
  );
}
