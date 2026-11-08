import { normalizeProductDetail, normalizeProductSummary, parsePrice, toText } from './normalizeProduct.js';

// Shape copied from the real API (GET /api/product/:id), including its quirks.
const RAW_DETAIL = {
  id: 'ZmGrkLRPXOTpxsU4jjAcv',
  brand: 'Acer',
  model: 'Iconia Talk S',
  price: '170',
  imgUrl: 'https://itx-frontend-test.onrender.com/images/ZmGrkLRPXOTpxsU4jjAcv.jpg',
  dimentions: '191.7 x 101 x 9.4 mm (7.55 x 3.98 x 0.37 in)',
  weight: '260',
  displayResolution: '7.0 inches (~69.8% screen-to-body ratio)',
  displaySize: '720 x 1280 pixels (~210 ppi pixel density)',
  os: 'Android 6.0 (Marshmallow)',
  cpu: 'Quad-core 1.3 GHz Cortex-A53',
  ram: '2 GB RAM',
  primaryCamera: ['13 MP', 'autofocus'],
  secondaryCmera: ['2 MP', '720p'],
  battery: 'Non-removable Li-Ion 3400 mAh battery (12.92 Wh)',
  options: {
    colors: [{ code: 1000, name: 'Black' }],
    storages: [
      { code: 2000, name: '16 GB' },
      { code: 2001, name: '32 GB' },
    ],
  },
};

describe('parsePrice', () => {
  test.each([
    ['170', 170],
    ['353.8', 353.8],
    ['', null],
    [null, null],
    ['abc', null],
  ])('%j -> %j', (input, expected) => {
    expect(parsePrice(input)).toBe(expected);
  });
});

describe('toText', () => {
  test('joins arrays and skips empty items', () => {
    expect(toText(['13 MP', '', 'autofocus', null])).toBe('13 MP, autofocus');
  });

  test('empty values become an empty string', () => {
    expect(toText('')).toBe('');
    expect(toText([])).toBe('');
    expect(toText(undefined)).toBe('');
  });
});

test('summary keeps only what the list needs', () => {
  expect(normalizeProductSummary({ ...RAW_DETAIL, price: '' })).toEqual({
    id: 'ZmGrkLRPXOTpxsU4jjAcv',
    brand: 'Acer',
    model: 'Iconia Talk S',
    price: null,
    imgUrl: RAW_DETAIL.imgUrl,
  });
});

test('detail fixes typos, swapped display fields and arrays', () => {
  const product = normalizeProductDetail(RAW_DETAIL);

  expect(product.dimensions).toBe('191.7 x 101 x 9.4 mm (7.55 x 3.98 x 0.37 in)');
  expect(product.secondaryCamera).toBe('2 MP, 720p');
  expect(product.primaryCamera).toBe('13 MP, autofocus');
  expect(product.screenResolution).toBe('720 x 1280 pixels (~210 ppi pixel density)');
  expect(product.screenSize).toBe('7.0 inches (~69.8% screen-to-body ratio)');
  expect(product.price).toBe(170);
  expect(product.options.storages).toHaveLength(2);
});

test('missing options become empty lists', () => {
  expect(normalizeProductDetail({ id: 1 }).options).toEqual({ colors: [], storages: [] });
});
