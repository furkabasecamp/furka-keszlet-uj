import { sql } from '../lib/db.js';
import { checkAuth } from '../lib/auth.js';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (!(await checkAuth(req))) return res.status(401).json({ error: 'unauthorized' });
  if (req.method !== 'POST') return res.status(405).end();
  const { id, qty } = req.body || {};
  if (!id || !qty || qty <= 0) return res.status(400).json({ error: 'invalid' });
  try {
    const [product] = await sql`SELECT * FROM products WHERE id = ${id}`;
    if (!product) return res.status(404).json({ error: 'not_found' });
    await sql`UPDATE products SET stock = stock + ${qty} WHERE id = ${id}`;
    await sql`INSERT INTO logs (id, product_id, type, qty, price, ts)
      VALUES (${crypto.randomUUID()}, ${id}, 'restock', ${qty}, ${product.price}, ${Date.now()})`;
    res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db_error' });
  }
}
