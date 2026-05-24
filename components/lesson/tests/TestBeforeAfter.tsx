'use client';

import { useEffect, useState } from 'react';
import { BeforeAfterCard } from '@/types/lesson';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { CrossIcon } from '@/components/icons/CrossIcon';
import { TipGlyph } from '@/components/lesson/icons/LessonGlyphs';
import s from './TestBeforeAfter.module.css';

interface Props {
  card: BeforeAfterCard;
  onReadyChange?: (ready: boolean) => void;
}

export function TestBeforeAfter({ card, onReadyChange }: Props) {
  const [current, setCurrent] = useState(0);
  const [showGood, setShowGood] = useState(false);

  const item = card.items[current]!;
  const isLast = current === card.items.length - 1;

  useEffect(() => {
    if (isLast && showGood) onReadyChange?.(true);
  }, [isLast, showGood, onReadyChange]);

  const next = () => {
    setShowGood(false);
    setCurrent((c) => c + 1);
  };

  return (
    <div>
      <div className={s.progressRow}>
        {card.items.map((_, i) => (
          <div
            key={i}
            className={`${s.progressDot} ${i === current ? s.progressDotActive : ''}`}
          />
        ))}
      </div>

      <p className={s.categoryLabel}>{item.category}</p>

      <div className={s.badCard}>
        <div className={s.labelRow}>
          <CrossIcon color="var(--color-red)" size={12} />
          <span className={s.badLabel}>Так делают многие</span>
        </div>
        <div className={s.messageRow}>
          <span className={s.messageEmoji}>{item.bad.emoji}</span>
          <div className={s.badBubble}>
            <p className={s.badBubbleText}>{item.bad.text}</p>
          </div>
        </div>
      </div>

      {!showGood ? (
        <button className={s.revealBtn} onClick={() => setShowGood(true)}>
          Показать, как лучше →
        </button>
      ) : (
        <div className={s.goodCard}>
          <div className={s.labelRow}>
            <CheckIcon color="var(--color-success)" size={12} />
            <span className={s.goodLabel}>Уверенный подход</span>
          </div>
          <div className={s.messageRow}>
            <span className={s.messageEmoji}>{item.good.emoji}</span>
            <div className={s.goodBubble}>
              <p className={s.goodBubbleText}>{item.good.text}</p>
            </div>
          </div>
        </div>
      )}

      {showGood && (
        <div className={s.lessonBox}>
          <div className={s.lessonRow}>
            <TipGlyph color="var(--color-zap)" size={12} />
            <p className={s.lessonText}>{item.lesson}</p>
          </div>
        </div>
      )}

      {showGood && current < card.items.length - 1 && (
        <button className={s.nextBtn} onClick={next}>
          Следующий пример
        </button>
      )}

      {showGood && current === card.items.length - 1 && (
        <div className={s.doneRow}>
          <CheckIcon color="var(--color-success)" size={12} />
          <span className={s.doneText}>Все примеры просмотрены</span>
        </div>
      )}
    </div>
  );
}
