import { z } from 'zod';

const priorityEnum = z.enum(['low', 'medium', 'high']);

export const createWishItemSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().max(1000).optional(),
  url: z.url().optional(),
  imageUrl: z.url().optional(),
  price: z.coerce.number().nonnegative().optional(),
  currency: z.string().length(3).toUpperCase().optional(),
  priority: priorityEnum.optional(),
});

export const updateWishItemSchema = createWishItemSchema.partial();

export type CreateWishItemInput = z.infer<typeof createWishItemSchema>;
export type UpdateWishItemInput = z.infer<typeof updateWishItemSchema>;
