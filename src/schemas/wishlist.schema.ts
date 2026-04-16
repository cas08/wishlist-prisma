import { z } from 'zod';

export const createWishlistSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().max(1000).optional(),
  occasion: z.string().max(60).optional(),
  isPublic: z.boolean().optional(),
  eventDate: z
    .string()
    .refine((v) => !Number.isNaN(Date.parse(v)), 'eventDate має бути валідною датою')
    .optional(),
});

export const updateWishlistSchema = createWishlistSchema.partial();

export type CreateWishlistInput = z.infer<typeof createWishlistSchema>;
export type UpdateWishlistInput = z.infer<typeof updateWishlistSchema>;
