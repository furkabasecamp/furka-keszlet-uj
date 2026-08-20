import { sql } from '../lib/db.js';
import { checkAuth } from '../lib/auth.js';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (!(await checkAuth(req))) return res.status(401).json({ error: 'unauthorized' });
  try {
    if (req.method === 'POST') {
      const { id, name, category, price, stock, lowThreshold, photo } = req.body || {};
      if (!name) return res.status(400).json({ error: 'name_required' });
      if (id) {
        await sql`UPDATE products SET name=${name}, category=${category}, price=${price},
          stock=${stock}, low_threshold=${lowThreshold}, photo=${photo} WHERE id=${id}`;
      } else {
        const newId = crypto.randomUUID();
        await sql`INSERT INTO products (id, name, category, price, stock, low_threshold, photo)
          VALUES (${newId}, ${name}, ${category}, ${price}, ${stock || 0}, ${lowThreshold || 0}, ${photo})`;
      }
      return res.status(200).json({ ok: true });
    }
    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id_required' });
      await sql`DELETE FROM logs WHERE product_id = ${id}`;
      await sql`DELETE FROM products WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }
    res.status(405).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db_error' });
  }
}
