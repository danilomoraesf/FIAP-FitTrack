import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ColaboradorFormScreen } from '../screens/ColaboradorFormScreen';
import { ColaboradoresListScreen } from '../screens/ColaboradoresListScreen';
import { EquipeStackParamList } from './types';

const Stack = createNativeStackNavigator<EquipeStackParamList>();

export function EquipeNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ColaboradoresList"
        component={ColaboradoresListScreen}
        options={{ title: 'Equipe' }}
      />
      <Stack.Screen
        name="ColaboradorForm"
        component={ColaboradorFormScreen}
        options={{ title: 'Colaborador' }}
      />
    </Stack.Navigator>
  );
}
