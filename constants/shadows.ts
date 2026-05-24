// Each entry exposes a `css` string for use in style={{ boxShadow: ... }}.

import type { ThemeColors } from '@/constants/palette';

/** Soft drop shadow for cards. Pair with `BG_CARD` background. */
export function cardShadow(_C: ThemeColors): { css: string } {
  return {
    // Equivalent to: shadowColor '#000', offset {0,8}, opacity 0.05, radius 24
    css: '0 8px 24px rgba(0,0,0,0.05)',
  };
}

/** Smaller shadow for chips and inline cards. */
export function chipShadow(_C: ThemeColors): { css: string } {
  return {
    // Equivalent to: shadowColor '#000', offset {0,1}, opacity 0.04, radius 2
    css: '0 1px 2px rgba(0,0,0,0.04)',
  };
}
