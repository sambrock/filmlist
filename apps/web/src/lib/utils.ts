import { cx, CxOptions } from 'class-variance-authority';

export const cn = (...inputs: CxOptions) => {
  return cx(inputs);
};
