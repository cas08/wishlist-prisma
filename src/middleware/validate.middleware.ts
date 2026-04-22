import type {NextFunction, Request, Response} from 'express';
import {ZodError, type ZodType} from 'zod';

type Source = 'body' | 'params' | 'query';

export function validate(schema: ZodType, source: Source = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      (req as unknown as Record<Source, unknown>)[source] = schema.parse(req[source]);
      next();
    } catch (err) {
      next(err as ZodError);
    }
  };
}
