import React, { createContext, ReactNode, useEffect, useReducer, useRef } from 'react';
import { DailyRecord } from '../models/DailyRecord';
import * as recordsRepository from '../storage/recordsRepository';
import { initialRecordsState, recordsReducer, RecordsState } from './recordsReducer';

export interface RecordsContextValue {
  state: RecordsState;
  upsertRecord: (record: DailyRecord) => void;
  deleteRecord: (collaboratorId: string, date: string) => void;
}

export const RecordsContext = createContext<RecordsContextValue | undefined>(undefined);

export function RecordsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(recordsReducer, initialRecordsState);
  const isFirstRun = useRef(true);

  useEffect(() => {
    recordsRepository
      .loadRecords()
      .then((records) => dispatch({ type: 'HYDRATE', payload: records }))
      .catch((e) => dispatch({ type: 'HYDRATE_ERROR', payload: String(e) }));
  }, []);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    recordsRepository.saveRecords(Object.values(state.records));
  }, [state.records]);

  const upsertRecord = (record: DailyRecord) => dispatch({ type: 'UPSERT_RECORD', payload: record });
  const deleteRecord = (collaboratorId: string, date: string) =>
    dispatch({ type: 'DELETE_RECORD', payload: { collaboratorId, date } });

  return (
    <RecordsContext.Provider value={{ state, upsertRecord, deleteRecord }}>
      {children}
    </RecordsContext.Provider>
  );
}
