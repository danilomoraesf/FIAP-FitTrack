export interface CollaboratorFormValues {
  name: string;
  role: string;
}

export interface CollaboratorValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof CollaboratorFormValues, string>>;
}

export function validateCollaboratorForm(values: CollaboratorFormValues): CollaboratorValidationResult {
  const errors: CollaboratorValidationResult['errors'] = {};

  if (values.name.trim() === '') {
    errors.name = 'Qual o nome do colaborador?';
  } else if (values.name.trim().length > 80) {
    errors.name = 'Esse nome ficou grande demais, tente até 80 caracteres.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
