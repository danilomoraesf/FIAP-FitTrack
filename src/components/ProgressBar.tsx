import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

interface ProgressBarProps {
  progress: number;
  label?: string;
  color?: string;
  accessibilityLabel?: string;
}

export function ProgressBar({ progress, label, color = colors.primary, accessibilityLabel }: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const percentage = Math.round(clamped * 100);

  return (
    <View style={styles.container}>
      {label ? (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.percentage}>{percentage}%</Text>
        </View>
      ) : null}
      <View
        style={styles.track}
        accessibilityRole="progressbar"
        accessibilityLabel={accessibilityLabel ?? label ?? 'Progresso'}
        accessibilityValue={{ min: 0, max: 100, now: percentage }}
      >
        <View style={[styles.fill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
  },
  percentage: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  track: {
    height: 10,
    borderRadius: radius.sm,
    backgroundColor: colors.secondary,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.sm,
  },
});
