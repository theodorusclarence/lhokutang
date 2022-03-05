// @see https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
// @see https://github.com/nextauthjs/next-auth/issues/824#issuecomment-860266512
import { PrismaClient } from '@prisma/client';

declare global {
  namespace NodeJS {
    interface Global {
      prisma: PrismaClient | undefined;
    }
  }
}

export {};
