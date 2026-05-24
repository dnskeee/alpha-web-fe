interface Props { color: string; size?: number; }

export function BookIcon({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 5a2 2 0 012-2h5a2 2 0 012 2v15M21 5a2 2 0 00-2-2h-5a2 2 0 00-2 2v15M3 5v14a2 2 0 002 2h14a2 2 0 002-2V5"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
