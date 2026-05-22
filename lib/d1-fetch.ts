const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || "";
const DATABASE_ID = process.env.CLOUDFLARE_D1_DATABASE_ID || "";
const API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || "";

export async function d1Query<T>(sql: string, params: unknown[] = []): Promise<T[]> {
  if (!ACCOUNT_ID || !DATABASE_ID || !API_TOKEN) return [];
  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql, params }),
      }
    );
    const data = await res.json() as { result?: { results: T[] }[] };
    return data.result?.[0]?.results ?? [];
  } catch {
    return [];
  }
}
