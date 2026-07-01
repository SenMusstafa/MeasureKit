# MEASUREKIT — TAM GELİŞTİRİCİ REHBERİ

> Bu tek dosya; uygulamanın tüm ekran kodlarını, tasarım sistemini,
> kurulum adımlarını ve Codespace yapılandırmasını içerir.
> Herhangi bir yapay zeka asistanına bu dosyayı ver ve "bu rehbere göre yaz" de.

---

## 0. GITHUB CODESPACE — HANGİ TEMPLATE?

### Yanıt: "Blank" template seç, sonra aşağıdaki devcontainer.json'u yapıştır.

GitHub'ın hazır React / Node template'leri Expo için **optimize değil**.
Boş template açıp `.devcontainer/devcontainer.json` dosyasını elle oluşturmak
çok daha temiz bir ortam verir.

**Adımlar:**

```
1. github.com/codespaces → "New codespace"
2. Template: "Blank" (üstteki ilk seçenek)
3. Machine type: 4-core / 8GB RAM (Expo Metro için yeterli)
4. Codespace açıldıktan sonra terminalde:
   mkdir -p .devcontainer
```

Ardından `.devcontainer/devcontainer.json` dosyasını oluştur:

```jsonc
// .devcontainer/devcontainer.json
{
  "name": "MeasureKit Dev",
  "image": "mcr.microsoft.com/devcontainers/javascript-node:20",
  "features": {
    "ghcr.io/devcontainers/features/node:1": { "version": "20" }
  },
  "forwardPorts": [8081, 19000, 19001, 19002],
  "portsAttributes": {
    "8081":  { "label": "Metro Bundler" },
    "19000": { "label": "Expo Go" },
    "19001": { "label": "Expo DevTools" }
  },
  "postCreateCommand": "npm install -g expo-cli eas-cli && npm install",
  "customizations": {
    "vscode": {
      "extensions": [
        "dbaeumer.vscode-eslint",
        "esbenp.prettier-vscode",
        "msjsdiag.vscode-react-native",
        "ms-vscode.vscode-typescript-next",
        "bradlc.vscode-tailwindcss"
      ],
      "settings": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode",
        "typescript.tsdk": "node_modules/typescript/lib"
      }
    }
  }
}
```

**Neden Blank + özel devcontainer?**

| Hazır Template | Sorun |
|---|---|
| React | Web odaklı, Metro yok, Expo eklentileri eksik |
| Node.js | Sadece sunucu, mobil araçlar yok |
| Blank + devcontainer | Node 20 + Expo CLI + port forwarding tam hazır |

**Codespace'te Expo çalıştırmak:**

```bash
# Terminal 1 — Metro bundler başlat
npx expo start --tunnel

# Expo Go uygulaması telefonunda açık olsun
# QR kodu tara → direkt cihazda çalışır
# Codespace port forwarding sayesinde tunnel gerekmeyebilir
```

---

## 1. PROJE KURULUMU

### 1.1 Proje oluştur

```bash
npx create-expo-app MeasureKit --template expo-template-blank-typescript
cd MeasureKit
```

### 1.2 Tüm paketleri kur

```bash
# Expo managed paketler
npx expo install \
  expo-sensors \
  expo-location \
  expo-av \
  expo-camera \
  expo-haptics \
  expo-clipboard \
  expo-keep-awake \
  expo-linear-gradient \
  expo-status-bar \
  react-native-safe-area-context \
  react-native-screens \
  react-native-gesture-handler \
  react-native-reanimated \
  react-native-svg

# Navigasyon
npm install \
  @react-navigation/native \
  @react-navigation/bottom-tabs \
  @react-navigation/stack

# UI & State
npm install \
  zustand \
  @react-native-async-storage/async-storage \
  @expo/vector-icons

# Grafik & Matematik
npm install \
  victory-native \
  mathjs

# i18n (gelecek için hazır)
npm install i18next react-i18next
```

### 1.3 app.json

```jsonc
{
  "expo": {
    "name": "MeasureKit",
    "slug": "measurekit",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1A1A2E"
    },
    "ios": {
      "bundleIdentifier": "com.yourname.measurekit",
      "supportsTablet": false,
      "infoPlist": {
        "NSMicrophoneUsageDescription": "Ses seviyesi ölçmek için mikrofon gereklidir.",
        "NSCameraUsageDescription": "AR uzunluk ölçümü için kamera gereklidir.",
        "NSLocationWhenInUseUsageDescription": "Gerçek kuzey hesabı için konum gereklidir.",
        "UIRequiredDeviceCapabilities": ["accelerometer", "magnetometer"]
      }
    },
    "android": {
      "package": "com.yourname.measurekit",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1A1A2E"
      },
      "permissions": [
        "RECORD_AUDIO",
        "CAMERA",
        "ACCESS_FINE_LOCATION",
        "VIBRATE"
      ]
    },
    "plugins": [
      "expo-sensors",
      "expo-location",
      "expo-av",
      "expo-camera"
    ]
  }
}
```

### 1.4 tsconfig.json

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### 1.5 Klasör yapısı

```
MeasureKit/
├── .devcontainer/
│   └── devcontainer.json
├── assets/
│   ├── icon.png
│   └── splash.png
├── src/
│   ├── constants/
│   │   ├── colors.ts        ← Renk paleti
│   │   └── tools.ts         ← Araç veri dizileri
│   ├── components/
│   │   ├── AppIcon.tsx
│   │   ├── SensorCard.tsx
│   │   ├── ConverterCard.tsx
│   │   ├── EmptyState.tsx
│   │   └── SearchBar.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── FavoritesScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   ├── CompassScreen.tsx
│   │   ├── LevelScreen.tsx
│   │   ├── SoundScreen.tsx
│   │   ├── ConverterScreen.tsx
│   │   └── CurrencyScreen.tsx
│   ├── stores/
│   │   ├── favoritesStore.ts
│   │   └── historyStore.ts
│   ├── hooks/
│   │   ├── useCompass.ts
│   │   ├── useLevel.ts
│   │   └── useDecibel.ts
│   └── utils/
│       ├── converter.ts     ← Birim çevirme hesaplamaları
│       └── units.ts         ← Tüm birim tanımları
├── App.tsx                  ← Navigasyon kökü
├── app.json
├── tsconfig.json
└── package.json
```

---

## 2. TASARIM SİSTEMİ

### 2.1 `src/constants/colors.ts`

```typescript
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
```

### 2.2 Tipografi kuralları

```
Başlık (ekran adı)  : fontSize 20, fontWeight '600'
Kart başlığı        : fontSize 14, fontWeight '600'
Kart alt başlık     : fontSize 11, lineHeight 15
Bölüm etiketi       : fontSize 11, letterSpacing 0.8, color COLORS.textMuted
Navigasyon etiketi  : fontSize 10
Tüm fontFamily      : sistem varsayılanı (San Francisco / Roboto)
```

---

## 3. KODLAR — DOSYA DOSYA

---

### App.tsx — Navigasyon kökü

```tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import HomeScreen      from '@/screens/HomeScreen';
import FavoritesScreen from '@/screens/FavoritesScreen';
import HistoryScreen   from '@/screens/HistoryScreen';
import SettingsScreen  from '@/screens/SettingsScreen';
import CompassScreen   from '@/screens/CompassScreen';
import LevelScreen     from '@/screens/LevelScreen';
import SoundScreen     from '@/screens/SoundScreen';
import ConverterScreen from '@/screens/ConverterScreen';
import CurrencyScreen  from '@/screens/CurrencyScreen';

import { COLORS } from '@/constants/colors';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

const TAB_ICONS: Record<string, string> = {
  Home:      'home-outline',
  Favorites: 'star-outline',
  History:   'time-outline',
  Settings:  'settings-outline',
};

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain"   component={HomeScreen} />
      <Stack.Screen name="Compass"    component={CompassScreen} />
      <Stack.Screen name="Level"      component={LevelScreen} />
      <Stack.Screen name="Sound"      component={SoundScreen} />
      <Stack.Screen name="Converter"  component={ConverterScreen} />
      <Stack.Screen name="Currency"   component={CurrencyScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name={(TAB_ICONS[route.name] ?? 'ellipse-outline') as any}
                  size={size}
                  color={color}
                />
              ),
              tabBarActiveTintColor:   COLORS.navActive,
              tabBarInactiveTintColor: COLORS.navInactive,
              tabBarStyle: {
                backgroundColor: COLORS.navBg,
                borderTopColor:  COLORS.navBorder,
                borderTopWidth:  0.5,
                paddingBottom:   8,
                height:          58,
              },
              tabBarLabelStyle: { fontSize: 10 },
            })}
          >
            <Tab.Screen name="Home"      component={HomeStack}      options={{ title: 'Ana Sayfa' }} />
            <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favoriler' }} />
            <Tab.Screen name="History"   component={HistoryScreen}  options={{ title: 'Geçmiş' }} />
            <Tab.Screen name="Settings"  component={SettingsScreen} options={{ title: 'Ayarlar' }} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

---

### src/constants/tools.ts — Araç veri dizileri

```typescript
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
```

---

### src/components/AppIcon.tsx

```tsx
import React from 'react';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import type { IconLib } from '@/constants/tools';

interface Props {
  lib:   IconLib;
  name:  string;
  size?: number;
  color?: string;
}

export default function AppIcon({ lib, name, size = 22, color = '#fff' }: Props) {
  if (lib === 'ion') return <Ionicons name={name as any} size={size} color={color} />;
  if (lib === 'mci') return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
  return <FontAwesome5 name={name as any} size={size - 2} color={color} />;
}
```

---

### src/components/SensorCard.tsx

```tsx
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import AppIcon from './AppIcon';
import type { Tool } from '@/constants/tools';

interface Props { tool: Tool; onPress: () => void; }

export default function SensorCard({ tool, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[s.card, { backgroundColor: tool.cardBg }]}
      onPress={onPress}
      activeOpacity={0.82}
      accessibilityLabel={tool.label}
      accessibilityHint={tool.subtitle}
    >
      <View style={[s.iconBox, { backgroundColor: tool.iconBg }]}>
        <AppIcon lib={tool.iconLib} name={tool.iconName} size={22} />
      </View>
      <Text style={s.label}>{tool.label}</Text>
      <Text style={s.subtitle}>{tool.subtitle}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card:    { width: '48%', borderRadius: 16, padding: 14, minHeight: 130 },
  iconBox: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  label:   { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  subtitle:{ color: 'rgba(255,255,255,0.52)', fontSize: 11, lineHeight: 15 },
});
```

---

### src/components/ConverterCard.tsx

```tsx
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppIcon from './AppIcon';
import type { Tool } from '@/constants/tools';

interface Props { tool: Tool; onPress: () => void; }

export default function ConverterCard({ tool, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[s.card, { backgroundColor: tool.cardBg }]}
      onPress={onPress}
      activeOpacity={0.82}
      accessibilityLabel={tool.label}
      accessibilityHint={tool.subtitle}
    >
      <View style={[s.iconBox, { backgroundColor: tool.iconBg }]}>
        <AppIcon lib={tool.iconLib} name={tool.iconName} size={22} />
      </View>
      <View style={s.textBox}>
        <Text style={s.label}>{tool.label}</Text>
        <Text style={s.subtitle} numberOfLines={2}>{tool.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.3)" />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card:    { borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 8 },
  iconBox: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  textBox: { flex: 1 },
  label:   { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 3 },
  subtitle:{ color: 'rgba(255,255,255,0.5)', fontSize: 11, lineHeight: 15 },
});
```

---

### src/components/EmptyState.tsx

```tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  icon:     string;
  title:    string;
  subtitle: string;
}

export default function EmptyState({ icon, title, subtitle }: Props) {
  return (
    <View style={s.wrap}>
      <Ionicons name={icon as any} size={52} color="#444" />
      <Text style={s.title}>{title}</Text>
      <Text style={s.subtitle}>{subtitle}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:    { alignItems: 'center', marginTop: 64, gap: 10 },
  title:   { color: '#aaa', fontSize: 16, fontWeight: '500' },
  subtitle:{ color: '#666', fontSize: 13, textAlign: 'center', paddingHorizontal: 32 },
});
```

---

### src/screens/HomeScreen.tsx — TAM KOD

```tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView,
  TouchableOpacity, StyleSheet, StatusBar, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import SensorCard    from '@/components/SensorCard';
import ConverterCard from '@/components/ConverterCard';
import EmptyState    from '@/components/EmptyState';
import { SENSOR_TOOLS, CONVERTER_TOOLS } from '@/constants/tools';
import { COLORS } from '@/constants/colors';

interface Props { navigation?: { navigate: (r: string) => void } }

export default function HomeScreen({ navigation }: Props) {
  const [search, setSearch] = useState('');

  const q = search.toLowerCase();
  const matchTool = (t: { label: string; subtitle: string }) =>
    t.label.toLowerCase().includes(q) || t.subtitle.toLowerCase().includes(q);

  const sensors    = SENSOR_TOOLS.filter(matchTool);
  const converters = CONVERTER_TOOLS.filter(matchTool);
  const isEmpty    = sensors.length === 0 && converters.length === 0;

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ── */}
        <LinearGradient
          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={s.header}
        >
          <View style={s.logoBox}>
            <Ionicons name="compass" size={26} color="#fff" />
          </View>
          <View>
            <Text style={s.appName}>MeasureKit</Text>
            <Text style={s.appSub}>Tüm ölçüm araçları bir arada</Text>
          </View>
        </LinearGradient>

        {/* ── Arama ── */}
        <View style={s.searchWrap}>
          <Ionicons name="search-outline" size={18} color={COLORS.textPlaceholder} style={{ marginRight: 8 }} />
          <TextInput
            style={s.searchInput}
            placeholder="Araç veya birim ara..."
            placeholderTextColor={COLORS.textPlaceholder}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            accessibilityLabel="Araç veya birim ara"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={COLORS.textPlaceholder} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Sensör Araçları ── */}
        {sensors.length > 0 && (
          <>
            <Text style={s.sectionLabel}>SENSÖR ARAÇLARI</Text>
            <View style={s.grid}>
              {sensors.map(t => (
                <SensorCard key={t.id} tool={t} onPress={() => navigation?.navigate(t.route)} />
              ))}
            </View>
          </>
        )}

        {/* ── Birim Çevirici ── */}
        {converters.length > 0 && (
          <>
            <Text style={[s.sectionLabel, { marginTop: 20 }]}>BİRİM ÇEVİRİCİ</Text>
            {converters.map(t => (
              <ConverterCard key={t.id} tool={t} onPress={() => navigation?.navigate(t.route)} />
            ))}
          </>
        )}

        {/* ── Boş durum ── */}
        {isEmpty && (
          <EmptyState
            icon="search-outline"
            title="Sonuç bulunamadı"
            subtitle={`"${search}" için araç bulunamadı`}
          />
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: COLORS.bg },
  scroll:     { flex: 1 },
  content:    { paddingHorizontal: 16, paddingTop: 12 },
  header:     { borderRadius: 16, paddingVertical: 18, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  logoBox:    { width: 46, height: 46, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  appName:    { color: '#fff', fontSize: 20, fontWeight: '600' },
  appSub:     { color: 'rgba(255,255,255,0.72)', fontSize: 12, marginTop: 2 },
  searchWrap: { backgroundColor: COLORS.surface, borderRadius: 12, paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 11 : 8, flexDirection: 'row', alignItems: 'center', borderWidth: 0.5, borderColor: COLORS.surfaceBorder, marginBottom: 20 },
  searchInput:{ flex: 1, color: '#ddd', fontSize: 14, padding: 0 },
  sectionLabel:{ fontSize: 11, color: COLORS.textMuted, letterSpacing: 0.8, fontWeight: '500', marginBottom: 10 },
  grid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});
```

---

### src/stores/favoritesStore.ts

```typescript
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'measurekit:favorites';

interface FavoritesState {
  favorites: string[];
  loaded:    boolean;
  load:      () => Promise<void>;
  toggle:    (id: string) => Promise<void>;
  isFav:     (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  loaded:    false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      const favorites = raw ? (JSON.parse(raw) as string[]) : [];
      set({ favorites, loaded: true });
    } catch {
      set({ loaded: true });
    }
  },

  toggle: async (id) => {
    const prev = get().favorites;
    const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
    set({ favorites: next });
    try { await AsyncStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  },

  isFav: (id) => get().favorites.includes(id),
}));
```

---

### src/stores/historyStore.ts

```typescript
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY      = 'measurekit:history';
const MAX_ITEMS = 50;

export interface HistoryEntry {
  id:        string;
  toolId:    string;
  toolLabel: string;
  openedAt:  string; // ISO string
}

interface HistoryState {
  entries: HistoryEntry[];
  load:    () => Promise<void>;
  push:    (toolId: string, toolLabel: string) => Promise<void>;
  clear:   () => Promise<void>;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  entries: [],

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      const entries = raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
      set({ entries });
    } catch {}
  },

  push: async (toolId, toolLabel) => {
    const entry: HistoryEntry = {
      id:        `${Date.now()}-${toolId}`,
      toolId,
      toolLabel,
      openedAt:  new Date().toISOString(),
    };
    const next = [entry, ...get().entries].slice(0, MAX_ITEMS);
    set({ entries: next });
    try { await AsyncStorage.setItem(KEY, JSON.stringify(next)); } catch {}
  },

  clear: async () => {
    set({ entries: [] });
    try { await AsyncStorage.removeItem(KEY); } catch {}
  },
}));
```

---

### src/hooks/useCompass.ts

```typescript
import { useEffect, useState, useRef } from 'react';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';

interface CompassState {
  heading:     number;   // 0-360, manyetik
  trueHeading: number;   // GPS gerçek kuzey
  cardinal:    string;   // "K", "KD", "D", "GD", "G", "GB", "B", "KB"
  accuracy:    'low' | 'medium' | 'high';
}

const toCardinal = (deg: number): string => {
  const dirs = ['K','KB','B','GB','G','GD','D','KD'];
  return dirs[Math.round(deg / 45) % 8];
};

export function useCompass() {
  const [state, setState] = useState<CompassState>({
    heading: 0, trueHeading: 0, cardinal: 'K', accuracy: 'low',
  });
  const subRef = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    Magnetometer.setUpdateInterval(100);

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      subRef.current = Magnetometer.addListener(({ x, y }) => {
        let heading = Math.atan2(y, x) * (180 / Math.PI);
        if (heading < 0) heading += 360;
        heading = (360 - heading) % 360;

        setState(prev => ({
          ...prev,
          heading:  Math.round(heading),
          cardinal: toCardinal(heading),
          accuracy: Math.abs(x) + Math.abs(y) > 50 ? 'high' : 'low',
        }));
      });

      // Gerçek kuzey
      const loc = await Location.getCurrentPositionAsync({});
      setState(prev => ({
        ...prev,
        trueHeading: loc.coords.heading ?? prev.heading,
      }));
    })();

    return () => { subRef.current?.remove(); };
  }, []);

  return state;
}
```

---

### src/hooks/useLevel.ts

```typescript
import { useEffect, useState, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';

interface LevelState {
  x:       number;  // -1..1
  y:       number;  // -1..1
  xAngle:  number;  // derece
  yAngle:  number;  // derece
  isLevel: boolean;
}

export function useLevel() {
  const [state, setState] = useState<LevelState>({
    x: 0, y: 0, xAngle: 0, yAngle: 0, isLevel: false,
  });
  const subRef = useRef<{ remove: () => void } | null>(null);

  useEffect(() => {
    Accelerometer.setUpdateInterval(50);
    subRef.current = Accelerometer.addListener(({ x, y, z }) => {
      const xA = Math.atan2(x, Math.sqrt(y * y + z * z)) * (180 / Math.PI);
      const yA = Math.atan2(y, Math.sqrt(x * x + z * z)) * (180 / Math.PI);
      setState({
        x, y,
        xAngle:  parseFloat(xA.toFixed(1)),
        yAngle:  parseFloat(yA.toFixed(1)),
        isLevel: Math.abs(xA) < 0.5 && Math.abs(yA) < 0.5,
      });
    });
    return () => { subRef.current?.remove(); };
  }, []);

  return state;
}
```

---

### src/hooks/useDecibel.ts

```typescript
import { useEffect, useRef, useState, useCallback } from 'react';
import { Audio } from 'expo-av';

interface DecibelState {
  db:          number;
  maxDb:       number;
  avgDb:       number;
  isRecording: boolean;
}

export function useDecibel() {
  const recRef    = useRef<Audio.Recording | null>(null);
  const histRef   = useRef<number[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [state, setState] = useState<DecibelState>({
    db: 0, maxDb: 0, avgDb: 0, isRecording: false,
  });

  const start = useCallback(async () => {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });

    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync({
      ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
      isMeteringEnabled: true,
    });
    await rec.startAsync();
    recRef.current = rec;

    intervalRef.current = setInterval(async () => {
      const status = await rec.getStatusAsync();
      if (!status.isRecording) return;
      const metering = (status as any).metering ?? -160;
      const db = Math.max(0, Math.min(120, Math.round(metering + 90)));

      histRef.current = [...histRef.current.slice(-59), db];
      const avg = Math.round(histRef.current.reduce((a, b) => a + b, 0) / histRef.current.length);

      setState(prev => ({
        db,
        maxDb: Math.max(prev.maxDb, db),
        avgDb: avg,
        isRecording: true,
      }));
    }, 200);

    setState(prev => ({ ...prev, isRecording: true }));
  }, []);

  const stop = useCallback(async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    await recRef.current?.stopAndUnloadAsync();
    recRef.current = null;
    setState(prev => ({ ...prev, isRecording: false }));
  }, []);

  const reset = useCallback(() => {
    histRef.current = [];
    setState(prev => ({ ...prev, maxDb: 0, avgDb: 0 }));
  }, []);

  useEffect(() => () => { stop(); }, [stop]);

  return { ...state, start, stop, reset };
}
```

---

### src/utils/units.ts — Birim çevirme motoru

```typescript
// Base birim: her kategori için 1 temel birim seçildi.
// toBase: değeri temel birime çevirir
// fromBase: temel birimden hedefe çevirir

export type ConvertFn = (v: number) => number;

export interface Unit {
  id:       string;
  label:    string;
  symbol:   string;
  toBase:   number | ConvertFn;
  fromBase: number | ConvertFn;
}

export interface Category {
  id:    string;
  label: string;
  icon:  string;
  units: Unit[];
}

const linear = (factor: number): [number, number] => [factor, 1 / factor];

export const CATEGORIES: Category[] = [
  {
    id: 'length', label: 'Uzunluk', icon: 'ruler',
    units: [
      { id: 'mm',   label: 'Milimetre',    symbol: 'mm',  toBase: 0.001,          fromBase: 1000 },
      { id: 'cm',   label: 'Santimetre',   symbol: 'cm',  toBase: 0.01,           fromBase: 100 },
      { id: 'm',    label: 'Metre',        symbol: 'm',   toBase: 1,              fromBase: 1 },
      { id: 'km',   label: 'Kilometre',    symbol: 'km',  toBase: 1000,           fromBase: 0.001 },
      { id: 'in',   label: 'İnç',          symbol: 'in',  toBase: 0.0254,         fromBase: 39.3701 },
      { id: 'ft',   label: 'Fit',          symbol: 'ft',  toBase: 0.3048,         fromBase: 3.28084 },
      { id: 'yd',   label: 'Yarda',        symbol: 'yd',  toBase: 0.9144,         fromBase: 1.09361 },
      { id: 'mi',   label: 'Mil',          symbol: 'mi',  toBase: 1609.344,       fromBase: 0.000621371 },
      { id: 'nmi',  label: 'Deniz Mili',   symbol: 'nmi', toBase: 1852,           fromBase: 0.000539957 },
    ],
  },
  {
    id: 'area', label: 'Alan', icon: 'square-outline',
    units: [
      { id: 'm2',   label: 'Metrekare',    symbol: 'm²',  toBase: 1,              fromBase: 1 },
      { id: 'km2',  label: 'Kilometre²',   symbol: 'km²', toBase: 1e6,            fromBase: 1e-6 },
      { id: 'cm2',  label: 'Santimetre²',  symbol: 'cm²', toBase: 0.0001,         fromBase: 10000 },
      { id: 'ha',   label: 'Hektar',       symbol: 'ha',  toBase: 10000,          fromBase: 0.0001 },
      { id: 'ac',   label: 'Dönüm',        symbol: 'ac',  toBase: 4046.856,       fromBase: 0.000247105 },
      { id: 'ft2',  label: 'Fit²',         symbol: 'ft²', toBase: 0.092903,       fromBase: 10.7639 },
      { id: 'in2',  label: 'İnç²',         symbol: 'in²', toBase: 0.00064516,     fromBase: 1550.0031 },
    ],
  },
  {
    id: 'weight', label: 'Ağırlık', icon: 'scale-balance',
    units: [
      { id: 'mg',   label: 'Miligram',     symbol: 'mg',  toBase: 0.000001,       fromBase: 1000000 },
      { id: 'g',    label: 'Gram',         symbol: 'g',   toBase: 0.001,          fromBase: 1000 },
      { id: 'kg',   label: 'Kilogram',     symbol: 'kg',  toBase: 1,              fromBase: 1 },
      { id: 't',    label: 'Ton',          symbol: 't',   toBase: 1000,           fromBase: 0.001 },
      { id: 'lb',   label: 'Libre',        symbol: 'lb',  toBase: 0.453592,       fromBase: 2.20462 },
      { id: 'oz',   label: 'Ons',          symbol: 'oz',  toBase: 0.0283495,      fromBase: 35.274 },
    ],
  },
  {
    id: 'temperature', label: 'Sıcaklık', icon: 'thermometer',
    units: [
      { id: 'c',  label: 'Celsius',    symbol: '°C', toBase: v => v,              fromBase: v => v },
      { id: 'f',  label: 'Fahrenheit', symbol: '°F', toBase: v => (v - 32) * 5/9, fromBase: v => v * 9/5 + 32 },
      { id: 'k',  label: 'Kelvin',     symbol: 'K',  toBase: v => v - 273.15,     fromBase: v => v + 273.15 },
    ],
  },
  {
    id: 'speed', label: 'Hız', icon: 'speedometer',
    units: [
      { id: 'ms',   label: 'm/s',         symbol: 'm/s',   toBase: 1,          fromBase: 1 },
      { id: 'kmh',  label: 'km/s',        symbol: 'km/h',  toBase: 1/3.6,      fromBase: 3.6 },
      { id: 'mph',  label: 'mil/s',       symbol: 'mph',   toBase: 0.44704,    fromBase: 2.23694 },
      { id: 'kt',   label: 'Knot',        symbol: 'kt',    toBase: 0.514444,   fromBase: 1.94384 },
      { id: 'mach', label: 'Mach',        symbol: 'Mach',  toBase: 340.3,      fromBase: 1/340.3 },
    ],
  },
  {
    id: 'data', label: 'Veri', icon: 'server',
    units: [
      { id: 'bit', label: 'Bit',      symbol: 'bit', toBase: 1,           fromBase: 1 },
      { id: 'B',   label: 'Byte',     symbol: 'B',   toBase: 8,           fromBase: 1/8 },
      { id: 'KB',  label: 'Kilobyte', symbol: 'KB',  toBase: 8192,        fromBase: 1/8192 },
      { id: 'MB',  label: 'Megabyte', symbol: 'MB',  toBase: 8388608,     fromBase: 1/8388608 },
      { id: 'GB',  label: 'Gigabyte', symbol: 'GB',  toBase: 8589934592,  fromBase: 1/8589934592 },
      { id: 'TB',  label: 'Terabyte', symbol: 'TB',  toBase: 8796093022208, fromBase: 1/8796093022208 },
    ],
  },
];

// ── Çevirme fonksiyonu ──────────────────────────────────────────────────────

export function convert(value: number, fromId: string, toId: string, categoryId: string): number {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return value;

  const from = cat.units.find(u => u.id === fromId);
  const to   = cat.units.find(u => u.id === toId);
  if (!from || !to) return value;

  const baseValue = typeof from.toBase === 'function'
    ? from.toBase(value)
    : value * from.toBase;

  const result = typeof to.fromBase === 'function'
    ? to.fromBase(baseValue)
    : baseValue * to.fromBase;

  // Makul hassasiyet
  return parseFloat(result.toPrecision(8));
}
```

---

### src/screens/CompassScreen.tsx

```tsx
import React, { useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useCompass } from '@/hooks/useCompass';
import { COLORS } from '@/constants/colors';

interface Props { navigation?: { goBack: () => void } }

export default function CompassScreen({ navigation }: Props) {
  const { heading, trueHeading, cardinal, accuracy } = useCompass();
  const rotAnim = useRef(new Animated.Value(0)).current;
  const prevHeading = useRef(heading);

  useEffect(() => {
    let delta = heading - prevHeading.current;
    if (delta > 180)  delta -= 360;
    if (delta < -180) delta += 360;
    prevHeading.current = heading;

    Animated.spring(rotAnim, {
      toValue: (rotAnim as any)._value + delta,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0,
    }).start();
  }, [heading]);

  const rotate = rotAnim.interpolate({
    inputRange: [-360, 360],
    outputRange: ['-360deg', '360deg'],
  });

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={s.title}>Pusula</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={s.center}>
        <Animated.View style={[s.dialWrap, { transform: [{ rotate }] }]}>
          {/* Pusula gül çizimi: SVG yerine basit Text label'lar */}
          {['K','KD','D','GD','G','GB','B','KB'].map((dir, i) => {
            const angle = (i * 45 * Math.PI) / 180;
            const r = 110;
            const x = Math.sin(angle) * r;
            const y = -Math.cos(angle) * r;
            return (
              <Text
                key={dir}
                style={[
                  s.dirLabel,
                  { transform: [{ translateX: x }, { translateY: y }] },
                  dir === 'K' && { color: COLORS.danger, fontWeight: '700' },
                ]}
              >
                {dir}
              </Text>
            );
          })}
          {/* Kadran dairesi */}
          <View style={s.dial} />
        </Animated.View>

        {/* Sabit kuzey ibresi */}
        <View style={s.needle} pointerEvents="none">
          <View style={s.needleUp} />
          <View style={s.needleDown} />
        </View>
      </View>

      {/* Değerler */}
      <View style={s.info}>
        <Text style={s.headingText}>{heading}°</Text>
        <Text style={s.cardinalText}>{cardinal}</Text>

        <View style={s.row}>
          <View style={s.infoCard}>
            <Text style={s.infoLabel}>Manyetik</Text>
            <Text style={s.infoValue}>{heading}°</Text>
          </View>
          <View style={s.infoCard}>
            <Text style={s.infoLabel}>Gerçek Kuzey</Text>
            <Text style={s.infoValue}>{trueHeading}°</Text>
          </View>
          <View style={s.infoCard}>
            <Text style={s.infoLabel}>Hassasiyet</Text>
            <Text style={[s.infoValue, { color: accuracy === 'high' ? COLORS.success : COLORS.warning }]}>
              {accuracy === 'high' ? 'İyi' : 'Düşük'}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: COLORS.bg },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title:       { color: '#fff', fontSize: 18, fontWeight: '600' },
  center:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
  dialWrap:    { width: 280, height: 280, alignItems: 'center', justifyContent: 'center' },
  dial:        { position: 'absolute', width: 240, height: 240, borderRadius: 120, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.15)' },
  dirLabel:    { position: 'absolute', color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  needle:      { position: 'absolute', alignItems: 'center' },
  needleUp:    { width: 3, height: 50, backgroundColor: COLORS.danger, borderRadius: 2 },
  needleDown:  { width: 3, height: 50, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 2 },
  info:        { padding: 24, alignItems: 'center' },
  headingText: { color: '#fff', fontSize: 56, fontWeight: '200', letterSpacing: -2 },
  cardinalText:{ color: COLORS.navActive, fontSize: 22, fontWeight: '600', marginBottom: 24 },
  row:         { flexDirection: 'row', gap: 10, width: '100%' },
  infoCard:    { flex: 1, backgroundColor: COLORS.surface, borderRadius: 12, padding: 12, alignItems: 'center' },
  infoLabel:   { color: COLORS.textMuted, fontSize: 10, marginBottom: 4 },
  infoValue:   { color: '#fff', fontSize: 14, fontWeight: '600' },
});
```

---

### src/screens/LevelScreen.tsx

```tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useLevel } from '@/hooks/useLevel';
import { COLORS } from '@/constants/colors';

const CONTAINER = 200;
const BUBBLE    = 44;
const MAX_OFFSET = (CONTAINER - BUBBLE) / 2 - 6;

interface Props { navigation?: { goBack: () => void } }

export default function LevelScreen({ navigation }: Props) {
  const { x, y, xAngle, yAngle, isLevel } = useLevel();
  const bx = useSharedValue(0);
  const by = useSharedValue(0);

  useEffect(() => {
    const clamp = (v: number) => Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, v));
    bx.value = withSpring(clamp(x * MAX_OFFSET * 2), { damping: 15, stiffness: 150 });
    by.value = withSpring(clamp(-y * MAX_OFFSET * 2), { damping: 15, stiffness: 150 });

    if (isLevel) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [x, y, isLevel]);

  const bubbleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: bx.value }, { translateY: by.value }],
    backgroundColor: isLevel ? COLORS.success : COLORS.danger,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    borderColor: isLevel ? COLORS.success : 'rgba(255,255,255,0.15)',
  }));

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={s.title}>Su Terazisi</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={s.center}>
        <Animated.View style={[s.ring, ringStyle]}>
          {/* Yatay + dikey çizgi */}
          <View style={s.crossH} />
          <View style={s.crossV} />
          <Animated.View style={[s.bubble, bubbleStyle]} />
        </Animated.View>
        <Text style={[s.levelMsg, { color: isLevel ? COLORS.success : '#aaa' }]}>
          {isLevel ? '✓ Düz' : 'Hizalanıyor...'}
        </Text>
      </View>

      <View style={s.angles}>
        <View style={s.angleCard}>
          <Text style={s.angleLabel}>Sol / Sağ</Text>
          <Text style={s.angleValue}>{xAngle}°</Text>
        </View>
        <View style={s.angleCard}>
          <Text style={s.angleLabel}>Ön / Arka</Text>
          <Text style={s.angleValue}>{yAngle}°</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: COLORS.bg },
  header:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title:      { color: '#fff', fontSize: 18, fontWeight: '600' },
  center:     { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 20 },
  ring:       { width: CONTAINER, height: CONTAINER, borderRadius: CONTAINER / 2, borderWidth: 2, borderColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.04)' },
  crossH:     { position: 'absolute', width: '80%', height: 0.5, backgroundColor: 'rgba(255,255,255,0.1)' },
  crossV:     { position: 'absolute', height: '80%', width: 0.5, backgroundColor: 'rgba(255,255,255,0.1)' },
  bubble:     { width: BUBBLE, height: BUBBLE, borderRadius: BUBBLE / 2, opacity: 0.9 },
  levelMsg:   { fontSize: 16, fontWeight: '600' },
  angles:     { flexDirection: 'row', gap: 12, padding: 24 },
  angleCard:  { flex: 1, backgroundColor: COLORS.surface, borderRadius: 14, padding: 16, alignItems: 'center' },
  angleLabel: { color: COLORS.textMuted, fontSize: 12, marginBottom: 6 },
  angleValue: { color: '#fff', fontSize: 28, fontWeight: '200' },
});
```

---

### src/screens/ConverterScreen.tsx — Evrensel Birim Çevirici

```tsx
import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  ScrollView, Modal, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES, convert, type Unit } from '@/utils/units';
import { COLORS } from '@/constants/colors';

interface Props { navigation?: { goBack: () => void } }

export default function ConverterScreen({ navigation }: Props) {
  const [categoryIdx, setCategoryIdx] = useState(0);
  const [fromUnit,    setFromUnit]    = useState(0);
  const [toUnit,      setToUnit]      = useState(1);
  const [value,       setValue]       = useState('1');
  const [modal,       setModal]       = useState<'from' | 'to' | 'cat' | null>(null);

  const category = CATEGORIES[categoryIdx];
  const from     = category.units[fromUnit];
  const to       = category.units[toUnit];

  const result = (() => {
    const n = parseFloat(value);
    if (isNaN(n)) return '—';
    const r = convert(n, from.id, to.id, category.id);
    return r.toLocaleString('tr-TR', { maximumFractionDigits: 8 });
  })();

  const swap = () => { setFromUnit(toUnit); setToUnit(fromUnit); };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={s.catBtn} onPress={() => setModal('cat')}>
          <Text style={s.catLabel}>{category.label}</Text>
          <Ionicons name="chevron-down" size={14} color={COLORS.navActive} />
        </TouchableOpacity>
        <View style={{ width: 24 }} />
      </View>

      {/* From */}
      <View style={s.card}>
        <TouchableOpacity style={s.unitRow} onPress={() => setModal('from')}>
          <Text style={s.unitSymbol}>{from.symbol}</Text>
          <Text style={s.unitLabel}>{from.label}</Text>
          <Ionicons name="chevron-down" size={14} color={COLORS.textMuted} />
        </TouchableOpacity>
        <TextInput
          style={s.valueInput}
          value={value}
          onChangeText={setValue}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={COLORS.textMuted}
        />
      </View>

      {/* Swap */}
      <TouchableOpacity style={s.swapBtn} onPress={swap}>
        <Ionicons name="swap-vertical" size={20} color="#fff" />
      </TouchableOpacity>

      {/* To */}
      <View style={[s.card, { marginTop: 4 }]}>
        <TouchableOpacity style={s.unitRow} onPress={() => setModal('to')}>
          <Text style={s.unitSymbol}>{to.symbol}</Text>
          <Text style={s.unitLabel}>{to.label}</Text>
          <Ionicons name="chevron-down" size={14} color={COLORS.textMuted} />
        </TouchableOpacity>
        <Text style={s.resultText}>{result}</Text>
      </View>

      {/* Kategori Modal */}
      <Modal visible={modal === 'cat'} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <Text style={s.modalTitle}>Kategori Seç</Text>
            <FlatList
              data={CATEGORIES}
              keyExtractor={c => c.id}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={s.modalItem}
                  onPress={() => { setCategoryIdx(index); setFromUnit(0); setToUnit(1); setModal(null); }}
                >
                  <Text style={[s.modalItemText, index === categoryIdx && { color: COLORS.navActive }]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Birim Modal */}
      <Modal visible={modal === 'from' || modal === 'to'} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalSheet}>
            <Text style={s.modalTitle}>{modal === 'from' ? 'Kaynak Birim' : 'Hedef Birim'}</Text>
            <FlatList
              data={category.units}
              keyExtractor={u => u.id}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={s.modalItem}
                  onPress={() => {
                    modal === 'from' ? setFromUnit(index) : setToUnit(index);
                    setModal(null);
                  }}
                >
                  <Text style={s.modalItemText}>{item.label}</Text>
                  <Text style={s.modalItemSub}>{item.symbol}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: COLORS.bg },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  catBtn:      { flexDirection: 'row', alignItems: 'center', gap: 4 },
  catLabel:    { color: '#fff', fontSize: 17, fontWeight: '600' },
  card:        { marginHorizontal: 16, backgroundColor: COLORS.surface, borderRadius: 16, padding: 16 },
  unitRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  unitSymbol:  { color: COLORS.navActive, fontSize: 20, fontWeight: '600', minWidth: 40 },
  unitLabel:   { color: COLORS.textMuted, fontSize: 13, flex: 1 },
  valueInput:  { color: '#fff', fontSize: 36, fontWeight: '200', padding: 0 },
  resultText:  { color: '#fff', fontSize: 36, fontWeight: '200' },
  swapBtn:     { alignSelf: 'center', marginVertical: 8, width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.navActive, alignItems: 'center', justifyContent: 'center' },
  modalOverlay:{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalSheet:  { backgroundColor: '#1E1E30', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '70%' },
  modalTitle:  { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  modalItem:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: '#333' },
  modalItemText:{ color: '#ddd', fontSize: 15 },
  modalItemSub: { color: COLORS.textMuted, fontSize: 13 },
});
```

---

## 4. CODESPACE'TE ADIM ADIM ÇALIŞTIRILMASI

```bash
# 1. Projeyi klonla / oluştur
git clone https://github.com/senin/measurekit.git
cd measurekit

# Veya Codespace içinde:
npx create-expo-app MeasureKit --template expo-template-blank-typescript
cd MeasureKit

# 2. Bağımlılıkları kur (yukarıdaki Bölüm 1.2)
npx expo install expo-sensors expo-location expo-av expo-camera \
  expo-haptics expo-clipboard expo-keep-awake expo-linear-gradient \
  react-native-safe-area-context react-native-screens \
  react-native-gesture-handler react-native-reanimated react-native-svg

npm install @react-navigation/native @react-navigation/bottom-tabs \
  @react-navigation/stack zustand \
  @react-native-async-storage/async-storage \
  @expo/vector-icons victory-native mathjs

# 3. Dosyaları oluştur (Bölüm 3'teki her kodu ilgili dosyaya yapıştır)

# 4. Expo başlat
npx expo start --tunnel
# → QR kodu tara, Expo Go uygulamasında aç

# 5. TypeScript kontrol
npx tsc --noEmit
```

---

## 5. ÖNEMLİ NOTLAR

**Neden `--tunnel` kullanıyoruz?**
Codespace'in public IP'si dinamik olduğundan Expo Go doğrudan bağlanamaz.
`--tunnel` ngrok üzerinden güvenli bir köprü oluşturur.

**Sensörler Codespace'te çalışmaz** — Manyetometre, ivmeölçer gibi donanım
sensörleri yalnızca gerçek cihazda veya Expo Go ile fiziksel telefonda çalışır.
Codespace sadece kod editörü olarak kullanılır.

**Ekle & çalıştır sırası:**
1. Önce `src/constants/colors.ts` ve `src/constants/tools.ts`
2. Sonra `src/components/` altındaki bileşenler
3. Sonra `src/hooks/` altındaki hook'lar
4. Sonra `src/utils/units.ts`
5. En son `src/screens/` altındaki ekranlar ve `App.tsx`

Bu sırayı takip edersen import hataları oluşmaz.