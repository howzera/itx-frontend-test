import { cachedGet } from './cachedRequest.js';
import { requestJson } from './httpClient.js';
import { normalizeProductDetail, normalizeProductSummary } from '../utils/normalizeProduct.js';

export async function getProducts() {
  const products = await cachedGet('/product');
  return products.map(normalizeProductSummary);
}

export async function getProduct(id) {
  return normalizeProductDetail(await cachedGet(`/product/${encodeURIComponent(id)}`));
}

/** Adds one unit to the cart. Never cached: it changes data on the server. */
export async function addToCart({ id, colorCode, storageCode }) {
  const { count } = await requestJson('/cart', { method: 'POST', body: { id, colorCode, storageCode } });
  return Number(count) || 0;
}
