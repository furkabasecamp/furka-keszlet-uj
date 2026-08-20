import { neon } from '@neondatabase/serverless';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL kornyezeti valtozo hianyzik!');
}

export const sql = neon(process.env.DATABASE_URL);
