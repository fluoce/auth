export function nameFromEmail(email: string): string {
  return email.split('@')[0];
}
