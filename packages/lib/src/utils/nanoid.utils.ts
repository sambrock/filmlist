import { customAlphabet } from 'nanoid';

export const generateNanoid = (length: number): string => {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  return customAlphabet(alphabet, length)();
};
