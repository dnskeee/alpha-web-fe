import React from 'react';
import clsx from 'clsx';

import s from './BPStatBox.module.css';

interface Props {
  label: string;
  value: string;
  suffix?: string;
  highlight?: boolean;
  className?: string;
}

export function BPStatBox({ label, value, suffix, highlight = false, className }: Props) {
  return (
    <div className={clsx(s.box, highlight && s.highlight, className)}>
      <span className={clsx(s.label, highlight && s.labelHighlight)}>{label}</span>
      <p className={s.value}>
        {value}
        {suffix && (
          <span className={clsx(s.suffix, highlight && s.suffixHighlight)}>{suffix}</span>
        )}
      </p>
    </div>
  );
}
