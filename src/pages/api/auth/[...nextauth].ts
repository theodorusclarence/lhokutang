import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { prisma } from '@/lib/prisma';

import { alumnusEmail, emailWhitelist } from '@/constant/email-whitelist';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientId: process.env.GOOGLE_CLIENT_ID!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      session.user.id = user.id;
      return Promise.resolve(session);
    },
    signIn: async ({ user }) => {
      if (!user.email) return false;

      // Only allow email within the whitelist
      if ([...emailWhitelist, ...alumnusEmail].includes(user.email))
        return true;
      return false;
    },
  },
});
