import { ZodTypeAny } from 'zod';

export { status as HttpStatusCodes } from 'http-status';

export const jsonContent = <Schema extends ZodTypeAny>(schema: Schema) => ({
  'application/json': {
    schema,
  },
});
