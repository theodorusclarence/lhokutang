import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';
import requireSession from '@/lib/require-session.server';

export default requireSession(GetSingleUser);

async function GetSingleUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const userId = req.query.id;

    if (typeof userId !== 'string') {
      return res.status(400).json({
        message: 'Invalid ID',
      });
    }

    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      return res.status(200).json(user);
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
