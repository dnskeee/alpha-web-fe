interface Props { color: string; size?: number; }

export function HomeIcon({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.5 11.5L12 4l8.5 7.5V20a1 1 0 01-1 1h-4.5v-6.5h-6V21H4.5a1 1 0 01-1-1v-8.5z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
