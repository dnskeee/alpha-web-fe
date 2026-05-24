'use client';

import { useEffect, useState } from 'react';
import { StoryModeCard, StoryScene } from '@/types/lesson';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { CrossIcon } from '@/components/icons/CrossIcon';
import { TipGlyph, WarningGlyph } from '@/components/lesson/icons/LessonGlyphs';
import s from './TestStory.module.css';

interface Props {
  card: StoryModeCard;
  onReadyChange?: (ready: boolean) => void;
}

export function TestStory({ card, onReadyChange }: Props) {
  const [scene, setScene] = useState(card.startScene);
  const [history, setHistory] = useState<string[]>([]);

  const data: StoryScene = card.scenes[scene]!;

  useEffect(() => {
    if (data.isEnd) onReadyChange?.(true);
  }, [data.isEnd, onReadyChange]);

  const choose = (next: string) => {
    setHistory((h) => [...h, scene]);
    setScene(next);
  };

  const restart = () => {
    setScene(card.startScene);
    setHistory([]);
  };

  const pathLength = history.length + 1;

  const leftBorderColor = data.isGoodPath
    ? 'var(--color-success)'
    : data.isEnd
      ? data.endType === 'good'
        ? 'var(--color-success)'
        : data.endType === 'mid'
          ? 'var(--color-warning)'
          : 'var(--color-red)'
      : 'var(--color-text-dim)';

  const endColor =
    data.endType === 'good'
      ? 'var(--color-success)'
      : data.endType === 'mid'
        ? 'var(--color-warning)'
        : 'var(--color-red)';

  const endBg =
    data.endType === 'good'
      ? 'var(--color-success-dim)'
      : data.endType === 'mid'
        ? 'var(--color-warning-dim)'
        : 'var(--color-red-dim)';

  return (
    <div>
      <div className={s.pathRow}>
        {Array.from({ length: pathLength }).map((_, i) => (
          <div
            key={i}
            className={`${s.pathDot} ${i === history.length ? s.pathDotActive : ''}`}
          />
        ))}
      </div>

      <div className={s.sceneBox} style={{ borderLeftColor: leftBorderColor }}>
        <p className={s.sceneText}>{data.text}</p>
      </div>

      {data.isEnd && (
        <div>
          <div className={s.endBadge} style={{ background: endBg }}>
            <div className={s.endBadgeRow}>
              {data.endType === 'good' ? (
                <CheckIcon color={endColor} size={14} />
              ) : data.endType === 'mid' ? (
                <WarningGlyph color={endColor} size={14} />
              ) : (
                <CrossIcon color={endColor} size={14} />
              )}
              <span className={s.endBadgeText} style={{ color: endColor }}>
                {data.endType === 'good'
                  ? 'Лучший исход'
                  : data.endType === 'mid'
                    ? 'Можно лучше'
                    : 'Провал'}
              </span>
            </div>
          </div>
          {data.lesson && (
            <div className={s.lessonBox}>
              <div className={s.lessonRow}>
                <TipGlyph color="var(--color-zap)" size={12} />
                <p className={s.lessonText}>{data.lesson}</p>
              </div>
            </div>
          )}
          <button className={s.restartBtn} onClick={restart}>
            Пройти заново
          </button>
        </div>
      )}

      {!data.isEnd && data.choices && (
        <div className={s.choices}>
          {data.choices.map((ch, i) => (
            <button key={i} className={s.choiceBtn} onClick={() => choose(ch.next)}>
              <span className={s.choiceLetter}>{String.fromCharCode(65 + i)}</span>
              <span className={s.choiceText}>{ch.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
