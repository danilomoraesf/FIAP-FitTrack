import React, { createContext, ReactNode, useEffect, useReducer, useRef } from 'react';
import { Collaborator } from '../models/Collaborator';
import * as collaboratorsRepository from '../storage/collaboratorsRepository';
import {
  CollaboratorsState,
  collaboratorsReducer,
  initialCollaboratorsState,
} from './collaboratorsReducer';

export interface CollaboratorsContextValue {
  state: CollaboratorsState;
  addCollaborator: (collaborator: Collaborator) => void;
  updateCollaborator: (collaborator: Collaborator) => void;
  deleteCollaborator: (id: string) => void;
  setActiveCollaborator: (id: string) => void;
}

export const CollaboratorsContext = createContext<CollaboratorsContextValue | undefined>(undefined);

export function CollaboratorsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(collaboratorsReducer, initialCollaboratorsState);
  const isFirstRun = useRef(true);

  useEffect(() => {
    collaboratorsRepository
      .loadCollaborators()
      .then((snapshot) =>
        dispatch({
          type: 'HYDRATE',
          payload: { collaborators: snapshot.collaborators, activeCollaboratorId: snapshot.activeCollaboratorId },
        })
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    collaboratorsRepository.saveCollaborators({
      collaborators: state.collaborators,
      activeCollaboratorId: state.activeCollaboratorId,
    });
  }, [state.collaborators, state.activeCollaboratorId]);

  const addCollaborator = (collaborator: Collaborator) =>
    dispatch({ type: 'ADD_COLLABORATOR', payload: collaborator });
  const updateCollaborator = (collaborator: Collaborator) =>
    dispatch({ type: 'UPDATE_COLLABORATOR', payload: collaborator });
  const deleteCollaborator = (id: string) => dispatch({ type: 'DELETE_COLLABORATOR', payload: { id } });
  const setActiveCollaborator = (id: string) => dispatch({ type: 'SET_ACTIVE_COLLABORATOR', payload: { id } });

  return (
    <CollaboratorsContext.Provider
      value={{ state, addCollaborator, updateCollaborator, deleteCollaborator, setActiveCollaborator }}
    >
      {children}
    </CollaboratorsContext.Provider>
  );
}
