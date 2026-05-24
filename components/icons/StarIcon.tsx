interface Props { color: string; size?: number; }

export function StarIcon({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2.5l2.95 6 6.55.95-4.75 4.6 1.1 6.55L12 17.55 6.15 20.6l1.1-6.55L2.5 9.45l6.55-.95L12 2.5z"
        fill={color}
      />
    </svg>
  );
}
