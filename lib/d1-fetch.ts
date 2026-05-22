import { getRequestContext } from '@cloudflare/next-on-pages';

export async function d1Query<T = unknown>(
  sql: string,
  params: (string | number | null)[] = []
): Promise<T[]> {
  try {
    const { env } = getRequestContext();
    const db = (env as CloudflareEnv).DB;
    const result = await db.prepare(sql).bind(...params).all<T>();
    return result.results ?? [];
  } catch (err) {
    console.error('[d1Query] error:', err);
    return [];
  }
}
