import { API_BASE_URL, REQUEST_TIMEOUT_MS } from './config.js';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/** fetch + JSON + timeout + uniform errors. */
export async function requestJson(path, { method = 'GET', body, timeoutMs = REQUEST_TIMEOUT_MS } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (error) {
    const timedOut = error?.name === 'TimeoutError';
    throw new ApiError(timedOut ? 'El servidor no responde' : 'No hay conexión con el servidor', 0);
  }

  if (!response.ok) {
    throw new ApiError(`Error del servidor (${response.status})`, response.status);
  }
  return response.json();
}
