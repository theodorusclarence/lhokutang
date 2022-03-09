import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { prisma } from '@/lib/prisma';

export default async function phone(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const session = await getSession({ req });
    if (!session?.user?.id)
      return res.status(401).send({ message: 'Unauthorized' });

    const { phoneNumber } = req.body;

    try {
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          phoneNumber: phoneNumber as string,
        },
      });
      return res.status(200).json({ message: 'Phone number updated' });
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
