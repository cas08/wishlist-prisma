import type { NextFunction, Request, Response } from 'express';
import { ZodError, type ZodType } from 'zod';

type Source = 'body' | 'params' | 'query';

export function validate(schema: ZodType, source: Source = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const parsed = schema.parse(req[source]);
      (req as unknown as Record<Source, unknown>)[source] = parsed;
      next();
    } catch (err) {
      next(err as ZodError);
    }
  };
}
