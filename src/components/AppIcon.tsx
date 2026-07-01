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
  if (lib === 'fa5') return <FontAwesome5 name={name as any} size={size} color={color} />;
  return null;
}
