import React from 'react';
import clsx from 'clsx';

import s from './BPSectionTitle.module.css';

interface Props {
  title: string;
  display?: string;
  className?: string;
  titleClassName?: string;
}

export function BPSectionTitle({ title, display, className, titleClassName }: Props) {
  return (
    <div className={className}>
      <span className={clsx(s.kicker, !display && s.noMargin, titleClassName)}>
        {title}
      </span>
      {display && (
        <p className={s.display}>{display}</p>
      )}
    </div>
  );
}
