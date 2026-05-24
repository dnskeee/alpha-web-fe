import s from './NoteBlock.module.css';

interface NoteBlockProps {
  text: string;
  variant?: 'dark' | 'dim';
}

export function NoteBlock({ text, variant = 'dark' }: NoteBlockProps) {
  if (variant === 'dim') {
    return <span className={s.dimText}>{text}</span>;
  }
  return (
    <div className={s.container}>
      <span className={s.text}>{text}</span>
    </div>
  );
}
