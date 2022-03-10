import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'next-auth';

import { prisma } from '@/lib/prisma';
import requireSession from '@/lib/require-session.server';

export type CreateManyBody = {
  destinationUserIdList: string[];
  amountPerPerson: number;
  date: Date;
  description: string;
};

export default requireSession(handler);

async function handler(req: NextApiRequest, res: NextApiResponse, user: User) {
  const { destinationUserIdList, amountPerPerson, date, description } =
    req.body;

  if (req.method === 'POST') {
    try {
      await prisma.transaction.createMany({
        data: (destinationUserIdList as string[]).map((destinationUserId) => ({
          amount: amountPerPerson,
          date: new Date(date),
          description,
          destinationUserId,
          userId: user.id,
        })),
      });
      return res.status(201).json({ message: 'Transactions created' });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientUnknownRequestError)
        return res.status(500).send(error.message);
      else {
        throw error;
      }
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
