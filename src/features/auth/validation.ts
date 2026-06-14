export function validateEmail(value: string): string | undefined {
  if (!value.trim()) return 'יש להזין כתובת אימייל';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'כתובת אימייל אינה תקינה';
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) return 'יש להזין סיסמה';
  if (value.length < 6) return 'הסיסמה חייבת להכיל לפחות 6 תווים';
  return undefined;
}
