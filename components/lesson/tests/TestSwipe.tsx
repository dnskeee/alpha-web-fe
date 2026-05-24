'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { SwipeTestCard } from '@/types/lesson';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { CrossIcon } from '@/components/icons/CrossIcon';
import { BookIcon } from '@/components/icons/BookIcon';
import { ThumbsGlyph, TrophyGlyph } from '@/components/lesson/icons/LessonGlyphs';
import s from './TestSwipe.module.css';

interface Props {
  card: SwipeTestCard;
  onReadyChange?: (ready: boolean) => void;
}

function SwipeCard({
  text,
  onSwipeRight,
  onSwipeLeft,
}: {
  text: string;
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  return (
    <motion.div
      className={s.swipeCard}
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120) onSwipeRight();
        else if (info.offset.x < -120) onSwipeLeft();
      }}
    >
      <p className={s.swipeCardText}>{text}</p>
    </motion.div>
  );
}

export function TestSwipe({ card, onReadyChange }: Props) {
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState({ right: 0, wrong: 0 });

  const done = current >= card.items.length;

  useEffect(() => {
    if (done) onReadyChange?.(true);
  }, [done, onReadyChange]);

  const handleAnswer = (isRight: boolean) => {
    if (result) return;
    const item = card.items[current]!;
    const isCorrect = isRight === item.correct;
    setScore((s) =>
      isCorrect ? { ...s, right: s.right + 1 } : { ...s, wrong: s.wrong + 1 },
    );
    setResult(isCorrect ? 'correct' : 'wrong');
  };

  const handleNext = () => {
    setResult(null);
    setCurrent((c) => c + 1);
  };

  const reset = () => {
    setCurrent(0);
    setScore({ right: 0, wrong: 0 });
    setResult(null);
  };

  if (done) {
    const pct = Math.round((score.right / card.items.length) * 100);
    return (
      <div className={s.doneContainer}>
        <div className={s.doneIconWrap}>
          {pct >= 80 ? (
            <TrophyGlyph color="var(--color-success)" size={48} />
          ) : pct >= 50 ? (
            <ThumbsGlyph color="var(--color-success)" size={48} />
          ) : (
            <BookIcon color="var(--color-muted)" size={48} />
          )}
        </div>
        <p className={s.doneScore}>{score.right}/{card.items.length}</p>
        <p className={s.doneLabel}>правильных ответов</p>
        <button className={s.primaryBtn} onClick={reset}>
          Ещё раз
        </button>
      </div>
    );
  }

  const item = card.items[current]!;

  return (
    <div>
      <div className={s.statusRow}>
        <span className={s.counter}>{current + 1} из {card.items.length}</span>
        <div className={s.scoreRow}>
          <div className={s.scoreItem}>
            <CheckIcon color="var(--color-success)" size={12} />
            <span className={s.scoreRight}>{score.right}</span>
          </div>
          <div className={s.scoreItem}>
            <CrossIcon color="var(--color-red)" size={12} />
            <span className={s.scoreWrong}>{score.wrong}</span>
          </div>
        </div>
      </div>

      {!result ? (
        <>
          <SwipeCard
            key={current}
            text={item.text}
            onSwipeRight={() => handleAnswer(true)}
            onSwipeLeft={() => handleAnswer(false)}
          />
          <div className={s.swipeHints}>
            <span className={s.hintNo}>← Нет</span>
            <span className={s.hintYes}>Да →</span>
          </div>
          <div className={s.buttons}>
            <button
              className={`${s.answerBtn} ${s.answerBtnNo}`}
              onClick={() => handleAnswer(false)}
            >
              <div className={s.answerBtnInner}>
                <CrossIcon color="var(--color-red)" size={14} />
                <span className={s.answerBtnNoText}>Нет</span>
              </div>
            </button>
            <button
              className={`${s.answerBtn} ${s.answerBtnYes}`}
              onClick={() => handleAnswer(true)}
            >
              <div className={s.answerBtnInner}>
                <CheckIcon color="var(--color-success)" size={14} />
                <span className={s.answerBtnYesText}>Да</span>
              </div>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className={s.cardStatic}>
            <p className={s.swipeCardText}>{item.text}</p>
          </div>
          <div
            className={s.resultBox}
            style={{
              background: result === 'correct' ? 'var(--color-success-dim)' : 'var(--color-red-dim)',
              borderColor: (result === 'correct' ? 'var(--color-success)' : 'var(--color-red)') + '33',
            }}
          >
            <div className={s.resultLabelRow}>
              {result === 'correct' ? (
                <CheckIcon color="var(--color-success)" size={14} />
              ) : (
                <CrossIcon color="var(--color-red)" size={14} />
              )}
              <span
                className={s.resultLabel}
                style={{ color: result === 'correct' ? 'var(--color-success)' : 'var(--color-red)' }}
              >
                {result === 'correct' ? 'Верно!' : 'Неверно'}
              </span>
            </div>
            <p className={s.resultWhy}>{item.why}</p>
            <button className={s.nextBtn} onClick={handleNext}>
              Далее →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
