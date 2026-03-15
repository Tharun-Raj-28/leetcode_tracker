const MEMBERS = [
  "decimusmaximusmeridius",
  "tharun_raj_28",
  "N-Varnika",
  "Vasuntra",
  "vijay07-vj",
  "Yaminii02",
  "Nethra_Balan_G",
];

export { MEMBERS };

const GRAPHQL_URL = "https://leetcode.com/graphql/";

const AC_SUBMISSIONS_QUERY = `
query recentAcSubmissions($username: String!, $limit: Int!) {
  recentAcSubmissionList(username: $username, limit: $limit) {
    id
    title
    titleSlug
    timestamp
  }
}
`;

async function getCsrfToken(): Promise<string> {
  try {
    const res = await fetch("https://leetcode.com/", {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });
    const cookieHeader = res.headers.get("set-cookie") || "";
    const match = cookieHeader.match(/csrftoken=([^;]+)/);
    return match ? match[1] : "";
  } catch {
    return "";
  }
}

export async function fetchUniqueProblemsPerDay(
  username: string,
  csrf: string
): Promise<Record<string, number>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    Referer: `https://leetcode.com/${username}/`,
    Origin: "https://leetcode.com",
  };
  if (csrf) {
    headers["x-csrftoken"] = csrf;
    headers["Cookie"] = `csrftoken=${csrf}`;
  }

  const payload = {
    query: AC_SUBMISSIONS_QUERY,
    variables: { username, limit: 20 },
    operationName: "recentAcSubmissions",
  };

  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  const submissions = data?.data?.recentAcSubmissionList;
  if (submissions === null || submissions === undefined) {
    const errors = data?.errors || [];
    throw new Error(`User '${username}' not found or private. ${JSON.stringify(errors)}`);
  }

  // Group by date, deduplicate by titleSlug
  const dateProblems: Record<string, Set<string>> = {};
  for (const sub of submissions) {
    const ts = parseInt(sub.timestamp, 10);
    const date = new Date(ts * 1000);
    const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD UTC
    if (!dateProblems[dateStr]) dateProblems[dateStr] = new Set();
    dateProblems[dateStr].add(sub.titleSlug);
  }

  const result: Record<string, number> = {};
  for (const [date, slugs] of Object.entries(dateProblems)) {
    result[date] = slugs.size;
  }
  return result;
}

export interface SyncResult {
  username: string;
  count: number;
  status: "ok" | "error";
  error?: string;
}

export async function syncAll(todayStr: string): Promise<SyncResult[]> {
  const csrf = await getCsrfToken();
  const results: SyncResult[] = [];

  for (const username of MEMBERS) {
    try {
      const perDay = await fetchUniqueProblemsPerDay(username, csrf);
      const todayCount = perDay[todayStr] || 0;
      results.push({ username, count: todayCount, status: "ok" });
    } catch (e: unknown) {
      results.push({
        username,
        count: 0,
        status: "error",
        error: e instanceof Error ? e.message : String(e),
      });
    }
    // small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 500));
  }

  return results;
}
