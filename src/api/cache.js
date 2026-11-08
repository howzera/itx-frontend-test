/**
 * Client cache with expiration, stored in localStorage so it survives a page reload.
 *
 * Each entry keeps the moment it was saved: { savedAt, value }.
 * `get` also returns expired entries (marked `fresh: false`) so the caller can use
 * them as a fallback if the API fails ("stale-if-error").
 */
export function createCache({ storage = globalThis.localStorage, ttlMs, now = Date.now, prefix = 'itx.cache.' }) {
  return {
    get(key) {
      try {
        const raw = storage.getItem(prefix + key);
        if (raw === null) return null;
        const { savedAt, value } = JSON.parse(raw);
        return { value, fresh: now() - savedAt < ttlMs };
      } catch {
        // Corrupted entry or blocked storage: behave as a miss.
        return null;
      }
    },

    set(key, value) {
      try {
        storage.setItem(prefix + key, JSON.stringify({ savedAt: now(), value }));
      } catch {
        // Quota exceeded or private mode: the app still works, only without cache.
      }
    },
  };
}
