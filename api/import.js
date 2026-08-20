import { sql } from '../lib/db.js';
import { checkAuth } from '../lib/auth.js';

export default async function handler(req, res) {
  if (!(await checkAuth(req))) return res.status(401).json({ error: 'unauthorized' });
  if (req.method !== 'POST') return res.status(405).end();
  const { products, logs } = req.body || {};
  if (!Array.isArray(products) || !Array.isArray(logs)) {
    return res.status(400).json({ error: 'invalid' });
  }
  try {
    for (const p of products) {
      await sql`INSERT INTO products (id, name, category, price, stock, low_threshold, photo)
        VALUES (${p.id}, ${p.name}, ${p.category}, ${p.price}, ${p.stock}, ${p.lowThreshold}, ${p.photo})
        ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, category=EXCLUDED.category,
          price=EXCLUDED.price, stock=EXCLUDED.stock, low_threshold=EXCLUDED.low_threshold,
          photo=EXCLUDED.photo`;
    }
    for (const l of logs) {
      await sql`INSERT INTO logs (id, product_id, type, qty, price, ts)
        VALUES (${l.id}, ${l.productId}, ${l.type}, ${l.qty}, ${l.price}, ${l.ts})
        ON CONFLICT (id) DO NOTHING`;
    }
    res.status(200).json({ ok: true, importedProducts: products.length, importedLogs: logs.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db_error' });
  }
}
