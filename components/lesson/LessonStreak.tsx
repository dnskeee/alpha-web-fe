import { ZapIcon } from '@/components/icons/ZapIcon';
import s from './LessonStreak.module.css';

interface LessonStreakProps {
  days: number;
}

export function LessonStreak({ days }: LessonStreakProps) {
  return (
    <div className={s.container}>
      <div className={s.iconWrap}>
        <ZapIcon size={22} color="var(--color-accent-ink)" />
      </div>
      <div className={s.textWrap}>
        <span className={s.title}>Стрик: {days} дней</span>
        <span className={s.sub}>Пройди урок сегодня, чтобы не потерять</span>
      </div>
    </div>
  );
}
