import 'dotenv/config';
// import { readFileSync } from 'node:fs';
// import { join } from 'node:path';

// function readKey(path: string): string {
//   return readFileSync(join(process.cwd(), path), 'utf-8');
// }

// export const jwtPrivateKeyPath = readKey(
//   process.env.JWT_PRIVATE_KEY_PATH as string,
// );

// export const jwtPublicKeyPath = readKey(process.env.JWT_PUBLIC_KEY_PATH as string);

export const jwtPrivateKey = process.env.JWT_PRIVATE_KEY;

export const jwtPublicKey = process.env.JWT_PUBLIC_KEY;
