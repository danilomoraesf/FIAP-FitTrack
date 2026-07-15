import { Picker } from '@react-native-picker/picker';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Collaborator } from '../models/Collaborator';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

interface CollaboratorPickerProps {
  collaborators: Collaborator[];
  activeCollaboratorId: string | null;
  onChange: (id: string) => void;
}

export function CollaboratorPicker({ collaborators, activeCollaboratorId, onChange }: CollaboratorPickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Colaborador</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={activeCollaboratorId ?? undefined}
          onValueChange={(itemValue) => onChange(String(itemValue))}
          accessibilityLabel="Selecionar colaborador ativo"
        >
          {collaborators.map((collaborator) => (
            <Picker.Item key={collaborator.id} label={collaborator.name} value={collaborator.id} />
          ))}
        </Picker>
      </View>
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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
});
