const priceFormatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });

export const NOT_AVAILABLE = 'No disponible';

export function formatPrice(price) {
  return price === null || price === undefined ? 'Precio no disponible' : priceFormatter.format(price);
}

export function formatWeight(weight) {
  return weight ? `${weight} g` : NOT_AVAILABLE;
}

export function orNotAvailable(text) {
  return text || NOT_AVAILABLE;
}
