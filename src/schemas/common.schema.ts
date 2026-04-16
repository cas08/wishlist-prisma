import { z } from 'zod';

export const uuidParamSchema = z.object({
  id: z.uuid({ message: 'id має бути UUID' }),
});

export const wishlistIdParamSchema = z.object({
  wishlistId: z.uuid({ message: 'wishlistId має бути UUID' }),
});
