import { useCallback, useEffect, useMemo, useState } from 'react';
import { addToCart as addToCartApi } from '../api/products.js';
import { CART_STORAGE_KEY, CartContext } from './cartContext.js';

function readStoredCount() {
  try {
    const value = Number(localStorage.getItem(CART_STORAGE_KEY));
    return Number.isInteger(value) && value > 0 ? value : 0;
  } catch {
    return 0;
  }
}

/**
 * Global cart counter, persisted in localStorage so it survives reloads and is
 * shown in the header on every page.
 *
 * The API answers {count: 1} on every call (it does not keep a real cart), so the
 * value it returns is ADDED to the local total instead of replacing it.
 */
export function CartProvider({ children, addToCart = addToCartApi }) {
  const [count, setCount] = useState(readStoredCount);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, String(count));
    } catch {
      // Storage blocked: the counter still works for this session.
    }
  }, [count]);

  const add = useCallback(
    async (item) => {
      const added = await addToCart(item);
      setCount((current) => current + added);
    },
    [addToCart],
  );

  const value = useMemo(() => ({ count, addToCart: add }), [count, add]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
