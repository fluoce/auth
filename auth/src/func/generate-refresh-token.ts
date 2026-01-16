import crypto from 'node:crypto';
import { ulid } from 'ulid';

export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString('hex') + ulid();
}
