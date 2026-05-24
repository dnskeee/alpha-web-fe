interface Props { color: string; size?: number; }

export function ProfileIcon({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke={color} strokeWidth={1.8} />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}
