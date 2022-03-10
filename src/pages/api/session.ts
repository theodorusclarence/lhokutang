import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'next-auth';

import requireSession from '@/lib/require-session.server';

async function session(req: NextApiRequest, res: NextApiResponse, user: User) {
  if (req.method === 'GET') {
    res.status(200).json({ user });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

export default requireSession(session);
