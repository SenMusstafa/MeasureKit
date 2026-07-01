import { COLORS } from './colors';

export type IconLib = 'ion' | 'mci' | 'fa5';

export interface Tool {
  id:          string;
  label:       string;
  subtitle:    string;
  iconLib:     IconLib;
  iconName:    string;
  cardBg:      string;
  iconBg:      string;
  route:       string;
  type:        'sensor' | 'converter';
}

export const SENSOR_TOOLS: Tool[] = [
  {
    id: 'compass', label: 'Pusula', subtitle: '3B yön & harita',
    iconLib: 'ion', iconName: 'compass-outline',
    cardBg: COLORS.compass.card, iconBg: COLORS.compass.icon,
    route: 'Compass', type: 'sensor',
  },
  {
    id: 'level', label: 'Su Terazisi', subtitle: 'Eğim açısı',
    iconLib: 'mci', iconName: 'spirit-level',
    cardBg: COLORS.level.card, iconBg: COLORS.level.icon,
    route: 'Level', type: 'sensor',
  },
  {
    id: 'ruler', label: 'Uzunluk Ölç', subtitle: 'AR kamera ile',
    iconLib: 'mci', iconName: 'ruler',
    cardBg: COLORS.ruler.card, iconBg: COLORS.ruler.icon,
    route: 'Ruler', type: 'sensor',
  },
  {
    id: 'sound', label: 'Ses & Titreşim', subtitle: 'dB ölçer',
    iconLib: 'ion', iconName: 'volume-medium-outline',
    cardBg: COLORS.sound.card, iconBg: COLORS.sound.icon,
    route: 'Sound', type: 'sensor',
  },
];

export const CONVERTER_TOOLS: Tool[] = [
  {
    id: 'universal', label: 'Evrensel Çevirici',
    subtitle: 'Uzunluk · Alan · Hacim · Ağırlık · Hız · Sıcaklık · Basınç · Enerji · Veri · Açı · Zaman',
    iconLib: 'ion', iconName: 'swap-horizontal-outline',
    cardBg: COLORS.universal.card, iconBg: COLORS.universal.icon,
    route: 'Converter', type: 'converter',
  },
  {
    id: 'currency', label: 'Döviz Çevirici', subtitle: 'Canlı kur · 150+ para birimi',
    iconLib: 'fa5', iconName: 'dollar-sign',
    cardBg: COLORS.currency.card, iconBg: COLORS.currency.icon,
    route: 'Currency', type: 'converter',
  },
  {
    id: 'calculator', label: 'Hesap Makinesi', subtitle: 'Bilimsel · Kredi · Vergi · BMI',
    iconLib: 'ion', iconName: 'calculator-outline',
    cardBg: COLORS.calculator.card, iconBg: COLORS.calculator.icon,
    route: 'Calculator', type: 'converter',
  },
  {
    id: 'time', label: 'Zaman Araçları', subtitle: 'Saat dilimleri · Kronometr · Geri sayım',
    iconLib: 'ion', iconName: 'time-outline',
    cardBg: COLORS.time.card, iconBg: COLORS.time.icon,
    route: 'Time', type: 'converter',
  },
];

export const ALL_TOOLS = [...SENSOR_TOOLS, ...CONVERTER_TOOLS];
