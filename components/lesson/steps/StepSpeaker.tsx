'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { SpeakerCard } from '@/types/lesson';
import { SpeakerSpriteAvatar } from '@/components/bp/SpeakerSpriteAvatar';
import { CheckIcon } from '@/components/icons/CheckIcon';
import s from './StepSpeaker.module.css';

const TYPING_SPEED = 28;

interface Props {
  card: SpeakerCard;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onReadyChange?: (ready: boolean) => void;
}

export function StepSpeaker({ card, onReadyChange }: Props) {
  // phraseIdx drives which phrase is active. When it changes, we use
  // a key on the typing sub-component to auto-reset its state.
  const [phraseIdx, setPhraseIdx] = useState(0);
  const pendingScroll = useRef(false);
  const containerRef = useRef<HTMLButtonElement>(null);

  const allDone = phraseIdx >= card.texts.length;
  const currentPhrase: string = allDone ? '' : (card.texts[phraseIdx] ?? '');
  const completedPhrases = card.texts.slice(0, phraseIdx);

  useEffect(() => {
    if (allDone) onReadyChange?.(true);
  }, [allDone, onReadyChange]);

  useEffect(() => {
    if (pendingScroll.current && containerRef.current) {
      pendingScroll.current = false;
      containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [phraseIdx]);

  const onAdvance = () => {
    pendingScroll.current = true;
    setPhraseIdx((prev) => prev + 1);
  };

  return (
    <button className={s.container} ref={containerRef}>
      {completedPhrases.map((phrase, i) => (
        <div key={i} className={s.bubbleDone}>
          <span className={s.textDone}>{phrase}</span>
        </div>
      ))}

      {!allDone && (
        <TypingBubble
          key={phraseIdx}
          phrase={currentPhrase}
          onComplete={onAdvance}
        />
      )}

      {!allDone && (
        <div className={s.personCol}>
          <SpeakerSpriteAvatar size={64} />
        </div>
      )}

      {allDone && (
        <>
          <div className={s.personCol}>
            <SpeakerSpriteAvatar size={64} />
          </div>
          <div className={s.doneRow}>
            <div className={s.doneBadge}>
              <div className={s.doneBadgeRow}>
                <CheckIcon color="var(--color-success)" size={12} />
                <span className={s.doneText}>Конец связи</span>
              </div>
            </div>
          </div>
        </>
      )}
    </button>
  );
}

interface TypingBubbleProps {
  phrase: string;
  onComplete: () => void;
}

function TypingBubble({ phrase, onComplete }: TypingBubbleProps) {
  const [chars, setChars] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isTypingDone = chars >= phrase.length;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setChars((prev) => {
        const next = prev + 1;
        if (next >= phrase.length) {
          clearInterval(timerRef.current!);
        }
        return next;
      });
    }, TYPING_SPEED);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phrase]);

  const handleClick = () => {
    if (!isTypingDone) {
      if (timerRef.current) clearInterval(timerRef.current);
      setChars(phrase.length);
    } else {
      onComplete();
    }
  };

  return (
    <div onClick={handleClick} className={s.typingBubbleWrap}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={s.bubbleActive}
      >
        <span className={s.textActiveHidden}>{phrase}</span>
        <span className={s.textActive}>{phrase.slice(0, chars)}</span>
      </motion.div>
      {isTypingDone && (
        <div className={s.hintRow}>
          <span className={s.hintText}>▼ нажми чтобы продолжить</span>
        </div>
      )}
    </div>
  );
}
