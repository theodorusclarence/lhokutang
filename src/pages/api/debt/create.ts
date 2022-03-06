import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { prisma } from '@/lib/prisma';

export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { destinationUserId, amount, date, description } = req.body;

  if (req.method === 'POST') {
    const session = await getSession({ req });
    if (!session?.user?.email)
      return res.status(401).send({ message: 'Unauthorized' });

    try {
      await prisma.transaction.create({
        data: {
          amount,
          date: new Date(date),
          description,
          destinationUserId,
          user: {
            connect: {
              email: session.user.email,
            },
          },
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
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
