import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'next-auth';
import { getSession } from 'next-auth/react';

export type ApiRoute = (
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) => Promise<void>;

export default function requireSession(apiRoute: ApiRoute) {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getSession({ req });
    if (!session?.user?.email) {
      res.status(401).json({
        message: 'Unauthorized',
      });
      return null;
    } else {
      return apiRoute(req, res, session.user as User);
    }
  };
}
