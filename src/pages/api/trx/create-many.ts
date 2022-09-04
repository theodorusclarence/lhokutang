import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'next-auth';

import { sendMail } from '@/lib/email.server';
import { numberWithCommas } from '@/lib/helper';
import { prisma } from '@/lib/prisma';
import requireSession from '@/lib/require-session.server';

export type CreateManyBody = {
  destinationUserIdList: string[];
  amountPerPerson: number;
  date: Date;
  description: string;
};

export default requireSession(handler);

async function handler(req: NextApiRequest, res: NextApiResponse, user: User) {
  const { destinationUserIdList, amountPerPerson, date, description } =
    req.body;

  if (req.method === 'POST') {
    try {
      await prisma.transaction.createMany({
        data: (destinationUserIdList as string[]).map((destinationUserId) => ({
          amount: amountPerPerson,
          date: new Date(date),
          description,
          destinationUserId,
          userId: user.id,
        })),
      });

      const users = await prisma.user.findMany();

      for (const destinationUserId of destinationUserIdList) {
        const subject = `Request uang dari ${user.name}`;
        const text = `Hai! ${
          user.name
        } baru saja melakukan request uang sebesar Rp ${numberWithCommas(
          amountPerPerson
        )} dengan keterangan: ${description}. Silakan melakukan pembayaran di https://lhoks.thcl.dev/trx/${
          user.id
        }`;
        const html = `
          <p>Hai!</p><p><strong>${
            user.name
          }</strong> baru saja melakukan request uang sebesar <strong>
            Rp ${numberWithCommas(amountPerPerson)}
          </strong> dengan keterangan: <strong>${description}</strong>. Silakan melakukan pembayaran di <a href='https://lhoks.thcl.dev/trx/${
          user.id
        }'>link berikut.</a></p>
        `;

        sendMail({
          to: users.find((user) => user.id === destinationUserId)
            ?.email as string,
          toName: users.find((user) => user.id === destinationUserId)
            ?.name as string,
          subject,
          text,
          html,
        });
      }

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
