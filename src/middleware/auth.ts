import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "@prisma/client";
import { unauthorized, forbidden } from "../lib/errors.ts";

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) throw unauthorized("No token provided");

  const token = header.slice(7);
  const secret = process.env["JWT_SECRET"];
  if (!secret) throw new Error("JWT_SECRET not configured");

  const payload = jwt.verify(token, secret) as JwtPayload;
  req.user = { id: payload.id, email: payload.email, role: payload.role };
  next();
}

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw unauthorized();
    if (!roles.includes(req.user.role)) {
      throw forbidden(`Requires role: ${roles.join(" or ")}`);
    }
    next();
  };
}
