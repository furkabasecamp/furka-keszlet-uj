export async function hashPassword(pw) {
  const enc = new TextEncoder().encode(pw);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function checkAuth(req) {
  const cookie = req.headers.cookie || '';
  const match = /furka_session=([a-f0-9]{64})/.exec(cookie);
  if (!match) return false;
  if (!process.env.APP_PASSWORD) return false;
  const expected = await hashPassword(process.env.APP_PASSWORD);
  return match[1] === expected;
}
