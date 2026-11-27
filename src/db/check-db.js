import { eq, sql } from 'drizzle-orm';
import { db, pool } from './db.js';
import { commentary, matches } from './schema.js';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not configured in .env.local or .env');
}

try {
  const [match] = await db.insert(matches).values({
    sport: 'football',
    homeTeam: 'Home Team',
    awayTeam: 'Away Team',
    startTime: new Date(),
  }).returning();
  await db.insert(commentary).values({
    matchId: match.id,
    minute: 0,
    sequence: 1,
    period: 'first half',
    eventType: 'kickoff',
    message: 'Match started',
  });
  const rows = await db.select().from(commentary).where(eq(commentary.matchId, match.id));
  console.log('commentary:', rows);

  const result = await db.execute(sql`SELECT version()`);
  console.log('Postgres version:', result.rows[0].version);
} finally {
  await pool.end();
}