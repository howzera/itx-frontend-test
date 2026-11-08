import { Link } from 'react-router';
import { formatPrice } from '../utils/format.js';

export default function ProductCard({ product }) {
  const { id, brand, model, price, imgUrl } = product;

  return (
    <Link to={`/product/${id}`} className="product-card">
      <div className="product-card__image">
        <img src={imgUrl} alt={`${brand} ${model}`} loading="lazy" width="160" height="212" />
      </div>
      <div className="product-card__body">
        <span className="product-card__brand">{brand}</span>
        <span className="product-card__model">{model}</span>
        <span className="product-card__price">{formatPrice(price)}</span>
      </div>
    </Link>
  );
}
