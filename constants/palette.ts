// App color palette — BePrime (Sage Cream light + Cocoa Gold dark)

// ─── Static legacy exports (kept for mock pages that hard-import constants) ───
export const ACCENT = '#d4a04a';
export const BG_DARK = '#1a1612';
export const BG_CARD = '#26211a';
export const BG_CARD2 = '#211d17';
export const TEXT_PRIMARY = '#ede5d6';
export const TEXT_SECONDARY = '#8a7e6c';
export const TEXT_DIM = '#8a7e6c';
export const BORDER = 'rgba(255,240,200,0.08)';
export const SUCCESS = '#a8c890';
export const WARNING = '#e8c878';

export const BLUE = '#6b5a40';
export const PURPLE = '#8a5a3e';
export const PINK = '#6b8a8a';
export const RED = '#e08570';

export const ACCENT_DIM = 'rgba(212,160,74,0.12)';
export const SUCCESS_DIM = 'rgba(168,200,144,0.10)';
export const WARNING_DIM = 'rgba(232,200,120,0.10)';
export const BLUE_DIM = 'rgba(107,90,64,0.20)';
export const PURPLE_DIM = 'rgba(138,90,62,0.20)';
export const PINK_DIM = 'rgba(107,138,138,0.20)';
export const RED_DIM = 'rgba(224,133,112,0.12)';

// ─── Dynamic theme system ───────────────────────────────────────────────────

export interface IconHero {
  from: string;
  to: string;
}

export interface ThemeColors {
  // Existing tokens — values updated to BePrime palette
  ACCENT: string;
  ACCENT_TEXT: string;
  BTN_TEXT: string;
  BG_DARK: string;
  BG_CARD: string;
  BG_CARD2: string;
  TEXT_PRIMARY: string;
  TEXT_SECONDARY: string;
  TEXT_DIM: string;
  BORDER: string;
  SUCCESS: string;
  WARNING: string;
  BLUE: string;
  PURPLE: string;
  PINK: string;
  RED: string;
  ACCENT_DIM: string;
  SUCCESS_DIM: string;
  WARNING_DIM: string;
  BLUE_DIM: string;
  PURPLE_DIM: string;
  PINK_DIM: string;
  RED_DIM: string;

  // New BePrime tokens
  INK: string;          // alias of TEXT_PRIMARY
  MUTED: string;        // alias of TEXT_SECONDARY
  LINE: string;         // alias of BORDER
  CARD_SOFT: string;    // alias of BG_CARD2
  ACCENT_SOFT: string;
  ACCENT_INK: string;
  BTN_BG: string;
  BTN_FG: string;       // identical values to BTN_TEXT
  TRACK: string;
  STREAK_EMPTY: string;
  BADGE_BG: string;
  BADGE_FG: string;
  LOCKED: string;
  OVERLAY: string;
  QUOTE_BG: string;
  ZAP: string;
  ICON_HERO: IconHero;  // gradient stops for LinearGradient
  ICON_A: string;
  ICON_B: string;
  ICON_C: string;
  ICON_D: string;
  ICON_E: string;
  COURSE_COLORS: string[]; // [ICON_A, ICON_B, ICON_C, ICON_D, ICON_E]
}

const lightTheme: ThemeColors = {
  ACCENT: '#3d5a3a',
  ACCENT_TEXT: '#3d5a3a',
  BTN_TEXT: '#f5f1ea',
  BG_DARK: '#f5f1ea',
  BG_CARD: '#ffffff',
  BG_CARD2: '#faf6ef',
  TEXT_PRIMARY: '#1f1d1a',
  TEXT_SECONDARY: '#7a7468',
  TEXT_DIM: '#7a7468',
  BORDER: 'rgba(30,25,15,0.08)',
  SUCCESS: '#3d5a3a',
  WARNING: '#8a5a1a',
  BLUE: '#a8c8d6',
  PURPLE: '#b9a8d6',
  PINK: '#e8a8b8',
  RED: '#b8503a',
  ACCENT_DIM: 'rgba(61,90,58,0.10)',
  SUCCESS_DIM: 'rgba(61,90,58,0.10)',
  WARNING_DIM: 'rgba(255,243,216,1)',
  BLUE_DIM: 'rgba(168,200,214,0.20)',
  PURPLE_DIM: 'rgba(185,168,214,0.20)',
  PINK_DIM: 'rgba(232,168,184,0.20)',
  RED_DIM: 'rgba(184,80,58,0.10)',

  INK: '#1f1d1a',
  MUTED: '#7a7468',
  LINE: 'rgba(30,25,15,0.08)',
  CARD_SOFT: '#faf6ef',
  ACCENT_SOFT: '#e6ede2',
  ACCENT_INK: '#f5f1ea',
  BTN_BG: '#1f1d1a',
  BTN_FG: '#f5f1ea',
  TRACK: '#f0ece4',
  STREAK_EMPTY: '#f5f1ea',
  BADGE_BG: '#fff3d8',
  BADGE_FG: '#8a5a1a',
  LOCKED: '#cfc6b5',
  OVERLAY: 'rgba(31,29,26,0.06)',
  QUOTE_BG: '#fff8ee',
  ZAP: '#e8a04a',
  ICON_HERO: { from: '#e8b896', to: '#e89c70' },
  ICON_A: '#b9a8d6',
  ICON_B: '#a8c8d6',
  ICON_C: '#e8b896',
  ICON_D: '#cfd8a8',
  ICON_E: '#e8a8b8',
  COURSE_COLORS: ['#b9a8d6', '#a8c8d6', '#e8b896', '#cfd8a8', '#e8a8b8'],
};

const darkTheme: ThemeColors = {
  ACCENT: '#d4a04a',
  ACCENT_TEXT: '#d4a04a',
  BTN_TEXT: '#1a1612',
  BG_DARK: '#1a1612',
  BG_CARD: '#26211a',
  BG_CARD2: '#211d17',
  TEXT_PRIMARY: '#ede5d6',
  TEXT_SECONDARY: '#8a7e6c',
  TEXT_DIM: '#8a7e6c',
  BORDER: 'rgba(255,240,200,0.08)',
  SUCCESS: '#a8c890',
  WARNING: '#e8c878',
  BLUE: '#6b5a40',
  PURPLE: '#8a5a3e',
  PINK: '#6b8a8a',
  RED: '#e08570',
  ACCENT_DIM: 'rgba(212,160,74,0.12)',
  SUCCESS_DIM: 'rgba(168,200,144,0.10)',
  WARNING_DIM: 'rgba(58,46,24,1)',
  BLUE_DIM: 'rgba(107,90,64,0.20)',
  PURPLE_DIM: 'rgba(138,90,62,0.20)',
  PINK_DIM: 'rgba(107,138,138,0.20)',
  RED_DIM: 'rgba(224,133,112,0.12)',

  INK: '#ede5d6',
  MUTED: '#8a7e6c',
  LINE: 'rgba(255,240,200,0.08)',
  CARD_SOFT: '#211d17',
  ACCENT_SOFT: '#332a1c',
  ACCENT_INK: '#1a1612',
  BTN_BG: '#d4a04a',
  BTN_FG: '#1a1612',
  TRACK: '#211d17',
  STREAK_EMPTY: '#211d17',
  BADGE_BG: '#3a2e18',
  BADGE_FG: '#e8c878',
  LOCKED: '#3a342a',
  OVERLAY: 'rgba(255,240,200,0.04)',
  QUOTE_BG: '#2a2218',
  ZAP: '#d4a04a',
  ICON_HERO: { from: '#d4a04a', to: '#b8743a' },
  ICON_A: '#8a5a3e',
  ICON_B: '#6b5a40',
  ICON_C: '#5a6b50',
  ICON_D: '#7a6b8a',
  ICON_E: '#6b8a8a',
  COURSE_COLORS: ['#8a5a3e', '#6b5a40', '#5a6b50', '#7a6b8a', '#6b8a8a'],
};

export function getTheme(isDark: boolean): ThemeColors {
  return isDark ? darkTheme : lightTheme;
}
