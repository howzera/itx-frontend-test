import { act, render, screen } from '@testing-library/react';
import { CART_STORAGE_KEY } from './cartContext.js';
import { CartProvider } from './CartProvider.jsx';
import { useCart } from './useCart.js';

let cart;
function Probe() {
  cart = useCart();
  return <span data-testid="count">{cart.count}</span>;
}

function renderCart(addToCart = vi.fn().mockResolvedValue(1)) {
  render(
    <CartProvider addToCart={addToCart}>
      <Probe />
    </CartProvider>,
  );
}

test('starts at zero', () => {
  renderCart();

  expect(screen.getByTestId('count')).toHaveTextContent('0');
});

test('adds the count returned by the API and persists it', async () => {
  renderCart();

  await act(() => cart.addToCart({ id: 'a1', colorCode: 1, storageCode: 2 }));
  await act(() => cart.addToCart({ id: 'a1', colorCode: 1, storageCode: 2 }));

  expect(screen.getByTestId('count')).toHaveTextContent('2');
  expect(localStorage.getItem(CART_STORAGE_KEY)).toBe('2');
});

test('restores the persisted count after a reload', () => {
  localStorage.setItem(CART_STORAGE_KEY, '5');

  renderCart();

  expect(screen.getByTestId('count')).toHaveTextContent('5');
});

test('ignores a corrupted persisted value', () => {
  localStorage.setItem(CART_STORAGE_KEY, 'abc');

  renderCart();

  expect(screen.getByTestId('count')).toHaveTextContent('0');
});

test('useCart outside the provider fails loudly', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => render(<Probe />)).toThrow('useCart must be used inside <CartProvider>');
});
