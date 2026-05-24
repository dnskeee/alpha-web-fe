interface Props { color: string; size?: number; }

export function LockIcon({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4.5" y="11" width="15" height="10" rx="2" fill={color} />
      <path d="M8 11V8a4 4 0 018 0v3" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}
