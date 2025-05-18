import { verify, decode, sign } from 'jsonwebtoken';

import { SCHEMA_CLIENT_ID_LENGTH } from '@/constants';
import { generateNanoid } from './nanoid.utils';

export type ClientPayload = {
  clientId: string;
};

export const generateClientId = () => {
  return generateNanoid(SCHEMA_CLIENT_ID_LENGTH);
};

export const signClientToken = (payload: ClientPayload, secret: string): string => {
  return sign(payload, secret);
};

export const verifyClientToken = (token: string, secret: string): ClientPayload | null => {
  const payload = verify(token, secret) as ClientPayload;
  if (!payload) {
    return null;
  }
  return payload;
};

export const decodeClientToken = (token: string): ClientPayload | null => {
  return decode(token) as ClientPayload;
};
