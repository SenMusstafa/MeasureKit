import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, RADIUS } from '@/constants/colors';

export default function LevelScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        <Text style={styles.backText}>Geri</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Seviye</Text>
        <Text style={styles.body}>Seviye ölçüm ekranı burada hazır bekliyor. Hasar görmemesi için görsel kurgusu tamamlandı.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, padding: 20 },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  backText: { color: COLORS.textPrimary, marginLeft: 8, fontSize: 16 },
  card: { backgroundColor: COLORS.surface, borderColor: COLORS.surfaceBorder, borderWidth: 1, borderRadius: RADIUS.lg, padding: 20 },
  title: { color: COLORS.textPrimary, fontSize: 22, fontWeight: '700', marginBottom: 8 },
  body: { color: COLORS.textSecondary, fontSize: 14, lineHeight: 20 },
});
