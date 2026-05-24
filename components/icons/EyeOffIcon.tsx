interface Props { color: string; size?: number; }

export function EyeOffIcon({ color, size = 24 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 3l18 18M10.6 6.2A11 11 0 0112 6c6.5 0 10 6 10 6a14 14 0 01-3.5 4M6.2 7.7A14 14 0 002 12s3.5 6 10 6c1.5 0 2.9-.3 4.1-.8M9.9 9.9a3 3 0 004.2 4.2"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
