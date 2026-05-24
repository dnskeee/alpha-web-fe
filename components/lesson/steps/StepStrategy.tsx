'use client';

import { useEffect } from 'react';
import { StrategyCard } from '@/types/lesson';
import { HighlightBlock } from '@/components/ui/HighlightBlock';
import { NoteBlock } from '@/components/ui/NoteBlock';
import s from './StepStrategy.module.css';

interface Props {
  card: StrategyCard;
  onReadyChange?: (ready: boolean) => void;
}

export function StepStrategy({ card, onReadyChange }: Props) {
  useEffect(() => {
    onReadyChange?.(true);
  }, [onReadyChange]);

  const titleWithoutPrefix = card.title.replace(/^Стратегия:\s*/, '');

  return (
    <div>
      <div className={s.badge}>
        <span className={s.badgeEmoji}>{card.emoji}</span>
        <span className={s.badgeLabel}>Стратегия</span>
      </div>
      <p className={s.title}>{titleWithoutPrefix}</p>
      <p className={s.body}>{card.body}</p>
      {card.highlight ? <HighlightBlock text={card.highlight} variant="quote" /> : null}
      {card.note ? <NoteBlock text={card.note} variant="dim" /> : null}
    </div>
  );
}
