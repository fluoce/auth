import crypto from 'node:crypto';

export function generateOTP() {
  return crypto.randomInt(0, 10000).toString().padStart(4, '0');
}
