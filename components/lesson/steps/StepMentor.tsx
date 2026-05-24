'use client';

import { useEffect } from 'react';
import { MentorCard } from '@/types/lesson';
import s from './StepMentor.module.css';

interface Props {
  card: MentorCard;
  onReadyChange?: (ready: boolean) => void;
}

export function StepMentor({ card, onReadyChange }: Props) {
  useEffect(() => {
    onReadyChange?.(true);
  }, [onReadyChange]);

  return (
    <div>
      <div className={s.authorRow}>
        <div className={s.avatar}>
          <span className={s.avatarEmoji}>{card.emoji}</span>
        </div>
        <div>
          <p className={s.authorName}>Автор</p>
          <p className={s.authorSub}>Из личного опыта</p>
        </div>
      </div>
      <div className={s.quoteBox}>
        <p className={s.quoteText}>{card.body}</p>
      </div>
      {card.note ? <p className={s.note}>{card.note}</p> : null}
    </div>
  );
}
