'use client';

import { ChatWindow, ChatWindowHandle } from '@/components/ui/ChatWindow';
import { StepChatCard } from '@/types/lesson';
import { useEffect, useRef } from 'react';

interface Props {
  card: StepChatCard;
  onReadyChange?: (ready: boolean) => void;
}

export function StepChat({ card, onReadyChange }: Props) {
  const chatRef = useRef<ChatWindowHandle>(null);

  useEffect(() => {
    chatRef.current?.clear();
    const timers: ReturnType<typeof setTimeout>[] = [];
    const lastIdx = card.messages.length - 1;

    card.messages.forEach((m, i) => {
      const isHer = m.from === 'her';
      const baseDelay = m.delay ?? i * 1200;
      timers.push(
        setTimeout(() => {
          if (isHer) chatRef.current?.setTyping(true);
          timers.push(
            setTimeout(
              () => {
                chatRef.current?.setTyping(false);
                chatRef.current?.pushMessage({ from: m.from, text: m.text });
                if (i === lastIdx) onReadyChange?.(true);
              },
              isHer ? 600 : 0,
            ),
          );
        }, baseDelay),
      );
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [card, onReadyChange]);

  return (
    <ChatWindow
      ref={chatRef}
      characterName={card.characterName}
      characterInitial={card.characterInitial}
      characterColor={card.characterColor}
      messagesHeight={420}
    />
  );
}
