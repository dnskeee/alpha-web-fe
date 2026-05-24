import React from 'react';
import clsx from 'clsx';

import { CheckIcon } from '@/components/icons/CheckIcon';
import s from './BPLessonNode.module.css';

interface Props {
  number: number;
  state: 'done' | 'active' | 'pending';
  connector?: boolean;
}

export function BPLessonNode({ number, state, connector = true }: Props) {
  return (
    <div className={s.wrap}>
      <div
        className={clsx(
          s.node,
          state === 'done' && s.done,
          state === 'active' && s.active,
          state === 'pending' && s.pending,
        )}
      >
        {state === 'done' ? (
          <CheckIcon size={16} color="#ffffff" />
        ) : (
          <span className={s.number}>{number}</span>
        )}
      </div>
      {connector && (
        <div className={clsx(s.connector, state === 'done' && s.connectorDone)} />
      )}
    </div>
  );
}
