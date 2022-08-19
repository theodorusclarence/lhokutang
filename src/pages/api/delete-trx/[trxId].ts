import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';
import requireSession from '@/lib/require-session.server';

export default requireSession(deleteTransaction);
async function deleteTransaction(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const transactionId = req.query.trxId;

    if (typeof transactionId !== 'string') {
      return res.status(400).json({
        message: 'Invalid transactionId',
      });
    }

    try {
      const transaction = await prisma.transaction.delete({
        where: {
          id: transactionId,
        },
      });

      return res.status(200).json(transaction);
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
