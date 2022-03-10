import { User as PrismaUser } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'next-auth';

import { prisma } from '@/lib/prisma';
import requireSession from '@/lib/require-session.server';

export default requireSession(summary);

async function summary(req: NextApiRequest, res: NextApiResponse, user: User) {
  if (req.method === 'GET') {
    const _transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          {
            userId: user.id,
          },
          {
            destinationUserId: user.id,
          },
        ],
      },
    });

    const transactions = _transactions.map((transaction) => {
      let type: 'pay' | 'paid' | 'utang' | 'piutang';
      let destinationUser: string;

      if (transaction.description === 'Pelunasan') {
        if (transaction.userId === user.id) {
          // We pay to the user
          type = 'pay';
          destinationUser = transaction.destinationUserId;
        } else {
          // We receive from the user
          type = 'paid';
          destinationUser = transaction.userId;
        }
      } else {
        if (transaction.userId === user.id) {
          type = 'utang';
          destinationUser = transaction.destinationUserId;
        } else {
          type = 'piutang';
          destinationUser = transaction.userId;
        }
      }

      return {
        type,
        amount: transaction.amount,
        destinationUser,
      };
    });

    const usersDebt = transactions.reduce<Record<string, { amount: number }>>(
      (acc, current) => {
        if (acc[current.destinationUser]) {
          if (current.type === 'pay' || current.type === 'utang') {
            acc[current.destinationUser].amount += current.amount;
          } else {
            acc[current.destinationUser].amount -= current.amount;
          }
        } else {
          acc[current.destinationUser] = {
            amount:
              current.type === 'pay' || current.type === 'utang'
                ? current.amount
                : -current.amount,
          };
        }

        return acc;
      },
      {}
    );

    // sort if not 0
    const summary: ({ amount: number } & PrismaUser)[] = (
      await prisma.user.findMany()
    )
      .map((user) => ({ ...user, amount: usersDebt?.[user.id]?.amount ?? 0 }))
      // Bring lunas to the end
      .sort((a) => (a.amount === 0 ? 1 : -1));

    return res.status(200).json({ summary });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
