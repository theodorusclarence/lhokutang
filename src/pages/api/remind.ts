import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'next-auth';

import { sendMail } from '@/lib/email.server';
import { numberWithCommas } from '@/lib/helper';
import { prisma } from '@/lib/prisma';
import requireSession from '@/lib/require-session.server';

export default requireSession(email);
async function email(req: NextApiRequest, res: NextApiResponse, user: User) {
  const { userId, amount, description } = req.body;
  if (req.method === 'POST') {
    const destinationUser = await prisma.user.findFirst({
      where: { id: userId },
    });
    const subject = `Permintaan pelunasan dari ${user.name}`;
    const text = `Hai! ${
      user.name
    } ingin mengingatkan untuk membayar utang sebesar Rp ${numberWithCommas(
      amount
    )}. Silakan melakukan pembayaran di https://lhoks.thcl.dev/trx/${
      user.id
    }. Pesan: ${description || '-'}`;
    const html = `
      <p>Hai!</p><p><strong>${
        user.name
      }</strong> ingin mengingatkan untuk membayar utang sebesar <strong>
        Rp ${numberWithCommas(amount)}
      </strong>Silakan melakukan pembayaran di <a href='https://lhoks.thcl.dev/trx/${
        user.id
      }'>link berikut.</a></p>

      <p>Pesan: ${description || '-'}</p>
    `;

    sendMail({
      to: destinationUser?.email as string,
      toName: destinationUser?.name as string,
      subject,
      text,
      html,
    });
    res.status(200).json({ message: 'Email sent' });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
