import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { prisma } from '@/lib/prisma';

export type CreateManyBody = {
  destinationUserIdList: string[];
  amountPerPerson: number;
  date: Date;
  description: string;
};

export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { destinationUserIdList, amountPerPerson, date, description } =
    req.body;

  if (req.method === 'POST') {
    const session = await getSession({ req });
    if (!session?.user?.email)
      return res.status(401).send({ message: 'Unauthorized' });

    try {
      await prisma.transaction.createMany({
        data: (destinationUserIdList as string[]).map((destinationUserId) => ({
          amount: amountPerPerson,
          date: new Date(date),
          description,
          destinationUserId,
          userId: session.user.id,
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
