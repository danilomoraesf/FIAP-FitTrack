import { Ionicons } from '@expo/vector-icons';
import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { Card } from './Card';

interface FormSectionProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: ReactNode;
  accessibilityLabel?: string;
}

export function FormSection({ title, icon, children, accessibilityLabel }: FormSectionProps) {
  return (
    <Card>
      <View
        style={styles.header}
        accessibilityRole="header"
        accessibilityLabel={accessibilityLabel ?? title}
      >
        <Ionicons name={icon} size={20} color={colors.primary} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.content}>{children}</View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    gap: spacing.sm,
  },
});
