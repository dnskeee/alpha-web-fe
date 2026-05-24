interface Props { color: string; size?: number; }

export function ModulesIcon({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5"    width="18" height="3" rx="1.5" fill={color} />
      <rect x="3" y="10.5" width="18" height="3" rx="1.5" fill={color} />
      <rect x="3" y="16"   width="18" height="3" rx="1.5" fill={color} />
    </svg>
  );
}
