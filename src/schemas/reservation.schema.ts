import { z } from 'zod';

export const reserveSchema = z.object({
  reserverName: z.string().trim().min(1).max(120).optional(),
  note: z.string().max(500).optional(),
  isAnonymous: z.boolean().optional(),
});

export type ReserveInput = z.infer<typeof reserveSchema>;
