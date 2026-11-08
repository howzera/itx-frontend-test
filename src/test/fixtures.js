export const PRODUCTS = [
  { id: 'a1', brand: 'Acer', model: 'Iconia Talk S', price: 170, imgUrl: 'acer.jpg' },
  { id: 's8', brand: 'Samsung', model: 'Galaxy S8', price: null, imgUrl: 'samsung.jpg' },
  { id: 'x4', brand: 'Xiaomi', model: 'Redmi Note 4', price: 120, imgUrl: 'xiaomi.jpg' },
];

export function productDetail(overrides = {}) {
  return {
    id: 'a1',
    brand: 'Acer',
    model: 'Iconia Talk S',
    price: 170,
    imgUrl: 'acer.jpg',
    cpu: 'Quad-core 1.3 GHz Cortex-A53',
    ram: '2 GB RAM',
    os: 'Android 6.0 (Marshmallow)',
    screenResolution: '720 x 1280 pixels',
    screenSize: '7.0 inches',
    battery: 'Li-Ion 3400 mAh',
    primaryCamera: '13 MP, autofocus',
    secondaryCamera: '2 MP, 720p',
    dimensions: '191.7 x 101 x 9.4 mm',
    weight: '',
    options: {
      colors: [{ code: 1000, name: 'Black' }],
      storages: [
        { code: 2000, name: '16 GB' },
        { code: 2001, name: '32 GB' },
      ],
    },
    ...overrides,
  };
}
