import { useContext } from 'react';
import { CollaboratorsContext, CollaboratorsContextValue } from './CollaboratorsContext';

export function useCollaborators(): CollaboratorsContextValue {
  const ctx = useContext(CollaboratorsContext);
  if (!ctx) {
    throw new Error('useCollaborators must be used within a CollaboratorsProvider');
  }
  return ctx;
}
