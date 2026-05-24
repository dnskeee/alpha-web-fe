import { CheckIcon } from '@/components/icons/CheckIcon';
import { CrossIcon } from '@/components/icons/CrossIcon';
import s from './DosDonts.module.css';

interface DosDontsProps {
  doText: string;
  dontText: string;
}

export function DosDonts({ doText, dontText }: DosDontsProps) {
  return (
    <div className={s.col}>
      <div className={s.row}>
        <div className={s.bulletDo}>
          <CheckIcon size={13} color="var(--color-accent)" />
        </div>
        <span className={s.text}>{doText}</span>
      </div>
      <div className={s.row}>
        <div className={s.bulletDont}>
          <CrossIcon size={13} color="#ffffff" />
        </div>
        <span className={s.text}>{dontText}</span>
      </div>
    </div>
  );
}
