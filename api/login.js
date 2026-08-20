import { hashPassword } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { password } = req.body || {};
  if (!password || !process.env.APP_PASSWORD || password !== process.env.APP_PASSWORD) {
    return res.status(401).json({ error: 'invalid' });
  }
  const token = await hashPassword(password);
  const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    `furka_session=${token}; HttpOnly; Path=/; Max-Age=2592000; SameSite=Lax${isProd ? '; Secure' : ''}`
  );
  res.status(200).json({ ok: true });
}
