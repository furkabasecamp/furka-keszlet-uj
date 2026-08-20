import { sql } from '../lib/db.js';
import { checkAuth } from '../lib/auth.js';

export default async function handler(req, res) {
  if (!(await checkAuth(req))) return res.status(401).json({ error: 'unauthorized' });
  if (req.method !== 'GET') return res.status(405).end();
  try {
    const products = await sql`
      SELECT id, name, category, price::float AS price, stock,
             low_threshold AS "lowThreshold", photo
      FROM products ORDER BY category, name`;
    const logs = await sql`
      SELECT id, product_id AS "productId", type, qty, price::float AS price, ts::bigint AS ts
      FROM logs ORDER BY ts DESC LIMIT 1000`;
    res.status(200).json({ products, logs });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db_error' });
  }
}
