import { createCache } from './cache.js';
import { createCachedGet } from './cachedRequest.js';

const HOUR = 60 * 60 * 1000;

function setup(fetcher) {
  let time = 0;
  const cache = createCache({ storage: localStorage, ttlMs: HOUR, now: () => time });
  return { get: createCachedGet({ cache, fetcher }), advance: (ms) => (time += ms) };
}

test('the second call within the hour does not hit the API', async () => {
  const fetcher = vi.fn().mockResolvedValue(['a']);
  const { get } = setup(fetcher);

  await get('/product');
  const second = await get('/product');

  expect(second).toEqual(['a']);
  expect(fetcher).toHaveBeenCalledTimes(1);
});

test('after one hour the data is revalidated', async () => {
  const fetcher = vi.fn().mockResolvedValueOnce(['old']).mockResolvedValueOnce(['new']);
  const { get, advance } = setup(fetcher);

  await get('/product');
  advance(HOUR + 1);

  expect(await get('/product')).toEqual(['new']);
  expect(fetcher).toHaveBeenCalledTimes(2);
});

test('if revalidation fails, the expired data is used instead of an error', async () => {
  const fetcher = vi.fn().mockResolvedValueOnce(['old']).mockRejectedValueOnce(new Error('offline'));
  const { get, advance } = setup(fetcher);

  await get('/product');
  advance(HOUR + 1);

  expect(await get('/product')).toEqual(['old']);
});

test('without any cached data the error reaches the caller', async () => {
  const { get } = setup(vi.fn().mockRejectedValue(new Error('offline')));

  await expect(get('/product')).rejects.toThrow('offline');
});

test('concurrent calls for the same path share one request', async () => {
  const fetcher = vi.fn().mockResolvedValue({ id: '1' });
  const { get } = setup(fetcher);

  const [a, b] = await Promise.all([get('/product/1'), get('/product/1')]);

  expect(a).toEqual(b);
  expect(fetcher).toHaveBeenCalledTimes(1);
});

test('errors are not cached: the next call tries again', async () => {
  const fetcher = vi.fn().mockRejectedValueOnce(new Error('500')).mockResolvedValueOnce(['ok']);
  const { get } = setup(fetcher);

  await expect(get('/product')).rejects.toThrow();
  expect(await get('/product')).toEqual(['ok']);
});
