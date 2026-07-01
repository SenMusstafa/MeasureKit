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
