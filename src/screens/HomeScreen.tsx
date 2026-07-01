import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, RADIUS } from '@/constants/colors';

type ToolItem = {
  title: string;
  subtitle: string;
  screen: string;
  icon: string;
  colors: { card: string; icon: string };
};

const TOOL_ITEMS: ToolItem[] = [
  {
    title: 'Pusula',
    subtitle: 'Gerçek kuzey ve yön bilgisi',
    screen: 'Compass',
    icon: 'compass-outline',
    colors: COLORS.compass,
  },
  {
    title: 'Seviye',
    subtitle: 'Yüzeylerin yataylığını kontrol et',
    screen: 'Level',
    icon: 'bar-chart-outline',
    colors: COLORS.level,
  },
  {
    title: 'Ses',
    subtitle: 'Mikrofon ile ses seviyesini izle',
    screen: 'Sound',
    icon: 'mic-outline',
    colors: COLORS.sound,
  },
  {
    title: 'Çevirici',
    subtitle: 'Uzunluk ve ölçü birimlerini dönüştür',
    screen: 'Converter',
    icon: 'swap-horizontal-outline',
    colors: COLORS.universal,
  },
  {
    title: 'Döviz',
    subtitle: 'Kur bilgilerini hızlıca kontrol et',
    screen: 'Currency',
    icon: 'cash-outline',
    colors: COLORS.currency,
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerCard}>
          <Text style={styles.eyebrow}>MeasureKit</Text>
          <Text style={styles.title}>Mobil test ekranı hazır</Text>
          <Text style={styles.subtitle}>
            Ana sayfa artık görsel olarak açılır durumda. Dokunma ve yönlendirme akışı test edilebilir.
          </Text>
        </View>

        <View style={styles.grid}>
          {TOOL_ITEMS.map((item) => (
            <TouchableOpacity
              key={item.title}
              style={[styles.toolCard, { backgroundColor: item.colors.card }]}
              activeOpacity={0.9}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={[styles.iconWrap, { backgroundColor: item.colors.icon }]}> 
                <Ionicons name={item.icon as any} size={22} color={COLORS.textPrimary} />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  headerCard: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.surfaceBorder,
    borderWidth: 1,
    borderRadius: RADIUS.xl,
    padding: 20,
    marginBottom: 16,
  },
  eyebrow: {
    color: COLORS.info,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  grid: {
    gap: 12,
  },
  toolCard: {
    borderRadius: RADIUS.lg,
    padding: 16,
    minHeight: 112,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    color: COLORS.textPrimary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 4,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 13,
    lineHeight: 18,
  },
});
