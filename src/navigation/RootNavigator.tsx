import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { DailyLogScreen } from '../screens/DailyLogScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { colors } from '../theme/colors';
import { EquipeNavigator } from './EquipeNavigator';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICONS: Record<keyof RootTabParamList, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Registro: 'add-circle',
  Historico: 'time',
  Equipe: 'people',
};

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarAccessibilityLabel: route.name,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={TAB_ICONS[route.name as keyof RootTabParamList]} color={color} size={size} />
          ),
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
        <Tab.Screen
          name="Registro"
          component={DailyLogScreen}
          options={{ title: 'Registro' }}
          listeners={({ navigation }) => ({
            tabPress: () => navigation.setParams({ date: undefined }),
          })}
        />
        <Tab.Screen name="Historico" component={HistoryScreen} options={{ title: 'Histórico' }} />
        <Tab.Screen name="Equipe" component={EquipeNavigator} options={{ title: 'Equipe' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
