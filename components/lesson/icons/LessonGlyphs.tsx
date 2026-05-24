interface Props { color: string; size?: number; }

export function WarningGlyph({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3l10 18H2L12 3z" fill={color} />
    </svg>
  );
}

export function TipGlyph({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="6" fill={color} />
    </svg>
  );
}

export function FlameGlyph({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3c0 5-5 6-5 11a5 5 0 0010 0c0-3-2-4-3-7-1 2-2 3-2 3z" fill={color} />
    </svg>
  );
}

export function TrophyGlyph({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="8" fill={color} />
    </svg>
  );
}

export function ThumbsGlyph({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="6" fill={color} />
    </svg>
  );
}

export function StrengthGlyph({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="6" fill={color} />
    </svg>
  );
}

export function FearGlyph({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="6.5" stroke={color} strokeWidth={1.8} fill="none" />
    </svg>
  );
}

export function StatsGlyph({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="13" width="4" height="7" fill={color} />
      <rect x="10" y="8" width="4" height="12" fill={color} />
      <rect x="16" y="4" width="4" height="16" fill={color} />
    </svg>
  );
}
