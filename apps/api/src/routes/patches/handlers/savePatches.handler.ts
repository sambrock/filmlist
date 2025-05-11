import { AppRouteHandler } from '@/lib/openapi';
import { SavePatchesRoute } from '../patches.routes';

export const savePatches: AppRouteHandler<SavePatchesRoute> = async (c) => {
  const body = c.req.valid('json');

  for (const patches of body) {
    for (const patch of patches) {
      const { op, path, value } = patch;
      // const [table, ]

    }
  }

  return c.json({});
};
