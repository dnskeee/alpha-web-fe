'use client';

import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import s from './ChatWindow.module.css';

export interface ChatWindowMessage {
  from: 'her' | 'you';
  text: string;
}

export interface ChatWindowHandle {
  pushMessage: (msg: ChatWindowMessage) => void;
  setTyping: (typing: boolean) => void;
  clear: () => void;
}

interface ChatWindowProps {
  characterName: string;
  characterInitial: string;
  characterColor?: string;
  messagesHeight?: number;
  pointer?: boolean;
}

export const ChatWindow = forwardRef<ChatWindowHandle, ChatWindowProps>(
  ({ characterName, characterInitial, characterColor, messagesHeight, pointer = false }, ref) => {
    const [messages, setMessages] = useState<ChatWindowMessage[]>([]);
    const [typing, setTypingState] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      pushMessage: (msg: ChatWindowMessage) => {
        setMessages((prev) => [...prev, msg]);
      },
      setTyping: (val: boolean) => {
        setTypingState(val);
      },
      clear: () => {
        setMessages([]);
        setTypingState(false);
      },
    }));

    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [messages, typing]);

    const avatarBg = characterColor ?? 'var(--color-accent)';

    return (
      <div className={s.chatWindow}>
        {pointer ? <div className={s.pointer} /> : null}
        <div className={s.chatHeader}>
          <div className={s.avatar} style={{ backgroundColor: avatarBg }}>
            <span className={s.avatarText}>{characterInitial}</span>
          </div>
          <div>
            <span className={s.avatarName}>{characterName}</span>
            <span className={s.onlineStatus}>онлайн</span>
          </div>
        </div>

        <div
          ref={scrollRef}
          className={s.messagesScroll}
          style={{ maxHeight: messagesHeight ?? 220 }}
        >
          {messages.length === 0 && !typing && (
            <span className={s.emptyText}>Нет сообщений</span>
          )}
          <AnimatePresence initial={false}>
            {messages.map((m, i) => {
              const isYou = m.from === 'you';
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className={clsx(s.messageRow, isYou ? s.messageRowRight : s.messageRowLeft)}
                >
                  <div className={clsx(s.bubble, isYou ? s.bubbleYou : s.bubbleHer)}>
                    <span className={clsx(s.bubbleText, isYou && s.bubbleTextYou)}>
                      {m.text}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {typing && (
            <div className={s.typingRow}>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className={s.typingDot}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    y: [0, -4, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.16,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ChatWindow.displayName = 'ChatWindow';
