interface Props { color: string; size?: number; }

export function ZapIcon({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" fill={color} />
    </svg>
  );
}
