import { makeRecordKey } from '../domain/records';
import { DailyRecord } from '../models/DailyRecord';

export interface RecordsState {
  records: Record<string, DailyRecord>;
}

export type RecordsAction =
  | { type: 'HYDRATE'; payload: DailyRecord[] }
  | { type: 'UPSERT_RECORD'; payload: DailyRecord }
  | { type: 'DELETE_RECORD'; payload: { collaboratorId: string; date: string } };

export const initialRecordsState: RecordsState = {
  records: {},
};

export function recordsReducer(state: RecordsState, action: RecordsAction): RecordsState {
  switch (action.type) {
    case 'HYDRATE': {
      const records: Record<string, DailyRecord> = {};
      for (const record of action.payload) {
        records[makeRecordKey(record.collaboratorId, record.date)] = record;
      }
      return { ...state, records };
    }
    case 'UPSERT_RECORD': {
      const key = makeRecordKey(action.payload.collaboratorId, action.payload.date);
      return {
        ...state,
        records: { ...state.records, [key]: action.payload },
      };
    }
    case 'DELETE_RECORD': {
      const key = makeRecordKey(action.payload.collaboratorId, action.payload.date);
      const records = { ...state.records };
      delete records[key];
      return { ...state, records };
    }
    default:
      return state;
  }
}
