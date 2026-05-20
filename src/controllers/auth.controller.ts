import type { Request, Response } from "express";
import * as authService from "../services/auth.service.ts";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema.ts";

export async function register(req: Request, res: Response) {
  const result = await authService.register(req.body as RegisterInput);
  res.status(201).json(result);
}

export async function login(req: Request, res: Response) {
  const result = await authService.login(req.body as LoginInput);
  res.json(result);
}

export async function logout(_req: Request, res: Response) {
  // JWT is stateless — client discards the token; no server-side action needed
  res.json({ message: "Logged out successfully" });
}

export async function getMe(req: Request, res: Response) {
  const user = await authService.getMe(req.user!.id);
  res.json(user);
}

export async function updateProfile(req: Request, res: Response) {
  const user = await authService.updateProfile(req.user!.id, req.body as { name?: string; avatarUrl?: string });
  res.json(user);
}
