import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useDecibel } from '@/hooks/useDecibel';
import { COLORS } from '@/constants/colors';

interface Props { navigation?: { goBack: () => void } }

export default function SoundScreen({ navigation }: Props) {
  const { db, maxDb, avgDb, isRecording, start, stop } = useDecibel();

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={s.title}>Ses Ölçer</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={s.center}>
        <Text style={s.db}>{db} dB</Text>
        <TouchableOpacity 
          style={[s.btn, { backgroundColor: isRecording ? COLORS.danger : COLORS.success }]} 
          onPress={isRecording ? stop : start}
        >
          <Text style={s.btnText}>{isRecording ? 'Durdur' : 'Başlat'}</Text>
        </TouchableOpacity>
      </View>

      <View style={s.stats}>
        <View style={s.stat}>
          <Text style={s.label}>Max</Text>
          <Text style={s.val}>{maxDb} dB</Text>
        </View>
        <View style={s.stat}>
          <Text style={s.label}>Ortalama</Text>
          <Text style={s.val}>{avgDb} dB</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title:  { color: '#fff', fontSize: 18, fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 32 },
  db:     { color: '#fff', fontSize: 72, fontWeight: '200' },
  btn:    { paddingHorizontal: 32, paddingVertical: 16, borderRadius: 30 },
  btnText:{ color: '#fff', fontSize: 16, fontWeight: '600' },
  stats:  { flexDirection: 'row', justifyContent: 'space-around', padding: 24 },
  stat:   { alignItems: 'center' },
  label:  { color: COLORS.textMuted, fontSize: 12 },
  val:    { color: '#fff', fontSize: 20, fontWeight: '600' },
});
