import { createHash } from 'crypto';

export function hashSHA256(string: string): string {
  return createHash('sha256').update(string).digest('hex');
}
