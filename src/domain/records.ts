import { DailyRecord, MoodLevel } from '../models/DailyRecord';
import { DailyRecordFormValues } from './validation';

export function makeRecordKey(collaboratorId: string, date: string): string {
  return `${collaboratorId}::${date}`;
}

export function getRecordForCollaboratorDate(
  records: Record<string, DailyRecord>,
  collaboratorId: string,
  date: string
): DailyRecord | undefined {
  return records[makeRecordKey(collaboratorId, date)];
}

export function getRecordsForCollaborator(
  records: Record<string, DailyRecord>,
  collaboratorId: string
): DailyRecord[] {
  return Object.values(records).filter((record) => record.collaboratorId === collaboratorId);
}

export function sortRecordsDescending(records: DailyRecord[]): DailyRecord[] {
  return [...records].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function recordToFormValues(record: DailyRecord, fallbackExerciseType: string): DailyRecordFormValues {
  return {
    waterMl: String(record.waterMl),
    sleepHours: String(record.sleepHours),
    mood: record.mood,
    exerciseDone: record.exercise.done,
    exerciseType: record.exercise.type || fallbackExerciseType,
    exerciseDurationMin: record.exercise.durationMin ? String(record.exercise.durationMin) : '',
  };
}

export function formValuesToRecord(
  values: DailyRecordFormValues,
  collaboratorId: string,
  date: string,
  updatedAt: string
): DailyRecord {
  return {
    collaboratorId,
    date,
    waterMl: Number(values.waterMl),
    sleepHours: Number(values.sleepHours),
    mood: values.mood as MoodLevel,
    exercise: {
      done: values.exerciseDone,
      type: values.exerciseDone ? values.exerciseType : '',
      durationMin: values.exerciseDone ? Number(values.exerciseDurationMin) : 0,
    },
    updatedAt,
  };
}
