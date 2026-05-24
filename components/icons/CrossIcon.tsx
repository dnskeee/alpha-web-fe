interface Props { color: string; size?: number; }

export function CrossIcon({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6l12 12M18 6L6 18" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
    </svg>
  );
}
