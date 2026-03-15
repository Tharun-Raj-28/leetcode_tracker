const MEMBERS = [
  "abhishek_yadav_m",
"abi_lasha-2006",
"ABISHEK_K_M",
"ABSrinitha",
"Aishu_0711",
"Ajay_Kumar-011",
"Akshaya_1020",
"Akshaya_devakumar14",
"akshcs013",
"Andhena_Nireesha",
"andrea_mercy06",
"ANJALI_E_S",
"AnuR_016",
"Anusuya_6077",
"mokshavardhansai",
"Arthy_I",
"Aswinkumar_20",
"ATMAKURIRAVITEJA",
"cr6SUzbgKV",
"Srayan_brahma_006",
"bhavana126",
"BHAVISH_10",
"BiradavoluNoshitha18",
"8yhIv7XaJh",
"dhushyanth_______reddy",
"Chandra033",
"chandru00",
"kchethan_24",
"zQMniHKEPh",
"AnusriChirukurapati",
"tejeshvarma2006",
"deepak_m_",
"Deepika_S29",
"Dhanush_Rm",
"dharmesh_1308",
"dhashu",
"_Divya_02",
"00Ej9LcSIS",
"Abitha08",
"GADDAMKOUSHIK",
"gajulavishnu_15",
"thanvi_chinni",
"gandikotaravi",
"Ganesh0902",
"giritv",
"HarshiniNew",
"sai_rohith2303",
"gowtham_21_05",
"Gunashree_29",
"Balaji056",
"officialharikrishnans",
"Kamali_665",
"harish__46__",
"SwtwHjA0s8",
"infantebsin",
"Janani_Sureshkumar",
"__Jeevitha__M",
"8nk3MxYq2i",
"jyotheesh_81",
"kamaleshag96",
"PoojaReddy084",
"kani1910",
"bhanusruthi",
"kaushik0325kumar",
"Kavithalakshmi4",
"KaviyaKumar_V",
"keerthivasan_01",
"keshh_ika06",
"Kiranmaya-official",
"Kiruthika_Sankar",
"Kishoore_29",
"SaiReddy_23",
"dhanya_sree102005",
"Jeswitha28",
"gitkoti200",
"sricharitha28",
"kowsalya_2005",
"VEbxmKj5a0",
"LAHARI-_2006",
"laksh212",
"Lithika_D",
"THfpmrsVNS",
"Xnj7rVqDN2",
"6j8z1EdauU",
"jittu1110",
"saijyoshna12",
"MANIBARATHI1718",
"111623102115",
"mathika04",
"Mathumitha_27",
"midhu_0309",
"5c5v5NVXXQ",
"moha_106",
"monika2027",
"monish_25",
"mridu_2810",
"Murali_2701",
"MunagapatiRishitha005",
"Nancy_19_",
"Nanda_55",
"eNSHStfmYF",
"OvZRk5AH75",
"Nethra_Balan_G",
"niki_676",
"dir__7878",
"ravillanishanth2005",
"nithinsage",
"MR_NITHISH_26",
"nithishm_2005",
"Nithya0221",
"NItishrameshpp",
"parnashanmukasaisandeep",
"Pavithra_Manivannan",
"penjcs_var",
"ranjitha2809",
"pragadeesh_3008",
"pramodram",
"pras_07",
"_riya_harshini_",
"PRIYA_-23",
"pavan__05",
"Rackshita",
"Raghavi_081204",
"raja_28",
"rajasakthieswaran",
"Rakshitha_1304",
"S-Ramitha_7",
"Rangineni_SaiNithish",
"K9xId0RviY",
"IB35hgMtwf",
"Sachin_Kumar07",
"sahaana__je",
"Sahana_Krishnan29",
"SAIDHANUSH_2909",
"Sai_krishna141",
"T7RixMPjnx",
"Samhita19",
"sanjanashreedd",
"saranya181",
"FyYp7p7lVn",
"Sarimitha",
"SATHYA__C",
"savitha2226",
"WzKhcOdAsT",
"Shalini_188",
"Shanmathi-C",
"Sharmi24",
"Shammujeenu_7483",
"7TvIJb5ndZ",
"Shree_harine",
"shyam545",
"smirti",
"Sneha9732",
"PravalikaSomisetty",
"sreeharshini2005",
"srinivasangv1608",
"sriranjaniS",
"vishwaa55",
"sunil-108",
"SUYAMBULINGAMM",
"decimusmaximusmeridius",
"Chayank__T",
"Manu_207",
"tharun_raj_28",
"mani00299",
"lalith_manjunath_reddy",
"yashwanth_2912",
"9014767760",
"N-Varnika",
"varsha_shree1604",
"vasanth_6299",
"Vasuntra",
"vigneshpraveen-official",
"vijay07-vj",
"vikramkumarofficial",
"VontimittaJaswanth",
"Xavier_04",
"Yaminii02",
"yaswanth1801",
"yeswanth_2005",
"yogalakshmissankarm",
"21092004",
"zakiya_0212",
"RazzorPets",
"Abinash_55",
"X6g2NMWDMx",
"Lavanya__2005",
"darwingowtham",
"RUPAKRITVIK",
"avanthikaaa",
"lxGppUCCOw",
"UJCyYkb26w",
"samadarmi",
"vLMN2LmOqe",
"uC13BEcWC9",
"Kalai0605",
"tgCYp40LtP",
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
