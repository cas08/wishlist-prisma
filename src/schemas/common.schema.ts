import { z } from 'zod';

export const uuidParamSchema = z.object({
  id: z.uuid({ message: 'id must be a valid UUID' }),
});

export const wishlistIdParamSchema = z.object({
  wishlistId: z.uuid({ message: 'wishlistId must be a valid UUID' }),
});
