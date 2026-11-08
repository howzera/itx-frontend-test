import { useCallback } from 'react';
import { getProduct, getProducts } from '../api/products.js';
import { useAsync } from './useAsync.js';

export function useProducts() {
  return useAsync(getProducts);
}

export function useProduct(id) {
  const load = useCallback(() => getProduct(id), [id]);
  return useAsync(load);
}
