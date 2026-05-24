'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StatsCard } from '@/types/lesson';
import { CheckIcon } from '@/components/icons/CheckIcon';
import s from './StepStats.module.css';

interface Props {
  card: StatsCard;
  onReadyChange?: (ready: boolean) => void;
}

export function StepStats({ card, onReadyChange }: Props) {
  const [idx, setIdx] = useState(0);
  const reportedReady = useRef(false);

  useEffect(() => {
    if (!reportedReady.current && idx === card.slides.length - 1) {
      reportedReady.current = true;
      onReadyChange?.(true);
    }
  }, [idx, card.slides.length, onReadyChange]);

  const slide = card.slides[idx]!;
  const isLast = idx === card.slides.length - 1;

  return (
    <div>
      <div className={s.dots}>
        {card.slides.map((sl, i) => (
          <button
            key={i}
            className={s.dot}
            onClick={() => setIdx(i)}
            style={{
              width: i === idx ? 20 : 8,
              background: i === idx ? slide.color : 'var(--color-border)',
            }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className={s.card}
          style={{
            background: slide.color + '0A',
            borderColor: slide.color + '22',
          }}
        >
          <span className={s.cardIcon}>{slide.icon}</span>
          <div className={s.numberRow}>
            <span className={s.statNumber} style={{ color: slide.color }}>
              {slide.stat}
            </span>
            {slide.unit ? (
              <span className={s.statUnit} style={{ color: slide.color }}>
                {slide.unit}
              </span>
            ) : null}
          </div>
          <p className={s.statText}>{slide.text}</p>
          <p className={s.statDetail}>{slide.detail}</p>
        </motion.div>
      </AnimatePresence>

      <div className={s.nav}>
        {idx > 0 && (
          <button className={s.navBack} onClick={() => setIdx((i) => i - 1)}>
            ←
          </button>
        )}
        {!isLast ? (
          <button className={s.navNext} onClick={() => setIdx((i) => i + 1)}>
            Далее
          </button>
        ) : (
          <div className={s.navDone}>
            <div className={s.navDoneRow}>
              <CheckIcon color="var(--color-success)" size={14} />
              <span className={s.navDoneText}>Запомни эти цифры</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
