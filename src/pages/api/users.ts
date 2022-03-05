import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

export default async function users(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json({ users: await prisma.user.findMany() });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
