import { DailyRecord } from '../models/DailyRecord';
import { getItem, setItem } from './asyncStorage';

// v2: DailyRecord gained collaboratorId (breaking shape change). Key bumped instead of
// migrating — pre-launch dev data with no way to attribute old records to a real collaborator.
const STORAGE_KEY = '@fittrack/daily_records_v2';

export async function loadRecords(): Promise<DailyRecord[]> {
  const records = await getItem<DailyRecord[]>(STORAGE_KEY);
  return records ?? [];
}

export async function saveRecords(records: DailyRecord[]): Promise<void> {
  await setItem<DailyRecord[]>(STORAGE_KEY, records);
}
