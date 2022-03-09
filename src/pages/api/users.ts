import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { prisma } from '@/lib/prisma';

export default async function users(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const session = await getSession({ req });
    if (!session?.user?.email)
      return res.status(401).send({ message: 'Unauthorized' });

    res.status(200).json({ users: await prisma.user.findMany() });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
