// Ported from ../../../src/index.css (`:root` custom properties).
// Keep in sync manually if the web app's palette changes.

export const COLORS = {
  bg: '#1c2620',
  surf: '#28342c',
  surf2: '#324035',
  line: '#3c4a3f',
  ink: '#f3efe4',
  dim: '#a9b6a8',
  blaze: '#2c74e8',
  gold: '#cf9f3a',
  rest: '#5b9279',
  glowWork: 'rgba(44, 116, 232, 0.10)',
  glowRest: 'rgba(91, 146, 121, 0.10)',
  glowGap: 'rgba(207, 159, 58, 0.10)',
  // extra colors used inline in the web app (not CSS vars, but referenced by class rules)
  streak: '#ff8c00',
  danger: '#c0392b',
  lv1: '#5b9279',
  lv2: '#2c74e8',
  lv3: '#e85c2c',
  onBlaze: '#1c1208',
} as const;

export const FONTS = {
  display: 'BebasNeue_400Regular',
  body: 'Inter_400Regular',
  bodySemiBold: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
  bodyExtraBold: 'Inter_800ExtraBold',
  mono: 'JetBrainsMono_500Medium',
  monoBold: 'JetBrainsMono_700Bold',
} as const;

export const RADIUS = {
  sm: 9,
  md: 12,
  lg: 14,
  xl: 16,
  pill: 999,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;
