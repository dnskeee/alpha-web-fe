interface Props { color: string; size?: number; }

export function PlayIcon({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 5l11 7-11 7V5z" fill={color} />
    </svg>
  );
}
