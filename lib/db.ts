import { Pool } from "pg";

let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const connStr = process.env.NEON_DATABASE_URL || "";
    const needsSsl = connStr.includes("sslmode=require") || connStr.includes("sslmode=prefer");
    pool = new Pool({
      connectionString: connStr,
      ...(needsSsl ? { ssl: { rejectUnauthorized: false } } : {}),
      max: 5,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

export async function query(text: string, params?: unknown[]) {
  const client = await getPool().connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}

export async function setupDb() {
  await query(`
    CREATE TABLE IF NOT EXISTS daily_solves (
      username    TEXT        NOT NULL,
      date        DATE        NOT NULL,
      solve_count INTEGER     DEFAULT 0,
      updated_at  TIMESTAMP   DEFAULT NOW(),
      PRIMARY KEY (username, date)
    );
  `);
}

export async function upsert(username: string, dateStr: string, count: number) {
  await query(
    `INSERT INTO daily_solves (username, date, solve_count, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (username, date)
     DO UPDATE SET solve_count = EXCLUDED.solve_count, updated_at = NOW();`,
    [username, dateStr, count]
  );
}

export async function getTodayLeaderboard(dateStr: string) {
  const res = await query(
    `SELECT username, solve_count
     FROM daily_solves
     WHERE date = $1
     ORDER BY solve_count DESC;`,
    [dateStr]
  );
  return res.rows;
}

export async function getWeeklyLeaderboard(startDate: string, endDate: string) {
  const res = await query(
    `SELECT username, SUM(solve_count) as total_solves
     FROM daily_solves
     WHERE date >= $1 AND date <= $2
     GROUP BY username
     ORDER BY total_solves DESC;`,
    [startDate, endDate]
  );
  return res.rows;
}

export async function getDailyBreakdown(startDate: string, endDate: string) {
  const res = await query(
    `SELECT username, date, solve_count
     FROM daily_solves
     WHERE date >= $1 AND date <= $2
     ORDER BY date ASC, solve_count DESC;`,
    [startDate, endDate]
  );
  return res.rows;
}
