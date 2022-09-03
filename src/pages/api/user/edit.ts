import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'next-auth';

import { prisma } from '@/lib/prisma';
import requireSession from '@/lib/require-session.server';

export default requireSession(phone);

type RequestBody = {
  phoneNumber: string;
  name: string;
};

async function phone(req: NextApiRequest, res: NextApiResponse, user: User) {
  if (req.method === 'POST') {
    const { phoneNumber, name } = req.body as RequestBody;

    try {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          phoneNumber,
          name,
        },
      });
      return res.status(200).json({ message: 'Profile updated' });
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
