import { DailyRecord, ExerciseEntry } from '../models/DailyRecord';
import { DAILY_GOALS } from '../models/Goals';

function isWaterGoalMet(waterMl: number): boolean {
  return waterMl >= DAILY_GOALS.waterMl;
}

function isSleepGoalMet(sleepHours: number): boolean {
  return sleepHours >= DAILY_GOALS.sleepHours;
}

function isExerciseGoalMet(exercise: ExerciseEntry): boolean {
  return exercise.done && exercise.durationMin >= DAILY_GOALS.exerciseMinMinutes;
}

export function isDailyGoalMet(record: DailyRecord): boolean {
  return (
    isWaterGoalMet(record.waterMl) &&
    isSleepGoalMet(record.sleepHours) &&
    isExerciseGoalMet(record.exercise)
  );
}

export function countGoalsMet(record: DailyRecord): number {
  return [
    isWaterGoalMet(record.waterMl),
    isSleepGoalMet(record.sleepHours),
    isExerciseGoalMet(record.exercise),
  ].filter(Boolean).length;
}
