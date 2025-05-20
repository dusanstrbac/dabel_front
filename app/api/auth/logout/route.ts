import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ success: boolean }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false });
  }

  // Clear the cookie by setting an expired value
  const cookie = serialize('auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    expires: new Date(0),
    path: '/',
  });

  res.setHeader('Set-Cookie', cookie);
  return res.status(200).json({ success: true });
}