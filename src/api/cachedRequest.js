import { CACHE_TTL_MS } from './config.js';
import { createCache } from './cache.js';
import { requestJson } from './httpClient.js';

/**
 * GET with cache:
 * 1. Fresh entry (< 1 h)  -> returned at once, no network.
 * 2. Missing or expired  -> fetch, save, return (revalidation).
 * 3. Fetch fails         -> if there is an expired entry, return it; else throw.
 *
 * Concurrent calls for the same path share one request (in-flight de-duplication),
 * e.g. the detail page and the breadcrumbs asking for the same product.
 */
export function createCachedGet({ cache = createCache({ ttlMs: CACHE_TTL_MS }), fetcher = requestJson } = {}) {
  const inFlight = new Map();

  return function cachedGet(path) {
    const cached = cache.get(path);
    if (cached?.fresh) return Promise.resolve(cached.value);

    if (inFlight.has(path)) return inFlight.get(path);

    const request = fetcher(path)
      .then((value) => {
        cache.set(path, value);
        return value;
      })
      .catch((error) => {
        if (cached) return cached.value;
        throw error;
      })
      .finally(() => inFlight.delete(path));

    inFlight.set(path, request);
    return request;
  };
}

export const cachedGet = createCachedGet();
