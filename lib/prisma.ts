
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  // eslint-disable-next-line no-var
  var __prismaInstance: PrismaClient | undefined;
}

export function getPrismaClient(): PrismaClient | null {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return null;
  }

  if (global.__prismaInstance) {
    return global.__prismaInstance;
  }

  const adapter = new PrismaPg({
    connectionString,
  });

  global.__prismaInstance = new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

  return global.__prismaInstance;
}
