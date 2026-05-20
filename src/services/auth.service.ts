import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.ts";
import { conflict, unauthorized } from "../lib/errors.ts";
import type { RegisterInput, LoginInput } from "../schemas/auth.schema.ts";

const SALT_ROUNDS = 12;

function signToken(payload: { id: string; email: string; role: string }) {
  const secret = process.env["JWT_SECRET"];
  if (!secret) throw new Error("JWT_SECRET not configured");
  return jwt.sign(payload, secret, {
    expiresIn: (process.env["JWT_EXPIRES_IN"] ?? "24h") as jwt.SignOptions["expiresIn"],
  });
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw conflict("Email already in use");

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email: input.email, passwordHash, name: input.name, role: input.role },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  return { token, user };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw unauthorized("Invalid email or password");

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw unauthorized("Invalid email or password");

  const token = signToken({ id: user.id, email: user.email, role: user.role });
  const { passwordHash: _, ...safeUser } = user;
  return { token, user: safeUser };
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, role: true, avatarUrl: true, createdAt: true },
  });
  if (!user) throw unauthorized();
  return user;
}

export async function updateProfile(
  userId: string,
  data: { name?: string; avatarUrl?: string },
) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, email: true, name: true, role: true, avatarUrl: true },
  });
}
