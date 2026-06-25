/**
 * Rate limiter em memória, best-effort. Em ambiente serverless o estado é por
 * instância e some em cold start — suficiente para conter flood básico de um
 * formulário público sem depender de Redis/Upstash. Para limite global e
 * persistente, trocar por @upstash/ratelimit.
 */
type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000,
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { ok: false, remaining: 0 };
  }

  entry.count += 1;
  return { ok: true, remaining: limit - entry.count };
}
