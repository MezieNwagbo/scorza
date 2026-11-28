import express from 'express';
import { sql } from 'drizzle-orm';
import { db } from './db/db.js';
import {matchRouter} from "./routes/matches.js";

const app = express();
const port = 8000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Scorza!');
});

app.get('/db/version', async (req, res) => {
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({ error: 'DATABASE_URL is not configured' });
  }

  const result = await db.execute(sql`SELECT version()`);
  res.json({ version: result.rows[0].version });
});

app.use('/matches', matchRouter);

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});