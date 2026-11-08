import { createCache } from './cache.js';

const HOUR = 60 * 60 * 1000;

function setup() {
  let time = 0;
  const clock = { now: () => time, advance: (ms) => (time += ms) };
  const cache = createCache({ storage: localStorage, ttlMs: HOUR, now: clock.now });
  return { cache, clock };
}

test('returns null when the key was never saved', () => {
  expect(setup().cache.get('/product')).toBeNull();
});

test('an entry is fresh for one hour', () => {
  const { cache, clock } = setup();
  cache.set('/product', [1, 2]);

  clock.advance(HOUR - 1);

  expect(cache.get('/product')).toEqual({ value: [1, 2], fresh: true });
});

test('after one hour the entry is expired but still readable', () => {
  const { cache, clock } = setup();
  cache.set('/product', [1, 2]);

  clock.advance(HOUR);

  expect(cache.get('/product')).toEqual({ value: [1, 2], fresh: false });
});

test('the entry is persisted in localStorage (survives a reload)', () => {
  setup().cache.set('/product', [1]);

  expect(JSON.parse(localStorage.getItem('itx.cache./product')).value).toEqual([1]);
});

test('a corrupted entry is treated as a miss', () => {
  localStorage.setItem('itx.cache./product', '{not json');

  expect(setup().cache.get('/product')).toBeNull();
});

test('a storage that throws (quota, private mode) does not break the app', () => {
  const broken = {
    getItem: () => {
      throw new Error('blocked');
    },
    setItem: () => {
      throw new Error('quota');
    },
  };
  const cache = createCache({ storage: broken, ttlMs: HOUR });

  expect(() => cache.set('k', 1)).not.toThrow();
  expect(cache.get('k')).toBeNull();
});
