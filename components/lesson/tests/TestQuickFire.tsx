'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { QuickFireCard } from '@/types/lesson';
import { ZapIcon } from '@/components/icons/ZapIcon';
import { ClockIcon } from '@/components/icons/ClockIcon';
import { BookIcon } from '@/components/icons/BookIcon';
import { FlameGlyph, ThumbsGlyph } from '@/components/lesson/icons/LessonGlyphs';
import s from './TestQuickFire.module.css';

interface Props {
  card: QuickFireCard;
  onReadyChange?: (ready: boolean) => void;
}

type Result = 'correct' | 'wrong' | 'timeout' | null;

export function TestQuickFire({ card, onReadyChange }: Props) {
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [result, setResult] = useState<Result>(null);
  const [pct, setPct] = useState(100);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reportedReady = useRef(false);

  const done = current >= card.questions.length;

  useEffect(() => {
    if (!reportedReady.current && done) {
      reportedReady.current = true;
      onReadyChange?.(true);
    }
  }, [done, onReadyChange]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = useCallback(() => {
    setPct(100);
    clearTimer();
    const total = card.timePerQuestion * 1000;
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1 - elapsed / total);
      setPct(remaining * 100);
      if (remaining <= 0) {
        clearTimer();
        setResult('timeout');
        setStreak(0);
      }
    }, 50);
  }, [card.timePerQuestion]);

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const start = () => {
    setStarted(true);
    startTimer();
  };

  const answer = (val: boolean) => {
    if (result) return;
    clearTimer();
    const question = card.questions[current]!;
    const correct = val === question.answer;
    setResult(correct ? 'correct' : 'wrong');
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    setResult(null);
    setPct(100);
    setCurrent((c) => c + 1);
    if (current + 1 < card.questions.length) {
      startTimer();
    }
  };

  if (!started) {
    return (
      <div className={s.introContainer}>
        <div className={s.introIconWrap}>
          <ZapIcon color="var(--color-zap)" size={44} />
        </div>
        <p className={s.introTitle}>Блиц-раунд</p>
        <p className={s.introDesc}>
          {card.questions.length} утверждений · {card.timePerQuestion} секунд на каждое · Миф или правда?
        </p>
        <button className={s.startBtn} onClick={start}>
          Поехали!
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className={s.doneContainer}>
        <div className={s.doneIconWrap}>
          {score >= Math.ceil(card.questions.length * 0.8) ? (
            <FlameGlyph color="var(--color-zap)" size={48} />
          ) : score >= Math.ceil(card.questions.length * 0.5) ? (
            <ThumbsGlyph color="var(--color-success)" size={48} />
          ) : (
            <BookIcon color="var(--color-muted)" size={48} />
          )}
        </div>
        <p className={s.doneScore}>{score}/{card.questions.length}</p>
        <p className={s.doneLabel}>правильных ответов</p>
        <button
          className={s.startBtn}
          onClick={() => {
            setCurrent(0);
            setScore(0);
            setStreak(0);
            setStarted(false);
            setResult(null);
            setPct(100);
          }}
        >
          Заново
        </button>
      </div>
    );
  }

  const question = card.questions[current]!;
  const barColor =
    pct > 37.5 ? 'var(--color-accent)' : 'var(--color-red)';

  const cardBorderColor =
    result === 'correct'
      ? 'var(--color-success)'
      : result === 'wrong'
        ? 'var(--color-red)'
        : result === 'timeout'
          ? 'var(--color-warning)'
          : 'var(--color-border)';

  return (
    <div>
      <div className={s.timerBar}>
        <motion.div
          className={s.timerFill}
          animate={{ width: `${pct}%`, backgroundColor: barColor }}
          transition={{ duration: 0.1, ease: 'linear' }}
        />
      </div>

      <div className={s.statusRow}>
        <span className={s.counter}>{current + 1}/{card.questions.length}</span>
        <div className={s.rightRow}>
          {streak >= 2 && (
            <div className={s.streakRow}>
              <FlameGlyph color="var(--color-zap)" size={12} />
              <span className={s.streak}>x{streak}</span>
            </div>
          )}
          <span className={s.scoreText}>{score} очков</span>
        </div>
      </div>

      <div className={s.statementCard} style={{ borderColor: cardBorderColor }}>
        <p className={s.statementText}>{question.text}</p>
      </div>

      {result === 'timeout' && (
        <div className={s.timeoutBox}>
          <div className={s.timeoutRow}>
            <ClockIcon color="var(--color-warning)" size={14} />
            <span className={s.timeoutText}>Время вышло!</span>
          </div>
        </div>
      )}

      {result && (
        <div
          className={s.explainBox}
          style={{
            background:
              result === 'correct'
                ? 'var(--color-success-dim)'
                : result === 'wrong'
                  ? 'var(--color-red-dim)'
                  : 'var(--color-warning-dim)',
          }}
        >
          <p className={s.explainText}>{question.explain}</p>
        </div>
      )}

      {!result && (
        <div className={s.buttons}>
          <button className={s.mythBtn} onClick={() => answer(false)}>
            МИФ
          </button>
          <button className={s.truthBtn} onClick={() => answer(true)}>
            ПРАВДА
          </button>
        </div>
      )}

      {result && (
        <button className={s.nextBtn} onClick={next}>
          {current + 1 < card.questions.length ? 'Далее →' : 'Результат →'}
        </button>
      )}
    </div>
  );
}
