import { sql } from '../lib/db.js';
import { checkAuth } from '../lib/auth.js';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (!(await checkAuth(req))) return res.status(401).json({ error: 'unauthorized' });
  if (req.method !== 'POST') return res.status(405).end();
  const { changes } = req.body || {};
  if (!Array.isArray(changes)) return res.status(400).json({ error: 'invalid' });
  try {
    let totalSoldQty = 0, totalSoldChf = 0, changed = 0;
    for (const c of changes) {
      const [product] = await sql`SELECT * FROM products WHERE id = ${c.id}`;
      if (!product) continue;
      const newCount = Math.max(0, parseInt(c.newStock, 10));
      if (isNaN(newCount) || newCount === product.stock) continue;
      changed++;
      const now = Date.now();
      if (newCount < product.stock) {
        const sold = product.stock - newCount;
        await sql`INSERT INTO logs (id, product_id, type, qty, price, ts)
          VALUES (${crypto.randomUUID()}, ${product.id}, 'sale', ${sold}, ${product.price}, ${now})`;
        totalSoldQty += sold;
        totalSoldChf += sold * product.price;
      } else {
        const gained = newCount - product.stock;
        await sql`INSERT INTO logs (id, product_id, type, qty, price, ts)
          VALUES (${crypto.randomUUID()}, ${product.id}, 'restock', ${gained}, ${product.price}, ${now})`;
      }
      await sql`UPDATE products SET stock = ${newCount} WHERE id = ${product.id}`;
    }
    res.status(200).json({ ok: true, changed, totalSoldQty, totalSoldChf });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db_error' });
  }
}
