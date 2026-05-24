import React from 'react';

interface Props {
  size?: number;
}

export function QuoteOrb({ size = 36 }: Props) {
  const id = 'quoteOrbGrad';
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd06b" stopOpacity={1} />
          <stop offset="60%" stopColor="#ffb04a" stopOpacity={1} />
          <stop offset="100%" stopColor="#ffb04a" stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx="18" cy="18" r="18" fill={`url(#${id})`} />
    </svg>
  );
}
