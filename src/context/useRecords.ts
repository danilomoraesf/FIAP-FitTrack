import { useContext } from 'react';
import { RecordsContext, RecordsContextValue } from './RecordsContext';

export function useRecords(): RecordsContextValue {
  const ctx = useContext(RecordsContext);
  if (!ctx) {
    throw new Error('useRecords must be used within a RecordsProvider');
  }
  return ctx;
}
