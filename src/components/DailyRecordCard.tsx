import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { computeExerciseProgress, computeSleepProgress, computeWaterProgress } from '../domain/progress';
import { countGoalsMet, isDailyGoalMet } from '../domain/goals';
import { DailyRecord } from '../models/DailyRecord';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import { formatDisplayDate } from '../utils/date';
import { Card } from './Card';
import { ProgressBar } from './ProgressBar';

interface DailyRecordCardProps {
  record: DailyRecord;
  onPress?: () => void;
  onDelete?: () => void;
}

export function DailyRecordCard({ record, onPress, onDelete }: DailyRecordCardProps) {
  const goalMet = isDailyGoalMet(record);
  const goalsMetCount = countGoalsMet(record);
  const cardLabel = `Registro de ${formatDisplayDate(record.date)}, ${goalsMetCount} de 3 metas atingidas`;

  const body = (
    <>
      <View style={styles.header}>
        <Text style={styles.date}>{formatDisplayDate(record.date)}</Text>
        <View style={onDelete ? [styles.headerRight, styles.headerRightWithDelete] : styles.headerRight}>
          {goalMet ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Metas batidas ✓</Text>
            </View>
          ) : (
            <Text style={styles.goalsCount}>{goalsMetCount}/3 metas</Text>
          )}
        </View>
      </View>

      <View style={styles.progressGroup}>
        <ProgressBar
          label="Água"
          color={colors.water}
          progress={computeWaterProgress(record.waterMl)}
          accessibilityLabel={`Progresso de água: ${record.waterMl} mililitros`}
        />
        <ProgressBar
          label="Sono"
          color={colors.sleep}
          progress={computeSleepProgress(record.sleepHours)}
          accessibilityLabel={`Progresso de sono: ${record.sleepHours} horas`}
        />
        <ProgressBar
          label="Exercício"
          color={colors.exercise}
          progress={computeExerciseProgress(record.exercise)}
          accessibilityLabel={
            record.exercise.done
              ? `Progresso de exercício: ${record.exercise.type}, ${record.exercise.durationMin} minutos`
              : 'Nenhum exercício registrado'
          }
        />
      </View>
    </>
  );

  return (
    <Card style={goalMet ? styles.highlighted : undefined}>
      {onDelete ? (
        <Pressable
          onPress={onDelete}
          accessibilityRole="button"
          accessibilityLabel={`Excluir registro de ${formatDisplayDate(record.date)}`}
          hitSlop={8}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={18} color={colors.danger} />
        </Pressable>
      ) : null}
      {onPress ? (
        <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={cardLabel}>
          {body}
        </Pressable>
      ) : (
        body
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerRightWithDelete: {
    marginRight: spacing.xl,
  },
  deleteButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    padding: spacing.xs / 2,
    zIndex: 1,
  },
  date: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  goalsCount: {
    fontSize: 13,
    color: colors.textMuted,
  },
  badge: {
    backgroundColor: colors.successBackground,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.sm,
  },
  badgeText: {
    color: colors.success,
    fontWeight: '700',
    fontSize: 12,
  },
  progressGroup: {
    gap: spacing.sm,
  },
  highlighted: {
    borderColor: colors.success,
    borderWidth: 2,
  },
});
