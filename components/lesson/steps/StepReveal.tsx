'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RevealCard } from '@/types/lesson';
import s from './StepReveal.module.css';

interface Props {
  card: RevealCard;
  onReadyChange?: (ready: boolean) => void;
}

export function StepReveal({ card, onReadyChange }: Props) {
  const [revealed, setRevealed] = useState(1);
  const total = card.layers.length;
  const reportedReady = useRef(false);

  useEffect(() => {
    if (!reportedReady.current && revealed >= total) {
      reportedReady.current = true;
      onReadyChange?.(true);
    }
  }, [revealed, total, onReadyChange]);

  const revealNext = () => setRevealed((r) => Math.min(r + 1, total));
  const reset = () => setRevealed(1);

  return (
    <div>
      <div className={s.layers}>
        {card.layers.map((layer, i) => {
          if (i > revealed) return null;

          const isNext = i === revealed;

          if (isNext) {
            return (
              <button
                key={i}
                className={s.nextBtn}
                style={{
                  background: layer.color + '08',
                  borderColor: layer.color + '44',
                }}
                onClick={revealNext}
              >
                <span className={s.nextIcon}>{layer.icon}</span>
                <span className={s.nextLabel} style={{ color: layer.color }}>
                  Раскрыть: {layer.title}
                </span>
                <span className={s.nextHint}>нажми, чтобы продолжить</span>
              </button>
            );
          }

          return (
            <AnimatePresence key={i}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={s.layer}
                style={{ borderLeftColor: layer.color }}
              >
                <div className={s.layerHeader}>
                  <span className={s.layerIcon}>{layer.icon}</span>
                  <span className={s.layerTitle} style={{ color: layer.color }}>
                    {layer.title}
                  </span>
                </div>
                <p className={s.layerContent}>{layer.content}</p>
              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>

      {revealed >= total && (
        <button className={s.collapseBtn} onClick={reset}>
          Свернуть
        </button>
      )}
    </div>
  );
}
