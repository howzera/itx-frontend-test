import { Link, useParams } from 'react-router';
import ProductActions from '../components/ProductActions.jsx';
import ProductDescription from '../components/ProductDescription.jsx';
import ProductImage from '../components/ProductImage.jsx';
import { ErrorMessage, Loader } from '../components/StatusMessages.jsx';
import { useProduct } from '../hooks/useProducts.js';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { status, data: product, error, retry } = useProduct(id);

  return (
    <section className="pdp">
      <Link to="/" className="back-link">
        ← Volver al listado
      </Link>

      {status === 'loading' && <Loader label="Cargando producto…" />}
      {status === 'error' && (
        // The API answers 500 (not 404) for an unknown id, so both cases end here.
        <ErrorMessage title="No se ha podido cargar el producto." error={error} onRetry={retry}>
          <Link to="/" className="button button--secondary">
            Ver todos los móviles
          </Link>
        </ErrorMessage>
      )}
      {status === 'success' && (
        <div className="pdp__layout">
          <ProductImage src={product.imgUrl} alt={`${product.brand} ${product.model}`} />
          <div className="pdp__info">
            <h1 className="page-title">
              {product.brand} {product.model}
            </h1>
            <ProductDescription product={product} />
            <ProductActions key={product.id} product={product} />
          </div>
        </div>
      )}
    </section>
  );
}
