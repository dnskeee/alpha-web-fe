import React from 'react';

import s from './SpeakerSpriteAvatar.module.css';

interface Props {
  size?: number;
}

export function SpeakerSpriteAvatar({ size = 44 }: Props) {
  return (
    <div
      className={s.avatar}
      style={
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundSize: `${size * 4}px ${size * 2}px`,
          backgroundPositionY: `-${size}px`,
          '--frame-width': `${size * 4}px`,
        } as React.CSSProperties
      }
    />
  );
}
