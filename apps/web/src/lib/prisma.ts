import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// `pg-connection-string` (used by the pg adapter) emits a deprecation warning
// when the URL carries `sslmode=require|prefer|verify-ca`, since those modes
// change meaning in pg v9 / pg-connection-string v3. We govern TLS explicitly
// via the `ssl` option below, so the param is redundant — strip it to keep the
// connection behavior identical and the dev console free of the warning.
function getDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) return url;
  return url
    .replace(/[?&]sslmode=[^&]*/i, (m) => (m[0] === "?" ? "?" : ""))
    .replace(/\?&/, "?")
    .replace(/[?&]$/, "");
}

function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: getDatabaseUrl(),
    ssl: true,
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
