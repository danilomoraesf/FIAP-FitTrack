export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface ExerciseEntry {
  done: boolean;
  type: string;
  durationMin: number;
}

export interface DailyRecord {
  collaboratorId: string;
  date: string;
  waterMl: number;
  sleepHours: number;
  mood: MoodLevel;
  exercise: ExerciseEntry;
  updatedAt: string;
}
