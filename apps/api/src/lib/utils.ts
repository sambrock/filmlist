import { customAlphabet } from 'nanoid/non-secure';

export const generateNanoid = () => {
  const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyz';

  return customAlphabet(ALPHABET, 16)();
};
