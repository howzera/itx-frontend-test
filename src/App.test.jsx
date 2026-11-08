import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { addToCart, getProduct, getProducts } from './api/products.js';
import App from './App.jsx';
import { PRODUCTS, productDetail } from './test/fixtures.js';

vi.mock('./api/products.js');

function renderApp(url = '/') {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <App />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  getProducts.mockResolvedValue(PRODUCTS);
  getProduct.mockResolvedValue(productDetail());
  addToCart.mockResolvedValue(1);
});

const breadcrumbs = () => within(screen.getByRole('navigation', { name: 'Breadcrumb' }));

test('list -> detail -> add to cart -> counter in the header -> back to the list', async () => {
  const user = userEvent.setup();
  renderApp();

  expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
  await user.click(await screen.findByRole('link', { name: /Acer Iconia Talk S/ }));

  // Detail page: two columns content and breadcrumbs with the product name.
  expect(await screen.findByRole('heading', { level: 1, name: 'Acer Iconia Talk S' })).toBeInTheDocument();
  expect(getProduct).toHaveBeenCalledWith('a1');
  expect(breadcrumbs().getByRole('link', { name: 'Móviles' })).toHaveAttribute('href', '/');

  await user.click(screen.getByRole('radio', { name: '16 GB' }));
  await user.click(screen.getByRole('button', { name: 'Añadir' }));

  expect(await screen.findByText('Producto añadido a la cesta.')).toBeInTheDocument();
  expect(screen.getByTestId('cart-count')).toHaveTextContent('1');

  await user.click(screen.getByRole('link', { name: /Volver al listado/ }));

  expect(await screen.findByRole('heading', { level: 1, name: 'Móviles' })).toBeInTheDocument();
  expect(await screen.findByRole('link', { name: /Galaxy S8/ })).toBeInTheDocument();
  expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
});

test('the detail shows every required attribute', async () => {
  renderApp('/product/a1');

  const description = await screen.findByRole('region', { name: 'Descripción' });
  for (const label of [
    'Marca', 'Modelo', 'Precio', 'CPU', 'RAM', 'Sistema operativo', 'Resolución de pantalla',
    'Batería', 'Cámara principal', 'Cámara frontal', 'Dimensiones', 'Peso',
  ]) {
    expect(within(description).getByText(label)).toBeInTheDocument();
  }
  // Empty values are shown as "No disponible", never as a blank cell.
  expect(within(description).getByText('No disponible')).toBeInTheDocument();
});

test('the logo links to the home page', async () => {
  renderApp('/product/a1');

  expect(screen.getByRole('link', { name: /ITX Mobile Store/ })).toHaveAttribute('href', '/');
});

test('an unknown product shows an error with a way back', async () => {
  getProduct.mockRejectedValue(new Error('Error del servidor (500)'));
  renderApp('/product/unknown');

  expect(await screen.findByRole('alert')).toHaveTextContent('No se ha podido cargar el producto');
  expect(screen.getByRole('link', { name: 'Ver todos los móviles' })).toHaveAttribute('href', '/');
});

test('an unknown route shows the not found page', () => {
  renderApp('/does/not/exist');

  expect(screen.getByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument();
});
