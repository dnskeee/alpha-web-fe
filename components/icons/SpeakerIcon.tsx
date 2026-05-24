interface SpeakerIconProps {
  color: string;
  size?: number;
}

export function SpeakerIcon({ color, size = 18 }: SpeakerIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="3" width="6" height="12" rx="3" fill={color} />
      <path
        d="M5 11a7 7 0 0014 0M12 18v3M9 21h6"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
