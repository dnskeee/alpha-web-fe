'use client';

import { useEffect, useState } from 'react';
import { ScenarioCard } from '@/types/lesson';
import s from './BasicTest.module.css';

interface Props {
  card: ScenarioCard;
  onReadyChange?: (ready: boolean) => void;
}

export function BasicTest({ card, onReadyChange }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  const selectedOption = card.options.find((o) => o.id === selected);
  const pickedWrong = selected !== null && !selectedOption?.correct;
  const reachedCorrect = (selected !== null && !pickedWrong) || confirmed !== null;

  useEffect(() => {
    if (reachedCorrect) onReadyChange?.(true);
  }, [reachedCorrect, onReadyChange]);

  const handleSelect = (id: string) => {
    if (!selected) {
      setSelected(id);
    } else if (pickedWrong) {
      const opt = card.options.find((o) => o.id === id);
      if (opt?.correct) setConfirmed(id);
    }
  };

  return (
    <div>
      <p className={s.label}>{card.emoji} Ситуация</p>
      <p className={s.title}>{card.title}</p>
      <p className={s.body}>{card.body}</p>

      <div className={s.quoteBox}>
        <p className={s.quoteText}>«{card.scenarioQuote}»</p>
      </div>

      <div className={s.options}>
        {card.options.map((opt) => {
          const isSelected = selected === opt.id;
          const showResult = selected !== null;
          const isCorrect = opt.correct;
          const isConfirmed = confirmed === opt.id;
          const showExplanation = showResult && (isSelected || (pickedWrong && isCorrect));
          const isClickable = !selected || (pickedWrong && isCorrect && !confirmed);

          let optionClass = s.optionDefault;
          if (showResult && (isSelected || isConfirmed) && isCorrect) optionClass = s.optionCorrect;
          else if (showResult && isSelected && !isCorrect) optionClass = s.optionWrong;
          else if (showResult && !isSelected && isCorrect)
            optionClass = pickedWrong && !confirmed ? s.optionCorrectPulse : s.optionCorrectDim;

          return (
            <div key={opt.id}>
              <button
                className={`${s.option} ${optionClass}`}
                onClick={() => handleSelect(opt.id)}
                disabled={!isClickable}
              >
                <span
                  className={s.optionId}
                  style={showResult && isCorrect ? { color: 'var(--color-success)' } : undefined}
                >
                  {opt.id.toUpperCase()}
                </span>
                <span className={s.optionText}>{opt.text}</span>
              </button>
              {showExplanation && (
                <p
                  className={s.explanation}
                  style={{ color: isCorrect ? 'var(--color-success)' : 'var(--color-red)' }}
                >
                  {card.explanations[opt.id]}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
