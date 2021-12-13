import { SHA512, enc } from 'crypto-js';

export function hashSHA256(string: string): string {
  return enc.Hex.stringify(SHA512(string));
}
