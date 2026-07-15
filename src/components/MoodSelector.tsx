import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MoodLevel } from '../models/DailyRecord';
import { colors } from '../theme/colors';
import { radius } from '../theme/spacing';

interface MoodOption {
  level: MoodLevel;
  emoji: string;
  label: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  { level: 1, emoji: '🫠', label: 'Muito ruim' },
  { level: 2, emoji: '😕', label: 'Ruim' },
  { level: 3, emoji: '😶', label: 'Neutro' },
  { level: 4, emoji: '🙂', label: 'Bom' },
  { level: 5, emoji: '✨', label: 'Ótimo' },
];

interface MoodSelectorProps {
  value: MoodLevel | null;
  onChange: (mood: MoodLevel) => void;
  accessibilityLabel?: string;
}

export function MoodSelector({ value, onChange, accessibilityLabel }: MoodSelectorProps) {
  return (
    <View
      style={styles.row}
      accessibilityLabel={accessibilityLabel ?? 'Como você está se sentindo, de 1 a 5'}
    >
      {MOOD_OPTIONS.map((option) => {
        const selected = value === option.level;
        return (
          <Pressable
            key={option.level}
            onPress={() => onChange(option.level)}
            accessibilityRole="button"
            accessibilityLabel={`Humor ${option.level}: ${option.label}`}
            accessibilityState={{ selected }}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Text style={styles.emoji}>{option.emoji}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  option: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  emoji: {
    fontSize: 24,
  },
});
