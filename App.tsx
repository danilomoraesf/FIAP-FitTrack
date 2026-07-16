import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AlertProvider } from './src/context/AlertContext';
import { CollaboratorsProvider } from './src/context/CollaboratorsContext';
import { RecordsProvider } from './src/context/RecordsContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AlertProvider>
        <CollaboratorsProvider>
          <RecordsProvider>
            <RootNavigator />
            <StatusBar style="auto" />
          </RecordsProvider>
        </CollaboratorsProvider>
      </AlertProvider>
    </SafeAreaProvider>
  );
}
