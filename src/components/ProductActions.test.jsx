import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider } from '../context/CartProvider.jsx';
import { productDetail } from '../test/fixtures.js';
import ProductActions from './ProductActions.jsx';

function renderActions(product, addToCart = vi.fn().mockResolvedValue(1)) {
  render(
    <CartProvider addToCart={addToCart}>
      <ProductActions product={product} />
    </CartProvider>,
  );
  return addToCart;
}

const addButton = () => screen.getByRole('button', { name: 'Añadir' });

test('a selector with a single option shows it already selected', () => {
  renderActions(productDetail());

  expect(screen.getByRole('radio', { name: 'Black' })).toBeChecked();
});

test('with several options nothing is selected and the button is disabled', () => {
  renderActions(productDetail());

  expect(screen.getByRole('radio', { name: '16 GB' })).not.toBeChecked();
  expect(screen.getByRole('radio', { name: '32 GB' })).not.toBeChecked();
  expect(addButton()).toBeDisabled();
});

test('sends id, color code and storage code to the cart', async () => {
  const user = userEvent.setup();
  const addToCart = renderActions(productDetail());

  await user.click(screen.getByRole('radio', { name: '32 GB' }));
  await user.click(addButton());

  expect(addToCart).toHaveBeenCalledWith({ id: 'a1', colorCode: 1000, storageCode: 2001 });
  expect(await screen.findByText('Producto añadido a la cesta.')).toBeInTheDocument();
});

test('a single option in both selectors allows adding at once', () => {
  const product = productDetail({
    options: { colors: [{ code: 1, name: 'Red' }], storages: [{ code: 2, name: '64 GB' }] },
  });
  renderActions(product);

  expect(addButton()).toBeEnabled();
});

test('shows an error when the cart API fails', async () => {
  const user = userEvent.setup();
  renderActions(productDetail(), vi.fn().mockRejectedValue(new Error('500')));

  await user.click(screen.getByRole('radio', { name: '16 GB' }));
  await user.click(addButton());

  expect(await screen.findByText(/No se ha podido añadir/)).toBeInTheDocument();
});
