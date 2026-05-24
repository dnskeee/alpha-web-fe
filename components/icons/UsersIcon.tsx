interface Props { color: string; size?: number; }

export function UsersIcon({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9"  cy="9"  r="3.2" stroke={color} strokeWidth={1.8} />
      <circle cx="17" cy="10" r="2.5" stroke={color} strokeWidth={1.8} />
      <path d="M3 19c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <path d="M16 14.5c2.5.4 4.5 2.5 4.5 5.5" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  );
}
