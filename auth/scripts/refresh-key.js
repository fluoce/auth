import { randomBytes } from 'node:crypto';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ulid } from 'ulid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const keyDir = join(__dirname, '../key');
mkdirSync(keyDir, { recursive: true });

const refreshKey = ulid() + randomBytes(24).toString('hex') + ulid();

writeFileSync(join(keyDir, 'refresh-key.pem'), refreshKey);
