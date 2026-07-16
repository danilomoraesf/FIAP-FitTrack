import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Collaborator } from '../models/Collaborator';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Dropdown } from './Dropdown';

interface CollaboratorPickerProps {
  collaborators: Collaborator[];
  activeCollaboratorId: string | null;
  onChange: (id: string) => void;
}

export function CollaboratorPicker({ collaborators, activeCollaboratorId, onChange }: CollaboratorPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Colaborador</Text>
      <Dropdown
        options={collaborators.map((collaborator) => ({ label: collaborator.name, value: collaborator.id }))}
        value={activeCollaboratorId}
        onChange={onChange}
        accessibilityLabel="Selecionar colaborador ativo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
