/**
 * Anti-corruption layer: the ONLY place that knows the quirks of the API.
 * Components receive clean, predictable data.
 *
 * Quirks found by exploring the real API:
 * - `price` is a string and sometimes empty ("").
 * - Typos in field names: `dimentions`, `secondaryCmera`.
 * - `displayResolution` contains the size ("7.0 inches") and `displaySize` the
 *   resolution ("720 x 1280 pixels") in 100 of 100 products: they are swapped.
 * - Specs can be a string, an array of strings or empty.
 */

export function parsePrice(value) {
  if (value === null || value === undefined || String(value).trim() === '') return null;
  const price = Number(value);
  return Number.isFinite(price) ? price : null;
}

/** string | string[] | empty -> clean string, or '' if there is nothing to show. */
export function toText(value) {
  const parts = Array.isArray(value) ? value : [value];
  return parts
    .filter((part) => part !== null && part !== undefined)
    .map((part) => String(part).trim())
    .filter(Boolean)
    .join(', ');
}

function toOptions(options) {
  return Array.isArray(options)
    ? options.filter((option) => option && option.code !== undefined).map(({ code, name }) => ({ code, name: String(name) }))
    : [];
}

export function normalizeProductSummary(raw) {
  return {
    id: String(raw.id),
    brand: toText(raw.brand),
    model: toText(raw.model),
    price: parsePrice(raw.price),
    imgUrl: raw.imgUrl,
  };
}

export function normalizeProductDetail(raw) {
  return {
    ...normalizeProductSummary(raw),
    cpu: toText(raw.cpu),
    ram: toText(raw.ram),
    os: toText(raw.os),
    screenSize: toText(raw.displayResolution),
    screenResolution: toText(raw.displaySize),
    battery: toText(raw.battery),
    primaryCamera: toText(raw.primaryCamera),
    secondaryCamera: toText(raw.secondaryCmera ?? raw.secondaryCamera),
    dimensions: toText(raw.dimentions ?? raw.dimensions),
    weight: toText(raw.weight),
    options: {
      colors: toOptions(raw.options?.colors),
      storages: toOptions(raw.options?.storages),
    },
  };
}
