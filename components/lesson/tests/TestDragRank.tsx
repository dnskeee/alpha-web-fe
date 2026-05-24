'use client';

import { useEffect, useRef, useState } from 'react';
import { Reorder } from 'motion/react';
import { DragRankCard, DragRankItem } from '@/types/lesson';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { CrossIcon } from '@/components/icons/CrossIcon';
import s from './TestDragRank.module.css';

interface Props {
  card: DragRankCard;
  onReadyChange?: (ready: boolean) => void;
}

export function TestDragRank({ card, onReadyChange }: Props) {
  const [items, setItems] = useState<DragRankItem[]>(
    () => [...card.items].sort(() => Math.random() - 0.5),
  );
  const [checked, setChecked] = useState(false);
  const reportedReady = useRef(false);

  useEffect(() => {
    if (!reportedReady.current && checked) {
      reportedReady.current = true;
      onReadyChange?.(true);
    }
  }, [checked, onReadyChange]);

  const reset = () => {
    setItems([...card.items].sort(() => Math.random() - 0.5));
    setChecked(false);
  };

  const correctCount = checked
    ? items.filter((item, i) => item.id === card.correctOrder[i]).length
    : 0;

  const scoreColor =
    correctCount >= Math.ceil(items.length * 0.8)
      ? 'var(--color-success)'
      : correctCount >= Math.ceil(items.length * 0.4)
        ? 'var(--color-warning)'
        : 'var(--color-red)';

  return (
    <div>
      <p className={s.instruction}>{card.instruction}</p>

      {!checked ? (
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={setItems}
          className={s.list}
        >
          {items.map((item, i) => (
            <Reorder.Item key={item.id} value={item} className={s.row}>
              <div className={s.rankBadge}>
                <span className={s.rankText}>{i + 1}</span>
              </div>
              <span className={s.itemIcon}>{item.icon}</span>
              <span className={s.itemText}>{item.text}</span>
              <span className={s.dragHandle}>⠿</span>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      ) : (
        <div className={s.list}>
          {items.map((item, i) => {
            const isCorrect = item.id === card.correctOrder[i];
            return (
              <div
                key={item.id}
                className={`${s.row} ${isCorrect ? s.rowCorrect : s.rowWrong}`}
              >
                <div className={s.rankBadge}>
                  <span className={s.rankText}>{i + 1}</span>
                </div>
                <span className={s.itemIcon}>{item.icon}</span>
                <span className={s.itemText}>{item.text}</span>
                {isCorrect ? (
                  <CheckIcon color="var(--color-success)" size={16} />
                ) : (
                  <CrossIcon color="var(--color-red)" size={16} />
                )}
              </div>
            );
          })}
        </div>
      )}

      {!checked ? (
        <button className={s.checkBtn} onClick={() => setChecked(true)}>
          Проверить
        </button>
      ) : (
        <div>
          <div className={s.resultHeader}>
            <span className={s.resultScore} style={{ color: scoreColor }}>
              {correctCount}/{items.length} совпадений
            </span>
          </div>
          <div className={s.insightBox}>
            <p className={s.insightText}>{card.insight}</p>
          </div>
          <button className={s.resetBtn} onClick={reset}>
            Попробовать снова
          </button>
        </div>
      )}
    </div>
  );
}
