'use client';

import { useEffect, useRef, useState } from 'react';
import { VoicesCard } from '@/types/lesson';
import { FearGlyph, StrengthGlyph } from '@/components/lesson/icons/LessonGlyphs';
import s from './StepVoices.module.css';

interface Props {
  card: VoicesCard;
  onReadyChange?: (ready: boolean) => void;
}

export function StepVoices({ card, onReadyChange }: Props) {
  const [current, setCurrent] = useState(0);
  const [showConfidence, setShowConfidence] = useState(false);
  const reportedReady = useRef(false);

  const isLast = current === card.pairs.length - 1;

  useEffect(() => {
    if (!reportedReady.current && isLast && showConfidence) {
      reportedReady.current = true;
      onReadyChange?.(true);
    }
  }, [isLast, showConfidence, onReadyChange]);

  const pair = card.pairs[current]!;

  const handleNext = () => {
    setShowConfidence(false);
    setCurrent((c) => c + 1);
  };

  return (
    <div>
      <div className={s.progressBar}>
        {card.pairs.map((_, i) => (
          <div
            key={i}
            className={s.progressSegment}
            style={{ background: i <= current ? 'var(--color-accent)' : 'var(--color-border)' }}
          />
        ))}
      </div>

      <div className={s.fearCard}>
        <div className={s.voiceHeader}>
          <div className={`${s.voiceAvatar} ${s.fearAvatar}`}>
            <FearGlyph color="var(--color-red)" size={20} />
          </div>
          <div>
            <span className={s.voiceName} style={{ color: 'var(--color-red)' }}>
              Тревожная мысль
            </span>
            <span className={s.voiceSub}>то, что говорит тебе неуверенность</span>
          </div>
        </div>
        <p className={s.voiceText}>«{pair.fear}»</p>
      </div>

      {!showConfidence ? (
        <button className={s.revealBtn} onClick={() => setShowConfidence(true)}>
          <StrengthGlyph color="var(--color-success)" size={18} />
          <span className={s.revealBtnLabel} style={{ color: 'var(--color-success)' }}>
            Что поможет сейчас
          </span>
        </button>
      ) : (
        <div className={s.confidenceCard}>
          <div className={s.voiceHeader}>
            <div className={`${s.voiceAvatar} ${s.confidenceAvatar}`}>
              <StrengthGlyph color="var(--color-success)" size={20} />
            </div>
            <div>
              <span className={s.voiceName} style={{ color: 'var(--color-success)' }}>
                Что поможет сейчас
              </span>
              <span className={s.voiceSub}>так звучит мужчина, который действует</span>
            </div>
          </div>
          <p className={`${s.voiceText} ${s.confidenceText}`}>«{pair.confidence}»</p>
        </div>
      )}

      {showConfidence && !isLast && (
        <button className={s.nextBtn} onClick={handleNext}>
          Следующая мысль
        </button>
      )}

      {showConfidence && isLast && (
        <div className={s.conclusionBox}>
          <p className={s.conclusionText}>{card.conclusion}</p>
        </div>
      )}
    </div>
  );
}
