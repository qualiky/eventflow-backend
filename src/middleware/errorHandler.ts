import type { Request, Response, NextFunction } from "express";
import { AppError } from "../lib/errors.ts";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // JWT errors
  if (err instanceof Error && err.name === "JsonWebTokenError") {
    res.status(401).json({ error: "Invalid token" });
    return;
  }
  if (err instanceof Error && err.name === "TokenExpiredError") {
    res.status(401).json({ error: "Token expired" });
    return;
  }

  const message =
    process.env["NODE_ENV"] === "production"
      ? "Internal server error"
      : err instanceof Error
        ? err.message
        : String(err);

  console.error(err);
  res.status(500).json({ error: message });
}
