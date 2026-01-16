import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

function readKey(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf-8');
}

export const jwtPrivateKey = readKey(
  process.env.JWT_PRIVATE_KEY_PATH as string,
);

export const jwtPublicKey = readKey(process.env.JWT_PUBLIC_KEY_PATH as string);
