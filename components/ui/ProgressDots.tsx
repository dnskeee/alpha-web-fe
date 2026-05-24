import s from './ProgressDots.module.css';

interface ProgressDotsProps {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className={s.container}>
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === current;
        return (
          <div
            key={i}
            className={s.dot}
            style={{
              width: isActive ? 18 : 6,
              backgroundColor: isActive ? 'var(--color-accent)' : 'var(--color-track)',
            }}
          />
        );
      })}
    </div>
  );
}
