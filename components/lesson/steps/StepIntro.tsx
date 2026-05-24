'use client';

import { useEffect } from 'react';
import { IntroCard } from '@/types/lesson';
import { HighlightBlock } from '@/components/ui/HighlightBlock';
import { NoteBlock } from '@/components/ui/NoteBlock';
import s from './StepIntro.module.css';

interface Props {
  card: IntroCard;
  onReadyChange?: (ready: boolean) => void;
}

export function StepIntro({ card, onReadyChange }: Props) {
  useEffect(() => {
    onReadyChange?.(true);
  }, [onReadyChange]);

  return (
    <div>
      <p className={s.emoji}>{card.emoji}</p>
      <p className={s.title}>{card.title}</p>
      <p className={s.body}>{card.body}</p>
      {card.highlight ? <HighlightBlock text={card.highlight} variant="accent" /> : null}
      {card.note ? <NoteBlock text={card.note} /> : null}
    </div>
  );
}
