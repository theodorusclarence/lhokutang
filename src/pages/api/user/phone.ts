import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'next-auth';

import { prisma } from '@/lib/prisma';
import requireSession from '@/lib/require-session.server';

export default requireSession(phone);

async function phone(req: NextApiRequest, res: NextApiResponse, user: User) {
  if (req.method === 'POST') {
    const { phoneNumber } = req.body;

    try {
      await prisma.user.update({
        where: {
          id: user.id,
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
