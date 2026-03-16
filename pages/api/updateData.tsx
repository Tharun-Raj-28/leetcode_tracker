import type { NextApiRequest, NextApiResponse } from "next";
import { syncAll } from "../../lib/leetcode";     // your LeetCode file
import { setupDb, upsert } from "../../lib/db";   // your DB file

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // ensure table exists
    await setupDb();

    // today's date (UTC)
    const today = new Date().toISOString().split("T")[0];

    // fetch solve counts from LeetCode
    const results = await syncAll(today);

    // store results in database
    for (const r of results) {
      if (r.status === "ok") {
        await upsert(r.username, today, r.count);
      }
    }

    return res.status(200).json({
      message: "Leaderboard updated successfully",
      date: today,
      results,
    });
  } catch (err: unknown) {
    console.error("Update failed:", err);

    return res.status(500).json({
      error: "Database update failed",
      details: err instanceof Error ? err.message : String(err),
    });
  }
}