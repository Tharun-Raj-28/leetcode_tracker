# LeetCode Progress Tracker

A full-stack Next.js app that tracks daily LeetCode solve counts for your group, refreshes on every page load, and shows a daily + weekly leaderboard backed by Neon PostgreSQL.

## Features

- **Auto-sync on refresh** — every page load hits `/api/sync`, fetches live data from LeetCode GraphQL, writes to DB, and returns the leaderboard
- **Today's leaderboard** — unique problems solved today per person
- **Weekly leaderboard** — total unique problems per person this week (Mon–Sun)
- **History matrix** — heat-map table of daily solves for the whole week
- **Sync status** — shows which users synced successfully vs failed

## Members tracked

- tharun_raj_28
- N-Varnika
- Vasuntra
- vijay07-vj
- decimusmaximusmeridius

To add/remove members, edit `lib/leetcode.ts` → the `MEMBERS` array.

---

## Deploy on Vercel (step-by-step)

### 1. Push to GitHub

```bash
cd leetcode-tracker
git init
git add .
git commit -m "initial"
git remote add origin https://github.com/YOUR_USERNAME/leetcode-tracker.git
git push -u origin main
```

### 2. Create project on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Click **Deploy** (it will fail — you need the env var next)

### 3. Add environment variable

In your Vercel project → **Settings → Environment Variables**:

| Name | Value |
|------|-------|
| `NEON_DATABASE_URL` | `postgresql://neondb_owner:PASSWORD@ep-xxx.neon.tech/neondb?sslmode=require` |

Copy your exact connection string from `.env` (the one already in your original project).

### 4. Redeploy

Go to **Deployments** → pick the latest → **Redeploy**. Your site will be live at `https://your-project.vercel.app`.

---

## Local development

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your NEON_DATABASE_URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How it works

```
Browser loads page
       ↓
React useEffect → fetch /api/sync
       ↓
API route:
  1. setupDb()        — creates table if not exists
  2. syncAll()        — fetches LeetCode GraphQL for all members
  3. upsert()         — writes solve counts to Neon PostgreSQL
  4. getTodayLeaderboard()  — query DB for today
  5. getWeeklyLeaderboard() — query DB for this week
  6. getDailyBreakdown()    — query DB for history
       ↓
JSON returned to browser → renders leaderboard
```

The LeetCode query fetches the last 20 **accepted** submissions per user, deduplicates by `titleSlug` per day, and stores unique problem counts. Re-submitting the same problem won't inflate the count.

---

## Database schema

```sql
CREATE TABLE daily_solves (
    username    TEXT        NOT NULL,
    date        DATE        NOT NULL,
    solve_count INTEGER     DEFAULT 0,
    updated_at  TIMESTAMP   DEFAULT NOW(),
    PRIMARY KEY (username, date)
);
```

The table is created automatically on first request.
