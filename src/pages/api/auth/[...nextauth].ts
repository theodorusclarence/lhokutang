import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { prisma } from '@/lib/prisma';

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
      if (emailWhitelist.includes(user.email)) return true;
      return false;
    },
  },
});

const emailWhitelist = [
  'ppdbultimate@gmail.com',
  'theodorusclarence@gmail.com',
  'adhwamaharika@gmail.com',
  'carlonugroho01@gmail.com',
  'jeremiakeloko@gmail.com',
  'ferdinand.parulian@gmail.com',
  'ivan.19400016@gmail.com',
  'billharit@gmail.com',
  'philippurba.pp@gmail.com',
  'rayhanalifa@googlemail.com',
  'kanda.wibisanan@gmail.com',
  'stevearmando@gmail.com',
  'radityarobert@gmail.com',
  'sihombingcharminuel@gmail.com',
];
