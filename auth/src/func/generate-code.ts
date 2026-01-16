import crypto from 'node:crypto';

export function generateCode(): string {
  return crypto.randomBytes(48).toString('hex');
}
