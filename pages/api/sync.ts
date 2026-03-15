import type { NextApiRequest, NextApiResponse } from "next";
import { setupDb, upsert, getTodayLeaderboard, getWeeklyLeaderboard, getDailyBreakdown } from "../../lib/db";
import { syncAll, MEMBERS } from "../../lib/leetcode";

function getWeekBounds(today: Date): { start: string; end: string } {
  // Week starts Monday
  const d = new Date(today);
  const day = d.getUTCDay(); // 0=Sun, 1=Mon...
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diffToMonday);
  const start = d.toISOString().split("T")[0];
  const end = today.toISOString().split("T")[0];
  return { start, end };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    await setupDb();

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const { start: weekStart, end: weekEnd } = getWeekBounds(now);

    // Run sync (fetch from LeetCode and write to DB)
    const syncResults = await syncAll(todayStr);

    // Write synced results to DB
    for (const r of syncResults) {
      if (r.status === "ok") {
        await upsert(r.username, todayStr, r.count);
      }
    }

    // Fetch leaderboard data
    const [todayBoard, weekBoard, dailyBreakdown] = await Promise.all([
      getTodayLeaderboard(todayStr),
      getWeeklyLeaderboard(weekStart, weekEnd),
      getDailyBreakdown(weekStart, weekEnd),
    ]);

    // Ensure all members appear in today's board even if 0
    const todayMap = new Map(todayBoard.map((r: { username: string; solve_count: number }) => [r.username, r.solve_count]));
    const fullTodayBoard = MEMBERS.map((u) => ({
      username: u,
      solve_count: todayMap.get(u) ?? 0,
    })).sort((a, b) => b.solve_count - a.solve_count);

    const weekMap = new Map(weekBoard.map((r: { username: string; total_solves: number }) => [r.username, Number(r.total_solves)]));
    const fullWeekBoard = MEMBERS.map((u) => ({
      username: u,
      total_solves: weekMap.get(u) ?? 0,
    })).sort((a, b) => b.total_solves - a.total_solves);

    return res.status(200).json({
      todayStr,
      weekStart,
      weekEnd,
      syncResults,
      todayLeaderboard: fullTodayBoard,
      weeklyLeaderboard: fullWeekBoard,
      dailyBreakdown,
    });
  } catch (err: unknown) {
    console.error(err);
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Internal server error",
    });
  }
}
