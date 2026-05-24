'use client';

import { useEffect, useRef, useState } from 'react';
import { ComicCard } from '@/types/lesson';
import { TagBadge } from '@/components/ui/TagBadge';
import { CheckIcon } from '@/components/icons/CheckIcon';
import s from './StepComic.module.css';

interface Props {
  card: ComicCard;
  onReadyChange?: (ready: boolean) => void;
}

export function StepComic({ card, onReadyChange }: Props) {
  const [panelIdx, setPanelIdx] = useState(0);
  const reportedReady = useRef(false);

  useEffect(() => {
    if (!reportedReady.current && panelIdx === card.panels.length - 1) {
      reportedReady.current = true;
      onReadyChange?.(true);
    }
  }, [panelIdx, card.panels.length, onReadyChange]);

  const panel = card.panels[panelIdx]!;
  const isLast = panelIdx === card.panels.length - 1;

  return (
    <div>
      <div className={s.progressBar}>
        {card.panels.map((_, i) => (
          <div
            key={i}
            className={s.progressSegment}
            style={{ background: i <= panelIdx ? 'var(--color-accent)' : 'var(--color-border)' }}
          />
        ))}
      </div>

      <div className={s.panel}>
        <div className={s.panelTop}>
          <TagBadge label={panel.tag} color={panel.tagColor} />
          <span className={s.mood}>{panel.mood}</span>
        </div>

        <p className={s.scene}>{panel.scene}</p>

        <div className={s.panelContent}>
          {panel.caption ? <p className={s.caption}>{panel.caption}</p> : null}

          {panel.thought ? (
            <div className={s.thoughtBox}>
              <p className={s.thoughtText}>{panel.thought}</p>
            </div>
          ) : null}

          {panel.insight ? (
            <div className={s.insightBox}>
              <p className={s.insightText}>{panel.insight}</p>
            </div>
          ) : null}

          {panel.example ? (
            <div className={s.exampleBox}>
              <p className={s.exampleText}>{panel.example}</p>
            </div>
          ) : null}

          {panel.takeaway ? (
            <div className={s.takeawayBox}>
              {panel.takeaway.map((line, i) => (
                <p key={i} className={i === 0 ? s.takeawayFirst : s.takeawayLine}>
                  {line}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className={s.nav}>
        {panelIdx > 0 && (
          <button className={s.navBack} onClick={() => setPanelIdx((p) => p - 1)}>
            ←
          </button>
        )}
        {!isLast && (
          <button className={s.navNext} onClick={() => setPanelIdx((p) => p + 1)}>
            Следующая сцена
          </button>
        )}
        {isLast && (
          <div className={s.navDone}>
            <div className={s.navDoneRow}>
              <CheckIcon color="var(--color-success)" size={14} />
              <span className={s.navDoneText}>История завершена</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
