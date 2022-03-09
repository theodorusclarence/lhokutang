import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { prisma } from '@/lib/prisma';

export default async function GetSingleUser(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const session = await getSession({ req });
    if (!session?.user?.email)
      return res.status(401).send({ message: 'Unauthorized' });

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
