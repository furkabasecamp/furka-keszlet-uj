import { sql } from '../lib/db.js';
import { checkAuth } from '../lib/auth.js';

export default async function handler(req, res) {
  if (!(await checkAuth(req))) return res.status(401).json({ error: 'unauthorized' });
  try {
    if (req.method === 'PATCH') {
      const { id, qty } = req.body || {};
      if (!id || !qty || qty <= 0) return res.status(400).json({ error: 'invalid' });
      const [log] = await sql`SELECT * FROM logs WHERE id = ${id}`;
      if (!log) return res.status(404).json({ error: 'not_found' });
      const diff = qty - log.qty;
      if (log.product_id) {
        if (log.type === 'sale') {
          await sql`UPDATE products SET stock = GREATEST(0, stock - ${diff}) WHERE id = ${log.product_id}`;
        } else {
          await sql`UPDATE products SET stock = GREATEST(0, stock + ${diff}) WHERE id = ${log.product_id}`;
        }
      }
      await sql`UPDATE logs SET qty = ${qty} WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }
    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'invalid' });
      const [log] = await sql`SELECT * FROM logs WHERE id = ${id}`;
      if (!log) return res.status(404).json({ error: 'not_found' });
      if (log.product_id) {
        if (log.type === 'sale') {
          await sql`UPDATE products SET stock = stock + ${log.qty} WHERE id = ${log.product_id}`;
        } else {
          await sql`UPDATE products SET stock = GREATEST(0, stock - ${log.qty}) WHERE id = ${log.product_id}`;
        }
      }
      await sql`DELETE FROM logs WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }
    res.status(405).end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'db_error' });
  }
}
