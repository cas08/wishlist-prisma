import 'dotenv/config';
import { z } from 'zod';
const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    PORT: z.coerce.number().int().positive().default(3000),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    DIRECT_URL: z.string().optional(),
    JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    CORS_ORIGIN: z.string().default('*'),
  })
  .refine((v) => v.NODE_ENV !== 'production' || !!v.DIRECT_URL, {
    message: 'DIRECT_URL is required in production',
    path: ['DIRECT_URL'],
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:');
  console.error(z.treeifyError(parsed.error));
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
