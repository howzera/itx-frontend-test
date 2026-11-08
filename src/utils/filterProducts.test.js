import { filterProducts } from './filterProducts.js';

const PRODUCTS = [
  { id: '1', brand: 'Acer', model: 'Iconia Talk S' },
  { id: '2', brand: 'Samsung', model: 'Galaxy S8' },
  { id: '3', brand: 'Xiaomi', model: 'Redmi Nóte 4' },
];

const ids = (list) => list.map((product) => product.id);

test('empty query returns every product', () => {
  expect(filterProducts(PRODUCTS, '   ')).toBe(PRODUCTS);
});

test('matches the brand', () => {
  expect(ids(filterProducts(PRODUCTS, 'acer'))).toEqual(['1']);
});

test('matches the model, case insensitive', () => {
  expect(ids(filterProducts(PRODUCTS, 'GALAXY'))).toEqual(['2']);
});

test('every word must match, in any order', () => {
  expect(ids(filterProducts(PRODUCTS, 'galaxy samsung'))).toEqual(['2']);
  expect(ids(filterProducts(PRODUCTS, 'samsung iconia'))).toEqual([]);
});

test('ignores accents', () => {
  expect(ids(filterProducts(PRODUCTS, 'redmi note'))).toEqual(['3']);
});
