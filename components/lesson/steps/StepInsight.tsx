'use client';

import { useEffect } from 'react';
import { InsightCard } from '@/types/lesson';
import { NoteBlock } from '@/components/ui/NoteBlock';
import s from './StepInsight.module.css';

interface Props {
  card: InsightCard;
  onReadyChange?: (ready: boolean) => void;
}

export function StepInsight({ card, onReadyChange }: Props) {
  useEffect(() => {
    onReadyChange?.(true);
  }, [onReadyChange]);

  return (
    <div>
      <p className={s.label}>{card.emoji} Инсайт</p>
      <p className={s.title}>{card.title}</p>
      <p className={s.body}>{card.body}</p>
      {card.note ? <NoteBlock text={card.note} /> : null}
    </div>
  );
}
