import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';
import requireSession from '@/lib/require-session.server';

export default requireSession(users);

async function users(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ users: await prisma.user.findMany() });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
