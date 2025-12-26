import { Request, Response, NextFunction } from "express";
import { z } from "zod";

/**
 * Validation middleware factory
 * Creates a middleware that validates request data against a Zod schema
 * @param schema - Zod schema to validate against
 */
export const validate = (schema: z.ZodType<unknown>) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request body, query params, and URL params
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        const errors = error.issues.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        }));
        res.fail("Validation Error", { errors }, 400);
        return;
      }
      // Pass other errors to the error handler
      next(error);
    }
  };
};
