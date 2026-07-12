export const TITLE_MAX_LENGTH = 120;
export const NOTE_MAX_LENGTH = 2000;
export const ICON_KEY_MAX_LENGTH = 80;

export function validateRequiredText(
  value: string,
  label: string,
  options: { min?: number; max?: number } = {}
) {
  const text = value.trim();
  const min = options.min ?? 2;
  const max = options.max ?? TITLE_MAX_LENGTH;

  if (text.length < min) {
    throw new Error(`${label} must be at least ${min} characters.`);
  }

  if (text.length > max) {
    throw new Error(`${label} must be ${max} characters or fewer.`);
  }

  return text;
}

export function validateOptionalText(
  value: string | null,
  label: string,
  max = NOTE_MAX_LENGTH
) {
  const text = value?.trim() || null;

  if (text && text.length > max) {
    throw new Error(`${label} must be ${max} characters or fewer.`);
  }

  return text;
}
