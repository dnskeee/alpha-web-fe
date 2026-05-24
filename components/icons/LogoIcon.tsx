interface Props {
  /** Background color (typically C.INK) */
  background: string;
  /** Foreground "bp" color (typically C.BG_DARK) */
  foreground: string;
  size?: number;
}

export function LogoIcon({ background, foreground, size = 32 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="32" height="32" rx="10" fill={background} />
      <text
        x="16"
        y="22"
        fontSize="16"
        fontWeight="800"
        fill={foreground}
        textAnchor="middle"
        fontFamily="Manrope_800ExtraBold"
      >bp</text>
    </svg>
  );
}
