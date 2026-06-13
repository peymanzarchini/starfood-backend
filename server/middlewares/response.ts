import { NextFunction, Request, Response } from "express";

export function responseMiddleware(_req: Request, res: Response, next: NextFunction): void {
  res.success = function <T>(
    message: string,
    body: T,
    status: number = 200,
    pagination?: { pageSize: number; pageNumber: number; totalItems: number; totalPages: number },
  ): Response {
    return res.status(status).json({
      success: true,
      message,
      body,
      status,
      ...pagination,
    });
  };

  res.fail = function <T>(message: string, body?: T, status: number = 400): Response {
    return res.status(status).json({
      success: false,
      message,
      body: body || null,
      status,
    });
  };

  next();
}
