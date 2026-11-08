import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import ProductCard from '../components/ProductCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import { ErrorMessage, Loader } from '../components/StatusMessages.jsx';
import { useProducts } from '../hooks/useProducts.js';
import { filterProducts } from '../utils/filterProducts.js';

export default function ProductListPage() {
  const { status, data, error, retry } = useProducts();
  // The query lives in the URL (?q=): it survives "back" from the detail page and can be shared.
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  // Filtering in memory: the API has no search endpoint and the list is small (100 items).
  const visible = useMemo(() => filterProducts(data ?? [], query), [data, query]);

  const onQueryChange = (value) => setSearchParams(value ? { q: value } : {}, { replace: true });

  return (
    <section className="plp">
      <div className="plp__toolbar">
        <h1 className="page-title">Móviles</h1>
        <SearchBar value={query} onChange={onQueryChange} resultCount={status === 'success' ? visible.length : undefined} />
      </div>

      {status === 'loading' && <Loader label="Cargando productos…" />}
      {status === 'error' && <ErrorMessage title="No se han podido cargar los productos." error={error} onRetry={retry} />}
      {status === 'success' &&
        (visible.length > 0 ? (
          <ul className="product-grid">
            {visible.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">No hay productos que coincidan con «{query}».</p>
        ))}
    </section>
  );
}
