import React from 'react';

import s from './SpeakerSpriteAvatar.module.css';

interface Props {
  /** URL to the per-speaker sprite (e.g. /images/sprite_cat.webp). */
  asset: string;
  size?: number;
}

export function SpeakerSpriteAvatar({ asset, size = 44 }: Props) {
  return (
    <div
      className={s.avatar}
      style={
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundImage: `url(${asset})`,
          backgroundSize: `${size * 4}px ${size * 2}px`,
          backgroundPositionY: `-${size}px`,
          '--frame-width': `${size * 4}px`,
        } as React.CSSProperties
      }
    />
  );
}
