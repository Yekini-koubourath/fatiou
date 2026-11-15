
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { UserSession } from "./types";
import { getPrismaClient } from "./prisma";

const COOKIE_NAME = "fxxty_token";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET doit être configuré.");
    }

    return new TextEncoder().encode(
      "fxxtyschop-local-development-secret-2026"
    );
  }

  return new TextEncoder().encode(secret);
}

function getDatabase() {
  const prisma = getPrismaClient();

  if (!prisma) {
    throw new Error("DATABASE_URL est manquant.");
  }

  return prisma;
}

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: "ADMIN" | "CUSTOMER";
  createdAt: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(
  payload: UserSession
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(
  token: string
): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());

    if (
      typeof payload.id !== "string" ||
      typeof payload.email !== "string"
    ) {
      return null;
    }

    return payload as unknown as UserSession;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    const session = await verifySessionToken(token);

    if (!session || session.role !== "ADMIN") return null;

    const user = await userRepo.findById(session.id);

    if (!user || user.role !== "ADMIN") return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
    };
  } catch (error) {
    console.error("Erreur de vérification de session :", error);
    return null;
  }
}

export async function setSessionCookie(
  session: UserSession
): Promise<string> {
  if (session.role !== "ADMIN") {
    throw new Error("Seul un administrateur peut ouvrir une session.");
  }

  const token = await createSessionToken(session);
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return token;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export const userRepo = {
  async findByEmail(email: string): Promise<StoredUser | null> {
    const prisma = getDatabase();

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email.trim(),
          mode: "insensitive",
        },
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? undefined,
      passwordHash: user.passwordHash,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  },

  async findById(id: string): Promise<StoredUser | null> {
    const prisma = getDatabase();

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? undefined,
      passwordHash: user.passwordHash,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
    };
  },

  async create(data: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role?: "ADMIN" | "CUSTOMER";
  }): Promise<UserSession> {
    if (data.role !== "ADMIN") {
      throw new Error("La création de comptes clients est désactivée.");
    }

    const prisma = getDatabase();
    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.trim().toLowerCase(),
        phone: data.phone,
        passwordHash,
        role: "ADMIN",
      },
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? undefined,
      role: user.role,
    };
  },
};
