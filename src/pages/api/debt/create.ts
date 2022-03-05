import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { prisma } from '@/lib/prisma';

export default async function create(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { debtor, amount, date, description } = req.body;

  if (req.method === 'POST') {
    const session = await getSession({ req });
    if (!session?.user?.email)
      return res.status(401).send({ message: 'Unauthorized' });

    try {
      await prisma.debt.create({
        data: {
          amount,
          date: new Date(date),
          description,
          debtorId: debtor,
          creditor: {
            connect: {
              email: session.user.email,
            },
          },
        },
      });
      return res.status(201).json({ message: 'Debt created' });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientUnknownRequestError)
        return res.status(500).send(error.message);
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
