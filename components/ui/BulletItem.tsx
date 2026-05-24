import { CheckIcon } from '@/components/icons/CheckIcon';
import s from './BulletItem.module.css';

interface BulletItemProps {
  index: number;
  text: string;
  subtitle?: string;
}

export function BulletItem({ index: _index, text, subtitle }: BulletItemProps) {
  return (
    <div className={s.container}>
      <div className={s.bullet}>
        <CheckIcon size={13} color="var(--color-accent)" />
      </div>
      <div className={s.textCol}>
        <span className={s.title}>{text}</span>
        {subtitle ? <span className={s.subtitle}>{subtitle}</span> : null}
      </div>
    </div>
  );
}
