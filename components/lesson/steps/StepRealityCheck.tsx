'use client';

import { useEffect, useRef, useState } from 'react';
import { RealityCheckCard } from '@/types/lesson';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { StatsGlyph } from '@/components/lesson/icons/LessonGlyphs';
import s from './StepRealityCheck.module.css';

interface Props {
  card: RealityCheckCard;
  onReadyChange?: (ready: boolean) => void;
}

export function StepRealityCheck({ card, onReadyChange }: Props) {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const reportedReady = useRef(false);

  const item = card.items[idx]!;
  const isLast = idx === card.items.length - 1;

  useEffect(() => {
    if (!reportedReady.current && isLast && revealed) {
      reportedReady.current = true;
      onReadyChange?.(true);
    }
  }, [isLast, revealed, onReadyChange]);

  const handleReveal = () => setRevealed(true);

  const handleNext = () => {
    setRevealed(false);
    setIdx((i) => i + 1);
  };

  return (
    <div>
      <div className={s.dots}>
        {card.items.map((_, i) => (
          <div
            key={i}
            className={s.dot}
            style={{
              width: i === idx ? 20 : 8,
              background:
                i < idx
                  ? 'var(--color-success)'
                  : i === idx
                    ? 'var(--color-accent)'
                    : 'var(--color-border)',
            }}
          />
        ))}
      </div>

      <div className={s.splitCard}>
        <div className={s.fearHalf}>
          <span className={s.halfLabelText} style={{ color: 'var(--color-red)' }}>
            В ТВОЕЙ ГОЛОВЕ
          </span>
          <span className={s.fearEmoji}>{item.fearEmoji}</span>
          <p className={s.fearText}>{item.fear}</p>
        </div>

        <div className={s.divider}>
          <div className={s.dividerLine} style={{ background: 'color-mix(in srgb, var(--color-red) 30%, transparent)' }} />
          <div className={s.vsBadge}>
            <span className={s.vsText}>VS</span>
          </div>
          <div className={s.dividerLine} style={{ background: 'color-mix(in srgb, var(--color-success) 30%, transparent)' }} />
        </div>

        {!revealed ? (
          <button className={s.realityHidden} onClick={handleReveal}>
            <EyeIcon color="var(--color-success)" size={24} />
            <span className={s.revealPrompt} style={{ color: 'var(--color-success)' }}>
              Что реально
            </span>
            <span className={s.revealHint}>нажми, чтобы узнать</span>
          </button>
        ) : (
          <div className={s.realityHalf}>
            <span className={s.halfLabelText} style={{ color: 'var(--color-success)' }}>
              НА САМОМ ДЕЛЕ
            </span>
            <span className={s.realityEmoji}>{item.realityEmoji}</span>
            <p className={s.realityText}>{item.reality}</p>
            {item.stat ? (
              <div className={s.statBadge}>
                <StatsGlyph color="var(--color-text-dim)" size={12} />
                <span className={s.statText}>{item.stat}</span>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {revealed &&
        (isLast ? (
          <div className={s.doneBox}>
            <div className={s.doneRow}>
              <CheckIcon color="var(--color-success)" size={14} />
              <span className={s.doneText}>Страх преувеличивает. Реальность — мягче.</span>
            </div>
          </div>
        ) : (
          <button className={s.nextBtn} onClick={handleNext}>
            Следующий страх →
          </button>
        ))}
    </div>
  );
}
