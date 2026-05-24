'use client';

import { useEffect, useRef, useState } from 'react';
import { ChallengeCard } from '@/types/lesson';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { StarIcon } from '@/components/icons/StarIcon';
import { TipGlyph } from '@/components/lesson/icons/LessonGlyphs';
import s from './StepChallenge.module.css';

interface Props {
  card: ChallengeCard;
  xpReward: number;
  onReadyChange?: (ready: boolean) => void;
}

export function StepChallenge({ card, xpReward, onReadyChange }: Props) {
  const [accepted, setAccepted] = useState(false);
  const reportedReady = useRef(false);

  useEffect(() => {
    if (accepted && !reportedReady.current) {
      reportedReady.current = true;
      onReadyChange?.(true);
    }
  }, [accepted, onReadyChange]);

  return (
    <div>
      <div className={s.badge}>
        <span className={s.badgeEmoji}>{card.emoji}</span>
        <span className={s.badgeLabel}>Практика · {card.challengeLevel}</span>
      </div>
      <p className={s.title}>{card.title}</p>
      <div className={s.taskBox}>
        <p className={s.taskText}>{card.challengeText}</p>
      </div>
      <div className={s.tipBox}>
        <div className={s.tipRow}>
          <TipGlyph color="var(--color-zap)" size={14} />
          <span className={s.tipText}>
            <strong className={s.tipBold}>Подсказка:</strong> {card.challengeTip}
          </span>
        </div>
      </div>
      <div className={s.bonusBox}>
        <div className={s.bonusRow}>
          <StarIcon color="var(--color-accent)" size={14} />
          <span className={s.bonusText}>{card.challengeBonus}</span>
        </div>
      </div>

      {!accepted ? (
        <button className={s.acceptButton} onClick={() => setAccepted(true)}>
          Принять задание
        </button>
      ) : (
        <div className={s.acceptedBox}>
          <div className={s.acceptedRow}>
            <CheckIcon color="var(--color-success)" size={14} />
            <span className={s.acceptedText}>Задание принято · +{xpReward} XP</span>
          </div>
        </div>
      )}
    </div>
  );
}
