import { Collaborator } from '../models/Collaborator';
import { getItem, setItem } from './asyncStorage';

const STORAGE_KEY = '@fittrack/collaborators_v1';

export interface CollaboratorsSnapshot {
  collaborators: Collaborator[];
  activeCollaboratorId: string | null;
}

export async function loadCollaborators(): Promise<CollaboratorsSnapshot> {
  const snapshot = await getItem<CollaboratorsSnapshot>(STORAGE_KEY);
  return snapshot ?? { collaborators: [], activeCollaboratorId: null };
}

export async function saveCollaborators(snapshot: CollaboratorsSnapshot): Promise<void> {
  await setItem<CollaboratorsSnapshot>(STORAGE_KEY, snapshot);
}
