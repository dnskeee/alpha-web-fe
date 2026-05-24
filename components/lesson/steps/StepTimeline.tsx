'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TimelineCard } from '@/types/lesson';
import { DosDonts } from '@/components/ui/DosDonts';
import s from './StepTimeline.module.css';

interface Props {
  card: TimelineCard;
  onReadyChange?: (ready: boolean) => void;
}

export function StepTimeline({ card, onReadyChange }: Props) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const seenRef = useRef<Set<number>>(new Set());
  const reportedReady = useRef(false);

  useEffect(() => {
    if (expandedIdx === null) return;
    seenRef.current.add(expandedIdx);
    if (!reportedReady.current && seenRef.current.size >= card.steps.length) {
      reportedReady.current = true;
      onReadyChange?.(true);
    }
  }, [expandedIdx, card.steps.length, onReadyChange]);

  const toggle = (i: number) => setExpandedIdx((prev) => (prev === i ? null : i));

  return (
    <div className={s.container}>
      <div className={s.line} />

      {card.steps.map((step, i) => {
        const isOpen = expandedIdx === i;
        const isLast = i === card.steps.length - 1;

        return (
          <div key={i} className={isLast ? s.row : s.rowGap}>
            <div
              className={s.dot}
              style={{
                background: isOpen ? 'var(--color-accent)' : 'var(--color-bg-dark)',
                borderColor: isOpen ? 'var(--color-accent)' : 'var(--color-text-dim)',
              }}
            />

            <button
              onClick={() => toggle(i)}
              className={isOpen ? `${s.stepBtn} ${s.stepBtnActive}` : s.stepBtn}
            >
              <div className={s.stepHeader}>
                <span className={s.stepIcon}>{step.icon}</span>
                <div className={s.stepMeta}>
                  <span className={s.stepTime}>{step.time}</span>
                  <span className={s.stepLabel}>{step.label}</span>
                </div>
                <span className={isOpen ? `${s.chevron} ${s.chevronOpen}` : s.chevron}>→</span>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className={s.stepBody}
                  >
                    <p className={s.stepText}>{step.text}</p>
                    <DosDonts doText={step.do} dontText={step.dont} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        );
      })}
    </div>
  );
}
