'use client';

import { useEffect, useRef, useState } from 'react';
import { ChatSimulatorCard, ChatChoice } from '@/types/lesson';
import { ChatWindow, ChatWindowHandle } from '@/components/ui/ChatWindow';
import { CheckIcon } from '@/components/icons/CheckIcon';
import { CrossIcon } from '@/components/icons/CrossIcon';
import { WarningGlyph } from '@/components/lesson/icons/LessonGlyphs';
import s from './TestChat.module.css';

interface Props {
  card: ChatSimulatorCard;
  onReadyChange?: (ready: boolean) => void;
}

type Phase = 'intro' | 'chat' | 'choice' | 'reply' | 'verdict';

export function TestChat({ card, onReadyChange }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [chosen, setChosen] = useState<ChatChoice | null>(null);
  const chatRef = useRef<ChatWindowHandle>(null);
  const reportedReady = useRef(false);

  useEffect(() => {
    if (!reportedReady.current && phase === 'verdict') {
      reportedReady.current = true;
      onReadyChange?.(true);
    }
  }, [phase, onReadyChange]);

  const startChat = () => {
    chatRef.current?.clear();
    setPhase('chat');
    const msgs = card.initialMessages;
    msgs.forEach((m, i) => {
      setTimeout(() => {
        chatRef.current?.setTyping(true);
        setTimeout(() => {
          chatRef.current?.setTyping(i < msgs.length - 1);
          chatRef.current?.pushMessage(m);
          if (i === msgs.length - 1) {
            setTimeout(() => setPhase('choice'), 400);
          }
        }, 600);
      }, i * 1200 + 300);
    });
  };

  const pickChoice = (choice: ChatChoice) => {
    setChosen(choice);
    setPhase('reply');
    chatRef.current?.pushMessage({ from: 'you', text: choice.text });
    chatRef.current?.setTyping(true);
    choice.herReply.forEach((r, i) => {
      setTimeout(() => {
        if (i === choice.herReply.length - 1) chatRef.current?.setTyping(false);
        chatRef.current?.pushMessage({ from: 'her', text: r.text });
        if (i === choice.herReply.length - 1) {
          setTimeout(() => setPhase('verdict'), 800);
        }
      }, r.delay + 800);
    });
  };

  const reset = () => {
    setPhase('intro');
    setChosen(null);
    chatRef.current?.clear();
  };

  const verdictColor =
    chosen?.quality === 'good'
      ? 'var(--color-success)'
      : chosen?.quality === 'mid'
        ? 'var(--color-warning)'
        : 'var(--color-red)';

  const verdictBg =
    chosen?.quality === 'good'
      ? 'var(--color-success-dim)'
      : chosen?.quality === 'mid'
        ? 'var(--color-warning-dim)'
        : 'var(--color-red-dim)';

  if (phase === 'intro') {
    return (
      <div className={s.introContainer}>
        <p className={s.context}>{card.context}</p>
        <button className={s.startBtn} onClick={startChat}>
          Начать диалог
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className={s.chatWrapper}>
        <ChatWindow ref={chatRef} characterName="Аня" characterInitial="А" />
      </div>

      {phase === 'choice' && (
        <div className={s.choices}>
          <p className={s.choiceLabel}>Что ответишь?</p>
          {card.choices.map((ch) => (
            <button key={ch.id} className={s.choiceBtn} onClick={() => pickChoice(ch)}>
              {ch.text}
            </button>
          ))}
        </div>
      )}

      {phase === 'verdict' && chosen && (
        <div
          className={s.verdict}
          style={{ background: verdictBg, borderColor: verdictColor + '33' }}
        >
          <div className={s.verdictHeader}>
            {chosen.quality === 'good' ? (
              <CheckIcon color={verdictColor} size={16} />
            ) : chosen.quality === 'mid' ? (
              <WarningGlyph color={verdictColor} size={16} />
            ) : (
              <CrossIcon color={verdictColor} size={16} />
            )}
            <span className={s.verdictTitle} style={{ color: verdictColor }}>
              {chosen.quality === 'good'
                ? 'Отличный ответ'
                : chosen.quality === 'mid'
                  ? 'Неплохо, но можно лучше'
                  : 'Слабый ответ'}
            </span>
          </div>
          <p className={s.verdictText}>{chosen.verdict}</p>
          <button className={s.resetBtn} onClick={reset}>
            Попробовать снова
          </button>
        </div>
      )}
    </div>
  );
}
