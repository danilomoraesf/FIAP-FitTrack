import { MoodLevel } from '../models/DailyRecord';

export interface DailyRecordFormValues {
  waterMl: string;
  sleepHours: string;
  mood: MoodLevel | null;
  exerciseDone: boolean;
  exerciseType: string;
  exerciseDurationMin: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof DailyRecordFormValues, string>>;
}

export function validateDailyRecordForm(values: DailyRecordFormValues): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  const water = Number(values.waterMl);
  if (values.waterMl.trim() === '' || Number.isNaN(water)) {
    errors.waterMl = 'Quanto de água você bebeu hoje?';
  } else if (water <= 0 || water > 10000) {
    errors.waterMl = 'Esse valor não parece certo, tente entre 1 e 10000 ml.';
  }

  const sleep = Number(values.sleepHours);
  if (values.sleepHours.trim() === '' || Number.isNaN(sleep)) {
    errors.sleepHours = 'Quantas horas você dormiu?';
  } else if (sleep < 0 || sleep > 24) {
    errors.sleepHours = 'O valor precisa ficar entre 0 e 24 horas.';
  }

  if (values.mood === null) {
    errors.mood = 'Como você está se sentindo hoje?';
  }

  if (values.exerciseDone) {
    const duration = Number(values.exerciseDurationMin);
    if (values.exerciseDurationMin.trim() === '' || Number.isNaN(duration) || duration <= 0) {
      errors.exerciseDurationMin = 'Quanto tempo durou o exercício?';
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
