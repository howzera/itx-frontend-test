/** Lower case and without accents: "Xiaomi Redmi Nóte" matches "redmi note". */
function normalize(text) {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/**
 * Filters by brand and model. Every word of the query must appear (in any order),
 * so "samsung galaxy" and "galaxy samsung" give the same result.
 */
export function filterProducts(products, query) {
  const words = normalize(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return products;

  return products.filter((product) => {
    const haystack = normalize(`${product.brand} ${product.model}`);
    return words.every((word) => haystack.includes(word));
  });
}
