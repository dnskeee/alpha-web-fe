interface Props { color: string; size?: number; }

export function SunIcon({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="4" stroke={color} strokeWidth={1.8} />
      <line x1="12" y1="2"  x2="12" y2="5"  stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <line x1="12" y1="19" x2="12" y2="22" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <line x1="2"  y1="12" x2="5"  y2="12" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <line x1="19" y1="12" x2="22" y2="12" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <line x1="4.5"  y1="4.5"  x2="6.6"  y2="6.6"  stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <line x1="17.4" y1="17.4" x2="19.5" y2="19.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <line x1="4.5"  y1="19.5" x2="6.6"  y2="17.4" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <line x1="17.4" y1="6.6"  x2="19.5" y2="4.5"  stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}
