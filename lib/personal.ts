export interface RecentGame {
  slug: string;
  playedAt: number;
  playCount: number;
}

export const FAVORITES_STORAGE_KEY = "astra-arcade:favorites";
export const RECENT_STORAGE_KEY = "astra-arcade:recent";
const MAX_RECENT_GAMES = 12;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function readFavorites(): string[] {
  const value = readJson<unknown>(FAVORITES_STORAGE_KEY, []);
  return Array.isArray(value) ? value.filter((slug): slug is string => typeof slug === "string") : [];
}

export function writeFavorites(slugs: string[]) {
  try { window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...new Set(slugs)])); } catch { /* Storage can be disabled. */ }
}

export function readRecentGames(): RecentGame[] {
  const value = readJson<unknown>(RECENT_STORAGE_KEY, []);
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is RecentGame => Boolean(item) && typeof item === "object" && typeof (item as RecentGame).slug === "string" && typeof (item as RecentGame).playedAt === "number" && typeof (item as RecentGame).playCount === "number");
}

export function recordGamePlay(slug: string): RecentGame[] {
  const recent = readRecentGames();
  const existing = recent.find((item) => item.slug === slug);
  const next = [{ slug, playedAt: Date.now(), playCount: (existing?.playCount ?? 0) + 1 }, ...recent.filter((item) => item.slug !== slug)].slice(0, MAX_RECENT_GAMES);
  try { window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next)); } catch { /* Storage can be disabled. */ }
  return next;
}
