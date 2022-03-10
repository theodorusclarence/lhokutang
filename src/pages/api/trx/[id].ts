import { Prisma, User } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';
import requireSession from '@/lib/require-session.server';

export type GetTransactionsApi = {
  transactions: {
    id: string;
    amount: number;
    description: string;
    date: Date;
    type: string;
    user: User;
  }[];
  total: number;
};

export default requireSession(GetTransactions);

async function GetTransactions(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const userId = req.query.id;

    if (typeof userId !== 'string') {
      return res.status(400).json({
        message: 'Invalid ID',
      });
    }

    // get parameters
    const destinationUserId = req.query.destinationUserId;

    if (typeof destinationUserId !== 'string') {
      return res.status(400).json({
        message: 'Invalid destinationUser',
      });
    }

    try {
      const _transactions = await prisma.transaction.findMany({
        where: {
          OR: [
            {
              userId,
              destinationUserId,
            },
            {
              userId: destinationUserId,
              destinationUserId: userId,
            },
          ],
        },
        select: {
          id: true,
          user: true,
          date: true,
          amount: true,
          description: true,
        },
        orderBy: {
          date: 'desc',
        },
      });

      const transactions = _transactions.map(
        ({ id, user, date, amount, description }) => ({
          id,
          amount,
          description,
          date,
          user,
          type:
            description === 'Pelunasan'
              ? 'payment'
              : user.id === userId
              ? 'piutang'
              : 'utang',
        })
      );

      const total = transactions.reduce(
        (acc, { amount, type, user }) =>
          type === 'utang' ||
          (type === 'payment' && user.id === destinationUserId)
            ? acc + amount
            : acc - amount,
        0
      );

      const transactionReturn: GetTransactionsApi = { transactions, total };

      return res.status(200).json(transactionReturn);
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
