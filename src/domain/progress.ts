import { ExerciseEntry } from '../models/DailyRecord';
import { DAILY_GOALS } from '../models/Goals';

export function computeWaterProgress(waterMl: number, goalMl: number = DAILY_GOALS.waterMl): number {
  if (goalMl <= 0) return 0;
  return Math.min(1, Math.max(0, waterMl / goalMl));
}

export function computeSleepProgress(sleepHours: number, goalHours: number = DAILY_GOALS.sleepHours): number {
  if (goalHours <= 0) return 0;
  return Math.min(1, Math.max(0, sleepHours / goalHours));
}

export function computeExerciseProgress(
  exercise: ExerciseEntry,
  goalMinutes: number = DAILY_GOALS.exerciseMinMinutes
): number {
  if (!exercise.done || goalMinutes <= 0) return 0;
  return Math.min(1, Math.max(0, exercise.durationMin / goalMinutes));
}
