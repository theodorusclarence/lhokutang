import { Prisma } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'next-auth';

import { sendMail } from '@/lib/email.server';
import { numberWithCommas } from '@/lib/helper';
import { prisma } from '@/lib/prisma';
import requireSession from '@/lib/require-session.server';

export default requireSession(create);

async function create(req: NextApiRequest, res: NextApiResponse, user: User) {
  const { destinationUserId, amount, date, description } = req.body;

  if (req.method === 'POST') {
    try {
      await prisma.transaction.create({
        data: {
          amount,
          date: new Date(date),
          description,
          destinationUserId,
          userId: user.id,
        },
      });

      const destinationUser = await prisma.user.findFirst({
        where: { id: destinationUserId },
      });

      let text, html, subject;

      if (description.startsWith('Pelunasan')) {
        subject = `Pelunasan dari ${user.name}`;
        text = `Hai! ${
          user.name
        } baru saja melakukan pelunasan sebesar Rp ${numberWithCommas(
          amount
        )}. Anda bisa mengecek pembayaran di https://lhoks.thcl.dev/trx/${
          user.id
        }`;
        html = `
        <p>Hai!</p><p><strong>${
          user.name
        }</strong> baru saja melakukan pelunasan sebesar <strong>
          Rp ${numberWithCommas(amount)}
        </strong>. Anda bisa mengecek pembayaran di <a href='https://lhoks.thcl.dev/trx/${
          user.id
        }'>link berikut.</a></p>
      `;
      } else {
        subject = `Request uang dari ${user.name}`;
        text = `Hai! ${
          user.name
        } baru saja melakukan request uang sebesar Rp ${numberWithCommas(
          amount
        )} dengan keterangan: ${description}. Silakan melakukan pembayaran di https://lhoks.thcl.dev/trx/${
          user.id
        }`;
        html = `
          <p>Hai!</p><p><strong>${
            user.name
          }</strong> baru saja melakukan request uang sebesar <strong>
            Rp ${numberWithCommas(amount)}
          </strong> dengan keterangan: <strong>${description}</strong>. Silakan melakukan pembayaran di <a href='https://lhoks.thcl.dev/trx/${
          user.id
        }'>link berikut.</a></p>
        `;
      }

      sendMail({
        to: destinationUser?.email as string,
        toName: destinationUser?.name as string,
        subject,
        text,
        html,
      });

      return res.status(201).json({ message: 'Transaction created' });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientUnknownRequestError)
        return res.status(500).send(error.message);
      else {
        throw error;
      }
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
