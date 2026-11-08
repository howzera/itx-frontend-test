import { Link, useMatch } from 'react-router';
import { useProduct } from '../hooks/useProducts.js';

function ProductCrumb({ id }) {
  // Same request as the detail page: served by the cache / in-flight de-duplication.
  const { data } = useProduct(id);
  return data ? `${data.brand} ${data.model}` : 'Detalle';
}

export default function Breadcrumbs() {
  const productMatch = useMatch('/product/:id');

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li>
          {productMatch ? (
            <Link to="/">Móviles</Link>
          ) : (
            <span aria-current="page">Móviles</span>
          )}
        </li>
        {productMatch && (
          <li>
            <span aria-current="page">
              <ProductCrumb id={productMatch.params.id} />
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
}
