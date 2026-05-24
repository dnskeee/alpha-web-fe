const tintColorLight = '#3d5a3a';
const tintColorDark = '#d4a04a';

export const Colors = {
  light: {
    text: '#1f1d1a',
    background: '#f5f1ea',
    tint: tintColorLight,
    icon: '#7a7468',
    tabIconDefault: '#7a7468',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ede5d6',
    background: '#1a1612',
    tint: tintColorDark,
    icon: '#8a7e6c',
    tabIconDefault: '#8a7e6c',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = {
  sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
  mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
};

/** BePrime typography. Maps semantic weight → Manrope variant. */
export const FontBP = {
  medium: "'Manrope', system-ui, -apple-system, sans-serif",
  semibold: "'Manrope', system-ui, -apple-system, sans-serif",
  bold: "'Manrope', system-ui, -apple-system, sans-serif",
  extrabold: "'Manrope', system-ui, -apple-system, sans-serif",
};
