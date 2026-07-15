import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

interface LabeledTextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  keyboardType?: KeyboardTypeOptions;
  placeholder?: string;
  accessibilityLabel: string;
  variant?: 'label' | 'sublabel';
}

export function LabeledTextInput({
  label,
  value,
  onChangeText,
  error,
  keyboardType,
  placeholder,
  accessibilityLabel,
  variant = 'label',
}: LabeledTextInputProps) {
  return (
    <View style={styles.field}>
      <Text style={variant === 'sublabel' ? styles.sublabel : styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        accessibilityLabel={accessibilityLabel}
      />
      {error ? (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  sublabel: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    fontSize: 16,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
  },
});
