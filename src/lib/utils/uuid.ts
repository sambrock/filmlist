import { v4 } from 'uuid';

export const uuid = () => {
  return v4();
};

// export const unsavedUuid = () => {
//   return `unsaved:${v4()}`;
// };

// export const isUnsavedUuid = (uuid: string) => {
//   return uuid.startsWith('unsaved:');
// };

// export const clearUuid = (uuid: string) => {
//   return uuid.replace('unsaved:', '');
// };

// export const validUuid = (uuid: string) => {
//   return validate(uuid);
// };
