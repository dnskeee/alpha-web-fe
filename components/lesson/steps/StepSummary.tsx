'use client';

import { useEffect } from 'react';
import { SummaryCard } from '@/types/lesson';
import { BulletItem } from '@/components/ui/BulletItem';
import s from './StepSummary.module.css';

interface Props {
  card: SummaryCard;
  onReadyChange?: (ready: boolean) => void;
}

export function StepSummary({ card, onReadyChange }: Props) {
  useEffect(() => {
    onReadyChange?.(true);
  }, [onReadyChange]);

  return (
    <div>
      <p className={s.label}>{card.emoji} Итоги</p>
      <p className={s.title}>{card.title}</p>
      <div className={s.list}>
        {card.bullets.map((bullet, i) => (
          <BulletItem key={i} index={i} text={bullet} />
        ))}
      </div>
    </div>
  );
}
