'use client';

import { useEffect, useRef, useState } from 'react';
import { MindmapCard } from '@/types/lesson';
import s from './StepMindmap.module.css';

interface Props {
  card: MindmapCard;
  onReadyChange?: (ready: boolean) => void;
}

export function StepMindmap({ card, onReadyChange }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const seenRef = useRef<Set<string>>(new Set());
  const reportedReady = useRef(false);

  useEffect(() => {
    if (!activeId) return;
    seenRef.current.add(activeId);
    if (!reportedReady.current && seenRef.current.size >= card.branches.length) {
      reportedReady.current = true;
      onReadyChange?.(true);
    }
  }, [activeId, card.branches.length, onReadyChange]);

  const branch = card.branches.find((b) => b.id === activeId) ?? null;

  const toggle = (id: string) => setActiveId((prev) => (prev === id ? null : id));

  return (
    <div>
      <div className={s.centerWrap}>
        <div className={s.centerNode}>
          <span className={s.centerIcon}>{card.centerIcon}</span>
          <span className={s.centerLabel}>{card.centerLabel}</span>
        </div>
      </div>

      <div className={s.grid}>
        {card.branches.map((b) => {
          const isActive = activeId === b.id;
          return (
            <button
              key={b.id}
              onClick={() => toggle(b.id)}
              className={s.branchBtn}
              style={{
                background: isActive ? b.color + '18' : 'var(--color-bg-card2)',
                borderColor: isActive ? b.color + '55' : 'var(--color-border)',
              }}
            >
              <span className={s.branchIcon}>{b.icon}</span>
              <span
                className={s.branchLabel}
                style={{ color: isActive ? b.color : 'var(--color-text-primary)' }}
              >
                {b.label}
              </span>
              <span className={s.branchCount}>{b.items.length} навыка</span>
            </button>
          );
        })}
      </div>

      {branch ? (
        <div className={s.detail}>
          <div className={s.tagRow}>
            {branch.items.map((item, i) => (
              <span
                key={i}
                className={s.tag}
                style={{
                  background: branch.color + '12',
                  borderColor: branch.color + '22',
                  color: branch.color,
                }}
              >
                {item}
              </span>
            ))}
          </div>
          <div className={s.tipBox} style={{ borderLeftColor: branch.color }}>
            <p className={s.tipText}>{branch.tip}</p>
          </div>
        </div>
      ) : (
        <p className={s.hint}>Нажми на ветку, чтобы раскрыть</p>
      )}
    </div>
  );
}
