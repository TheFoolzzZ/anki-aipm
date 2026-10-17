const USERNAME_PATTERN = /^[\p{Script=Han}A-Za-z0-9 _-]+$/u;

export function normalizeUsername(input: string): string {
  return input.trim().replace(/\s+/g, ' ');
}

export function usernameKey(input: string): string {
  return normalizeUsername(input).toLowerCase();
}

export function validateUsername(input: string): string {
  if (/[\u0000-\u001F\u007F]/.test(input)) throw new Error('INVALID_USERNAME');
  const clean = normalizeUsername(input);
  if (clean.length < 2 || clean.length > 24 || !USERNAME_PATTERN.test(clean)) {
    throw new Error('INVALID_USERNAME');
  }
  return clean;
}
