import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/constants/colors';

export default function HistoryScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>Geçmiş</Text>
      </View>
      <View style={s.center}>
        <Ionicons name="time-outline" size={64} color={COLORS.info} />
        <Text style={s.text}>Henüz geçmiş kaydı yok</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 16 },
  title: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 16 },
  text: { color: COLORS.textSecondary, fontSize: 16, textAlign: 'center' },
});
