export const COLORS = {
  // ── Uygulama zemini ──
  bg:            '#1A1A2E',
  surface:       '#2A2A40',
  surfaceBorder: '#3A3A55',

  // ── Alt navigasyon ──
  navBg:      '#1E1E30',
  navBorder:  '#333333',
  navActive:  '#7F77DD',
  navInactive:'#555555',

  // ── Metin ──
  textPrimary:   '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.52)',
  textMuted:     '#888888',
  textPlaceholder:'#666666',

  // ── Sensör kart çiftleri: [kartBg, ikonBg] ──
  compass:    { card: '#2D2860', icon: '#534AB7' },
  level:      { card: '#0D3528', icon: '#1D9E75' },
  ruler:      { card: '#3A1A10', icon: '#D85A30' },
  sound:      { card: '#0C2240', icon: '#185FA5' },
  vibration:  { card: '#1A2810', icon: '#3B6D11' },
  light:      { card: '#2A1A00', icon: '#BA7517' },

  // ── Çevirici kart çiftleri: [kartBg, ikonBg] ──
  universal:  { card: '#3A2800', icon: '#BA7517' },
  currency:   { card: '#172009', icon: '#3B6D11' },
  calculator: { card: '#2E1020', icon: '#993556' },
  time:       { card: '#252525', icon: '#5F5E5A' },

  // ── Gradient ──
  gradientStart: '#534AB7',
  gradientEnd:   '#1D9E75',

  // ── Semantik ──
  success: '#1D9E75',
  warning: '#BA7517',
  danger:  '#D85A30',
  info:    '#185FA5',
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;
