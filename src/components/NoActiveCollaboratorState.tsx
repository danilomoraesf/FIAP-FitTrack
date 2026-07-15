import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { CustomButton } from './CustomButton';

interface NoActiveCollaboratorStateProps {
  onNavigateToEquipe: () => void;
}

export function NoActiveCollaboratorState({ onNavigateToEquipe }: NoActiveCollaboratorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nenhum colaborador por aqui ainda</Text>
      <Text style={styles.subtitle}>
        Cadastre alguém na aba Equipe para começar a acompanhar os hábitos de saúde.
      </Text>
      <CustomButton
        label="Ir para Equipe"
        onPress={onNavigateToEquipe}
        accessibilityLabel="Ir para a aba Equipe para cadastrar um colaborador"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
