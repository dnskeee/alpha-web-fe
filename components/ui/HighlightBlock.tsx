import clsx from 'clsx';
import s from './HighlightBlock.module.css';

interface HighlightBlockProps {
  text: string;
  question?: string;
  variant?: 'accent' | 'quote';
}

export function HighlightBlock({ text, question, variant = 'accent' }: HighlightBlockProps) {
  return (
    <div className={clsx(s.base, variant === 'accent' ? s.accent : s.quote)}>
      {question ? <span className={s.question}>{question}</span> : null}
      <span className={s.text}>{text}</span>
    </div>
  );
}
