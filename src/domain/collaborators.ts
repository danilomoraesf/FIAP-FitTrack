import { Collaborator } from '../models/Collaborator';

export function sortCollaboratorsByName(collaborators: Collaborator[]): Collaborator[] {
  return [...collaborators].sort((a, b) => a.name.localeCompare(b.name));
}

export function resolveActiveAfterHydrate(
  collaborators: Collaborator[],
  activeCollaboratorId: string | null
): string | null {
  if (activeCollaboratorId !== null && collaborators.some((c) => c.id === activeCollaboratorId)) {
    return activeCollaboratorId;
  }
  const sorted = sortCollaboratorsByName(collaborators);
  return sorted.length > 0 ? sorted[0].id : null;
}

export function resolveActiveAfterDelete(
  remainingCollaborators: Collaborator[],
  activeCollaboratorId: string | null,
  deletedCollaboratorId: string
): string | null {
  if (activeCollaboratorId !== deletedCollaboratorId) {
    return activeCollaboratorId;
  }
  const sorted = sortCollaboratorsByName(remainingCollaborators);
  return sorted.length > 0 ? sorted[0].id : null;
}
