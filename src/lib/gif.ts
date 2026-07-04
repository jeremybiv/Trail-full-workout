import { EX_SEARCH } from '../data/exercises';

export const gifCache = new Map<string, string | null>();

const PROXIES = [
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
];

export async function loadGif(id: string): Promise<string | null> {
  if (gifCache.has(id)) return gifCache.get(id) ?? null;

  const term = EX_SEARCH[id];
  if (!term) { gifCache.set(id, null); return null; }

  const api = `https://oss.exercisedb.dev/api/v1/exercises/name/${encodeURIComponent(term)}`;

  for (const proxy of PROXIES) {
    try {
      const ac = new AbortController();
      const t = setTimeout(() => ac.abort(), 6000);
      const res = await fetch(proxy(api), { signal: ac.signal });
      clearTimeout(t);
      if (!res.ok) continue;
      const data = await res.json();
      const items = Array.isArray(data) ? data : (data.data ?? []);
      if (items[0]?.gifUrl) {
        gifCache.set(id, items[0].gifUrl as string);
        return items[0].gifUrl as string;
      }
    } catch {
      continue;
    }
  }

  gifCache.set(id, null);
  return null;
}

export function preload(ids: string[], onUpdate: () => void): void {
  [...new Set(ids)].forEach((id) => {
    void loadGif(id).then((url) => {
      if (url) onUpdate();
    });
  });
}
