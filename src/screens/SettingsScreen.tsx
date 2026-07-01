import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/colors';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <Text style={s.title}>Ayarlar</Text>
      </View>
      <View style={s.content}>
        <Text style={s.text}>Tema, bildirim ve izin ayarları burada yönetilebilir. Görsel katman hazır.</Text>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { padding: 16 },
  title: { color: COLORS.textPrimary, fontSize: 24, fontWeight: '700' },
  content: { padding: 16 },
  text: { color: COLORS.textSecondary, fontSize: 16, lineHeight: 22 },
});
