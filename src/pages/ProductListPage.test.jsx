import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { getProducts } from '../api/products.js';
import { PRODUCTS } from '../test/fixtures.js';
import ProductListPage from './ProductListPage.jsx';

vi.mock('../api/products.js');

function renderPage(url = '/') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <ProductListPage />
    </MemoryRouter>,
  );
}

const cards = () => within(screen.getByRole('list')).getAllByRole('link');

test('shows a loader and then every product with image, brand, model and price', async () => {
  getProducts.mockResolvedValue(PRODUCTS);
  renderPage();

  expect(screen.getByRole('status')).toHaveTextContent('Cargando productos');
  expect(await screen.findAllByRole('listitem')).toHaveLength(3);

  const acer = screen.getByRole('link', { name: /Acer Iconia Talk S/ });
  expect(acer).toHaveAttribute('href', '/product/a1');
  expect(within(acer).getByRole('img')).toHaveAttribute('src', 'acer.jpg');
  expect(acer).toHaveTextContent(/170,00\s€/);
});

test('a product without price shows a readable text', async () => {
  getProducts.mockResolvedValue(PRODUCTS);
  renderPage();

  expect(await screen.findByRole('link', { name: /Galaxy S8/ })).toHaveTextContent('Precio no disponible');
});

test('filters in real time by brand and model', async () => {
  getProducts.mockResolvedValue(PRODUCTS);
  const user = userEvent.setup();
  renderPage();
  await screen.findAllByRole('listitem');

  await user.type(screen.getByRole('searchbox', { name: /buscar/i }), 'redmi');

  expect(cards()).toHaveLength(1);
  expect(cards()[0]).toHaveTextContent('Xiaomi');
  expect(screen.getByText('1 resultado')).toBeInTheDocument();
});

test('the search comes from the URL, so it survives going back', async () => {
  getProducts.mockResolvedValue(PRODUCTS);
  renderPage('/?q=acer');

  await screen.findAllByRole('listitem');

  expect(screen.getByRole('searchbox')).toHaveValue('acer');
  expect(cards()).toHaveLength(1);
});

test('shows a message when nothing matches', async () => {
  getProducts.mockResolvedValue(PRODUCTS);
  renderPage('/?q=nokia');

  expect(await screen.findByText(/No hay productos que coincidan/)).toBeInTheDocument();
});

test('shows an error with retry when the API fails', async () => {
  getProducts.mockRejectedValueOnce(new Error('Error del servidor (500)')).mockResolvedValueOnce(PRODUCTS);
  const user = userEvent.setup();
  renderPage();

  expect(await screen.findByRole('alert')).toHaveTextContent('No se han podido cargar los productos');

  await user.click(screen.getByRole('button', { name: 'Reintentar' }));

  expect(await screen.findAllByRole('listitem')).toHaveLength(3);
});
