import { v4 } from 'uuid';

export const uuid = () => {
  return v4();
};

export const draftUuid = () => {
  return `draft:${v4()}`;
};

export const isDraftUuid = (uuid: string) => {
  return uuid.startsWith('draft:');
};
