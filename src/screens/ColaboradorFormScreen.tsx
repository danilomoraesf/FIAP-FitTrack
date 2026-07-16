import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '../components/CustomButton';
import { FormSection } from '../components/FormSection';
import { LabeledTextInput } from '../components/LabeledTextInput';
import { useAlert } from '../context/AlertContext';
import { useCollaborators } from '../context/useCollaborators';
import {
  CollaboratorFormValues,
  CollaboratorValidationResult,
  validateCollaboratorForm,
} from '../domain/collaboratorValidation';
import { Collaborator } from '../models/Collaborator';
import { EquipeStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { generateId } from '../utils/id';

type Props = NativeStackScreenProps<EquipeStackParamList, 'ColaboradorForm'>;

const EMPTY_FORM: CollaboratorFormValues = { name: '', role: '' };

export function ColaboradorFormScreen({ route, navigation }: Props) {
  const { alert } = useAlert();
  const { state, addCollaborator, updateCollaborator } = useCollaborators();
  const collaboratorId = route.params?.collaboratorId;
  const existing = collaboratorId ? state.collaborators.find((c) => c.id === collaboratorId) : undefined;

  const [values, setValues] = useState<CollaboratorFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<CollaboratorValidationResult['errors']>({});

  useEffect(() => {
    if (existing) {
      setValues({ name: existing.name, role: existing.role ?? '' });
    } else {
      setValues(EMPTY_FORM);
    }
    setErrors({});
  }, [existing]);

  function updateField<K extends keyof CollaboratorFormValues>(key: K, value: CollaboratorFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    const result = validateCollaboratorForm(values);
    setErrors(result.errors);
    if (!result.valid) {
      return;
    }

    const role = values.role.trim() === '' ? undefined : values.role.trim();

    if (existing) {
      const updated: Collaborator = { ...existing, name: values.name.trim(), role };
      updateCollaborator(updated);
    } else {
      const created: Collaborator = {
        id: generateId('collab'),
        name: values.name.trim(),
        role,
        createdAt: new Date().toISOString(),
      };
      addCollaborator(created);
    }

    alert('Pronto', `${values.name.trim()} foi salvo.`, () => navigation.goBack());
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <FormSection title="Dados do colaborador" icon="person">
            <LabeledTextInput
              label="Nome"
              value={values.name}
              onChangeText={(text) => updateField('name', text)}
              placeholder="Ex: Maria Silva"
              accessibilityLabel="Nome do colaborador"
              error={errors.name}
            />
            <LabeledTextInput
              label="Cargo / Departamento (opcional)"
              value={values.role}
              onChangeText={(text) => updateField('role', text)}
              placeholder="Ex: Analista de TI"
              accessibilityLabel="Cargo ou departamento do colaborador"
            />
          </FormSection>

          <CustomButton
            label="Salvar colaborador"
            onPress={handleSubmit}
            accessibilityLabel="Salvar colaborador"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
    gap: spacing.md,
  },
});
