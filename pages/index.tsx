import { useState, useEffect, useCallback } from "react";
import Head from "next/head";

interface UserScore {
  username: string;
  solve_count?: number;
  total_solves?: number;
}

interface DailyRow {
  username: string;
  date: string;
  solve_count: number;
}

interface SyncResult {
  username: string;
  count: number;
  status: "ok" | "error";
  error?: string;
}

interface ApiData {
  todayStr: string;
  weekStart: string;
  weekEnd: string;
  todayLeaderboard: UserScore[];
  weeklyLeaderboard: UserScore[];
  dailyBreakdown: DailyRow[];
  allHistory: DailyRow[];         // ← NEW: all-time history from DB
  syncResults: SyncResult[];
}

const RANK_EMOJIS = ["🥇", "🥈", "🥉"];

const USERNAMES_SHORT: Record<string, string> = {
  tharun_raj_28: "Tharun_Raj",
  "N-Varnika": "Varnika",
  Vasuntra: "Vasuntra",
  "vijay07-vj": "Vijayavarman",
  decimusmaximusmeridius: "Tamizharasan",
  "Nethra_Balan_G": "Netra_Balan",
  "Yaminii02": "Yamini",
<<<<<<< HEAD
=======
  "Nethra_Balan_G": "Nethra_Balan",
>>>>>>> 892cf62 (History changes)
};

function shortName(u: string) {
  return USERNAMES_SHORT[u] || u;
}

function Bar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="bar-track">
      <div className="bar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

function formatDate(d: string) {
<<<<<<< HEAD
  return new Date(d + "T00:00:00Z").toLocaleDateString("en-IN", {
=======
  const [y, m, day] = d.split("-").map(Number);
  const date = new Date(y, m - 1, day);
  return date.toLocaleDateString("en-IN", {
>>>>>>> 892cf62 (History changes)
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export default function Home() {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string | null>(null);
  const [tab, setTab] = useState<"today" | "week" | "history">("today");
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!loading) return;
    const iv = setInterval(() => setDots((d) => (d.length >= 3 ? "" : d + ".")), 400);
    return () => clearInterval(iv);
  }, [loading]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sync");
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json: ApiData = await res.json();
      setData(json);
      setLastRefresh(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const todayMax = Math.max(1, ...(data?.todayLeaderboard.map((u) => u.solve_count ?? 0) || []));
  const weekMax = Math.max(1, ...(data?.weeklyLeaderboard.map((u) => u.total_solves ?? 0) || []));

  // ── History matrix: built from allHistory (all-time), not dailyBreakdown ──
  const historyRows = data?.allHistory || [];

  const days: string[] = [];
  const seenDays = new Set<string>();
  for (const row of historyRows) {
    if (!seenDays.has(row.date)) {
      seenDays.add(row.date);
      days.push(row.date);
    }
  }

  // Members: respect known order, then any unknown usernames after
  const knownOrder = Object.keys(USERNAMES_SHORT);
  const seenMembers = new Set(historyRows.map((r) => r.username));
  const members = [
    ...knownOrder.filter((u) => seenMembers.has(u)),
    ...[...seenMembers].filter((u) => !knownOrder.includes(u)),
  ];

  const matrixMap: Record<string, number> = {};
  for (const row of historyRows) {
    matrixMap[`${row.username}__${row.date}`] = row.solve_count;
  }
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <Head>
        <title>LeetCode Progress Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap" rel="stylesheet" />
      </Head>

      <div className="root">
        <div className="scanlines" />

        <header className="header">
          <div className="header-left">
            <span className="logo-bracket">[</span>
            <span className="logo-text">LC</span>
            <span className="logo-bracket">]</span>
            <span className="title">Progress Tracker</span>
          </div>
          <div className="header-right">
            {lastRefresh && <span className="last-refresh">UPDATED {lastRefresh}</span>}
            <button
              className={`refresh-btn ${loading ? "loading" : ""}`}
              onClick={refresh}
              disabled={loading}
            >
              {loading ? `SYNCING${dots}` : "↻ REFRESH"}
            </button>
          </div>
        </header>

        {error && <div className="error-bar">⚠ {error}</div>}

        {loading && !data && (
          <div className="loading-screen">
            <div className="loading-inner">
              <div className="spinner" />
              <p>Fetching from LeetCode{dots}</p>
              <p className="loading-sub">Querying GraphQL · Writing to Neon DB</p>
            </div>
          </div>
        )}

        {data && (
          <main className="main">
            <div className="date-badge">
              <span className="date-label">TODAY</span>
              <span className="date-val">{formatDate(data.todayStr)}</span>
              <span className="date-sep">·</span>
              <span className="date-label">WEEK</span>
              <span className="date-val">{formatDate(data.weekStart)} → {formatDate(data.weekEnd)}</span>
            </div>

            <div className="tabs">
              {(["today", "week", "history"] as const).map((t) => (
                <button
                  key={t}
                  className={`tab ${tab === t ? "tab-active" : ""}`}
                  onClick={() => setTab(t)}
                >
                  {t === "today" ? "TODAY'S BOARD" : t === "week" ? "WEEKLY BOARD" : "HISTORY"}
                </button>
              ))}
            </div>

            {/* TODAY */}
            {tab === "today" && (
              <section className="board">
                <div className="board-header">
                  <span>RANK</span><span>CODER</span><span>SOLVED TODAY</span><span>BAR</span>
                </div>
                {data.todayLeaderboard.map((u, i) => (
                  <div key={u.username} className={`board-row ${i === 0 ? "row-gold" : i === 1 ? "row-silver" : i === 2 ? "row-bronze" : ""}`}>
                    <span className="rank">{i < 3 ? RANK_EMOJIS[i] : `#${i + 1}`}</span>
                    <span className="username">
                      <span className="username-short">{shortName(u.username)}</span>
                      <span className="username-full">{u.username}</span>
                    </span>
                    <span className="count">{u.solve_count ?? 0}<span className="count-label"> problems</span></span>
                    <span className="bar-cell"><Bar value={u.solve_count ?? 0} max={todayMax} /></span>
                  </div>
                ))}
              </section>
            )}

            {/* WEEK */}
            {tab === "week" && (
              <section className="board">
                <div className="board-header">
                  <span>RANK</span><span>CODER</span><span>WEEKLY TOTAL</span><span>BAR</span>
                </div>
                {data.weeklyLeaderboard.map((u, i) => (
                  <div key={u.username} className={`board-row ${i === 0 ? "row-gold" : i === 1 ? "row-silver" : i === 2 ? "row-bronze" : ""}`}>
                    <span className="rank">{i < 3 ? RANK_EMOJIS[i] : `#${i + 1}`}</span>
                    <span className="username">
                      <span className="username-short">{shortName(u.username)}</span>
                      <span className="username-full">{u.username}</span>
                    </span>
                    <span className="count">{u.total_solves ?? 0}<span className="count-label"> problems</span></span>
                    <span className="bar-cell"><Bar value={u.total_solves ?? 0} max={weekMax} /></span>
                  </div>
                ))}
              </section>
            )}

            {/* HISTORY */}
            {tab === "history" && (
              <section className="history">
                {days.length === 0 ? (
                  <p className="no-data">No history recorded yet.</p>
                ) : (
                  <div className="matrix-wrap">
                    <table className="matrix">
                      <thead>
                        <tr>
                          <th>CODER</th>
                          {days.map((d) => (
                            <th key={d}>{formatDate(d)}</th>
                          ))}
                          <th>TOTAL</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((m) => {
                          const total = days.reduce((s, d) => s + (matrixMap[`${m}__${d}`] || 0), 0);
                          return (
                            <tr key={m}>
                              <td className="matrix-name">{shortName(m)}</td>
                              {days.map((d) => {
                                const v = matrixMap[`${m}__${d}`] || 0;
                                return (
                                  <td key={d} className={`matrix-cell cell-${Math.min(v, 5)}`}>
                                    {v > 0 ? v : "·"}
                                  </td>
                                );
                              })}
                              <td className="matrix-total">{total}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            <div className="sync-row">
              <span className="sync-label">LAST SYNC:</span>
              {data.syncResults.map((r) => (
                <span key={r.username} className={`sync-pill ${r.status === "ok" ? "pill-ok" : "pill-err"}`} title={r.error}>
                  {shortName(r.username)} {r.status === "ok" ? "✓" : "✗"}
                </span>
              ))}
            </div>
          </main>
        )}
      </div>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0a0c0f;
          --surface: #111318;
          --surface2: #191c22;
          --border: #2a2d35;
          --text: #e2e8f0;
          --dim: #6b7280;
          --accent: #00e5a0;
          --accent2: #00b8d4;
          --gold: #f59e0b;
          --silver: #94a3b8;
          --bronze: #c2845f;
          --danger: #ef4444;
          --mono: 'Space Mono', monospace;
          --sans: 'Syne', sans-serif;
        }

        body {
          background: var(--bg);
          color: var(--text);
          font-family: var(--mono);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .root { position: relative; min-height: 100vh; }

        .scanlines {
          pointer-events: none;
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px
          );
          z-index: 100;
        }

        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2rem;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .header-left { display: flex; align-items: center; gap: 0.5rem; }
        .logo-bracket { color: var(--accent); font-size: 1.4rem; font-weight: 700; }
        .logo-text { color: var(--accent); font-size: 1.1rem; font-weight: 700; }
        .title { font-family: var(--sans); font-size: 1.1rem; font-weight: 800; letter-spacing: 0.05em; color: var(--text); margin-left: 0.4rem; }
        .header-right { display: flex; align-items: center; gap: 1rem; }
        .last-refresh { font-size: 0.65rem; color: var(--dim); letter-spacing: 0.08em; }

        .refresh-btn {
          background: transparent;
          border: 1px solid var(--accent);
          color: var(--accent);
          font-family: var(--mono);
          font-size: 0.7rem;
          padding: 0.4rem 1rem;
          cursor: pointer;
          letter-spacing: 0.1em;
          transition: all 0.2s;
        }
        .refresh-btn:hover:not(:disabled) { background: var(--accent); color: var(--bg); }
        .refresh-btn.loading { opacity: 0.6; cursor: not-allowed; border-color: var(--dim); color: var(--dim); }

        .error-bar {
          background: rgba(239,68,68,0.1);
          border-bottom: 1px solid rgba(239,68,68,0.3);
          color: var(--danger);
          padding: 0.6rem 2rem;
          font-size: 0.8rem;
        }

        .loading-screen { display: flex; align-items: center; justify-content: center; min-height: 60vh; }
        .loading-inner { text-align: center; }
        .spinner {
          width: 40px; height: 40px;
          border: 2px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 1.2rem;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .loading-inner p { color: var(--accent); font-size: 0.85rem; }
        .loading-sub { color: var(--dim); font-size: 0.7rem; margin-top: 0.3rem; }

        .main { max-width: 900px; margin: 0 auto; padding: 2rem 1.5rem; }

        .date-badge {
          display: flex; align-items: center; gap: 0.6rem;
          margin-bottom: 1.5rem; font-size: 0.72rem; flex-wrap: wrap;
        }
        .date-label { color: var(--accent2); letter-spacing: 0.12em; }
        .date-val { color: var(--text); }
        .date-sep { color: var(--border); }

        .tabs { display: flex; gap: 0; border-bottom: 1px solid var(--border); margin-bottom: 2rem; }
        .tab {
          background: transparent; border: none;
          border-bottom: 2px solid transparent;
          color: var(--dim); font-family: var(--mono);
          font-size: 0.7rem; letter-spacing: 0.1em;
          padding: 0.6rem 1.2rem; cursor: pointer; transition: all 0.15s;
        }
        .tab:hover { color: var(--text); }
        .tab-active { color: var(--accent); border-bottom-color: var(--accent); }

        .board { display: flex; flex-direction: column; gap: 0; border: 1px solid var(--border); }
        .board-header {
          display: grid; grid-template-columns: 3rem 1fr 8rem 1fr;
          gap: 1rem; padding: 0.6rem 1.2rem;
          background: var(--surface2); font-size: 0.62rem;
          letter-spacing: 0.12em; color: var(--dim);
          border-bottom: 1px solid var(--border);
        }
        .board-row {
          display: grid; grid-template-columns: 3rem 1fr 8rem 1fr;
          gap: 1rem; align-items: center;
          padding: 0.85rem 1.2rem;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }
        .board-row:last-child { border-bottom: none; }
        .board-row:hover { background: var(--surface2); }
        .row-gold { background: rgba(245,158,11,0.04); }
        .row-silver { background: rgba(148,163,184,0.03); }
        .row-bronze { background: rgba(194,132,95,0.03); }

        .rank { font-size: 1.1rem; }
        .username { display: flex; flex-direction: column; }
        .username-short { font-family: var(--sans); font-weight: 600; font-size: 0.95rem; }
        .username-full { font-size: 0.6rem; color: var(--dim); margin-top: 1px; }
        .count { font-size: 1.1rem; font-weight: 700; color: var(--accent); }
        .count-label { font-size: 0.6rem; color: var(--dim); }
        .bar-cell { display: flex; align-items: center; }
        .bar-track { width: 100%; height: 6px; background: var(--surface2); border-radius: 3px; overflow: hidden; }
        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent2), var(--accent));
          border-radius: 3px; transition: width 0.6s ease;
        }

        .history { overflow-x: auto; width: 100%; }
        .matrix-wrap { width: max-content; min-width: 100%; }
        .matrix { border-collapse: collapse; font-size: 0.72rem; width: 100%; }
        .matrix th, .matrix td { padding: 0.6rem 0.8rem; text-align: center; border: 1px solid var(--border); white-space: nowrap; }
        .matrix th { background: var(--surface2); color: var(--dim); letter-spacing: 0.08em; font-size: 0.6rem; min-width: 90px; }
        .matrix-name { text-align: left; font-family: var(--sans); font-weight: 600; white-space: nowrap; min-width: 120px; }
        .matrix-total { font-weight: 700; color: var(--accent); }
        .matrix-cell { color: var(--dim); }
        .cell-0 { background: var(--bg); color: var(--border); }
        .cell-1 { background: rgba(0,184,212,0.08); color: var(--accent2); }
        .cell-2 { background: rgba(0,184,212,0.15); color: var(--accent2); }
        .cell-3 { background: rgba(0,229,160,0.12); color: var(--accent); }
        .cell-4 { background: rgba(0,229,160,0.2); color: var(--accent); }
        .cell-5 { background: rgba(0,229,160,0.3); color: var(--accent); font-weight: 700; }

        .no-data { color: var(--dim); font-size: 0.8rem; padding: 2rem; text-align: center; }

        .sync-row {
          display: flex; flex-wrap: wrap; align-items: center;
          gap: 0.4rem; margin-top: 2rem; padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
        .sync-label { font-size: 0.6rem; color: var(--dim); letter-spacing: 0.1em; }
        .sync-pill { font-size: 0.6rem; padding: 0.2rem 0.5rem; border-radius: 2px; cursor: default; }
        .pill-ok { background: rgba(0,229,160,0.1); color: var(--accent); border: 1px solid rgba(0,229,160,0.2); }
        .pill-err { background: rgba(239,68,68,0.1); color: var(--danger); border: 1px solid rgba(239,68,68,0.2); }

        @media (max-width: 600px) {
          .header { padding: 0.8rem 1rem; }
          .title { font-size: 0.85rem; }
          .main { padding: 1rem; }
          .board-header, .board-row { grid-template-columns: 2.5rem 1fr 5rem; }
          .board-header span:last-child, .board-row .bar-cell { display: none; }
          .count { font-size: 0.9rem; }
        }
      `}</style>
    </>
  );
}
