interface Props {
  color: string;
  size?: number;
}

export function SettingsIcon({ color, size = 20 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <line x1="2" y1="5" x2="18" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5" r="2.5" fill={color} />
      <line x1="2" y1="10" x2="18" y2="10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="14" cy="10" r="2.5" fill={color} />
      <line x1="2" y1="15" x2="18" y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="10" cy="15" r="2.5" fill={color} />
    </svg>
  );
}
