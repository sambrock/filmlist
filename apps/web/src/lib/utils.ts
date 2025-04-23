import { cx } from 'class-variance-authority';
import type { ClassValue } from 'class-variance-authority/types';

export const cn = (...inputs: ClassValue[]) => {
  return cx(inputs);
};
