import React from 'react';
import clsx from 'clsx';

import s from './BPRoadmapNode.module.css';

interface Props {
  number: number;
  connector?: boolean;
}

export function BPRoadmapNode({ number, connector = true }: Props) {
  return (
    <div className={s.wrap}>
      <div className={s.node}>
        <span className={s.number}>{number}</span>
      </div>
      {connector && <div className={clsx(s.connector)} />}
    </div>
  );
}
