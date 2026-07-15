import { Collaborator } from '../models/Collaborator';
import { resolveActiveAfterDelete, resolveActiveAfterHydrate } from '../domain/collaborators';

export interface CollaboratorsState {
  collaborators: Collaborator[];
  activeCollaboratorId: string | null;
}

export type CollaboratorsAction =
  | { type: 'HYDRATE'; payload: { collaborators: Collaborator[]; activeCollaboratorId: string | null } }
  | { type: 'ADD_COLLABORATOR'; payload: Collaborator }
  | { type: 'UPDATE_COLLABORATOR'; payload: Collaborator }
  | { type: 'DELETE_COLLABORATOR'; payload: { id: string } }
  | { type: 'SET_ACTIVE_COLLABORATOR'; payload: { id: string } };

export const initialCollaboratorsState: CollaboratorsState = {
  collaborators: [],
  activeCollaboratorId: null,
};

export function collaboratorsReducer(
  state: CollaboratorsState,
  action: CollaboratorsAction
): CollaboratorsState {
  switch (action.type) {
    case 'HYDRATE': {
      const activeCollaboratorId = resolveActiveAfterHydrate(
        action.payload.collaborators,
        action.payload.activeCollaboratorId
      );
      return {
        ...state,
        collaborators: action.payload.collaborators,
        activeCollaboratorId,
      };
    }
    case 'ADD_COLLABORATOR': {
      const collaborators = [...state.collaborators, action.payload];
      const activeCollaboratorId = state.activeCollaboratorId ?? action.payload.id;
      return { ...state, collaborators, activeCollaboratorId };
    }
    case 'UPDATE_COLLABORATOR': {
      const collaborators = state.collaborators.map((c) =>
        c.id === action.payload.id ? action.payload : c
      );
      return { ...state, collaborators };
    }
    case 'DELETE_COLLABORATOR': {
      const collaborators = state.collaborators.filter((c) => c.id !== action.payload.id);
      const activeCollaboratorId = resolveActiveAfterDelete(
        collaborators,
        state.activeCollaboratorId,
        action.payload.id
      );
      return { ...state, collaborators, activeCollaboratorId };
    }
    case 'SET_ACTIVE_COLLABORATOR':
      return { ...state, activeCollaboratorId: action.payload.id };
    default:
      return state;
  }
}
