export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://itx-frontend-test.onrender.com/api';

export const CACHE_TTL_MS = 60 * 60 * 1000;

// The API is hosted on a free plan that "sleeps": the first call can take more than 30 s.
export const REQUEST_TIMEOUT_MS = 60 * 1000;
