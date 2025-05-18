import { SCHEMA_LIST_EDIT_ID_LENGTH, SCHEMA_LIST_READ_ID_LENGTH } from '@/constants';
import { generateNanoid } from './nanoid.utils';

export const generateEditReadIds = () => {
  const editId = generateNanoid(SCHEMA_LIST_EDIT_ID_LENGTH);
  const readId = editId.substring(0, SCHEMA_LIST_READ_ID_LENGTH);

  return { editId, readId };
};

export const isEditId = (id: string) => {
  return id.length === SCHEMA_LIST_EDIT_ID_LENGTH;
};
