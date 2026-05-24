interface Props { color: string; size?: number; }

export function EyeIcon({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth={1.8} />
    </svg>
  );
}
