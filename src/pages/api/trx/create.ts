import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'next-auth';

import { prisma } from '@/lib/prisma';
import requireSession from '@/lib/require-session.server';

export default requireSession(create);

async function create(req: NextApiRequest, res: NextApiResponse, user: User) {
  const { destinationUserId, amount, date, description } = req.body;

  if (req.method === 'POST') {
    try {
      await prisma.transaction.create({
        data: {
          amount,
          date: new Date(date),
          description,
          destinationUserId,
          userId: user.id,
        },
      });

      return res.status(201).json({ message: 'Transaction created' });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientUnknownRequestError)
        return res.status(500).send(error.message);
      else {
        throw error;
      }
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
