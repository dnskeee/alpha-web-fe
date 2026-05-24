import React from 'react';
import clsx from 'clsx';

import s from './BPHeroAvatar.module.css';

interface Props {
  size?: number;
  radius?: number;
  withStar?: boolean;
  starNode?: React.ReactNode;
  className?: string;
}

export function BPHeroAvatar({ size = 56, radius = 18, withStar = false, starNode, className }: Props) {
  return (
    <div className={clsx(s.root, className)} style={{ width: size, height: size }}>
      <div
        className={s.gradient}
        style={{ width: size, height: size, borderRadius: radius }}
      >
        <div
          className={s.highlight}
          style={{
            top: size * 0.15,
            left: size * 0.15,
            right: size * 0.15,
            bottom: size * 0.15,
            borderRadius: radius * 0.65,
          }}
        />
      </div>
      {withStar && (
        <div className={s.star}>
          {starNode}
        </div>
      )}
    </div>
  );
}
