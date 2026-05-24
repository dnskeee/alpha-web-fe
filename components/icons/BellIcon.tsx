interface Props { color: string; size?: number; }

export function BellIcon({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 8a6 6 0 0112 0v5l2 3H4l2-3V8z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <path d="M10 19a2 2 0 004 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}
