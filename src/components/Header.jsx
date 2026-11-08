import { Link } from 'react-router';
import { useCart } from '../context/useCart.js';
import Breadcrumbs from './Breadcrumbs.jsx';

export default function Header() {
  const { count } = useCart();

  return (
    <header className="header">
      <div className="header__inner container">
        <Link to="/" className="header__logo" aria-label="ITX Mobile Store, ir al inicio">
          <img src="/phone.svg" alt="" width="24" height="24" />
          <span>ITX Mobile Store</span>
        </Link>
        <Breadcrumbs />
        <div className="cart-badge" aria-live="polite" aria-label={`Cesta: ${count} productos`}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path
              fill="currentColor"
              d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM5.2 4l.4 2H21l-2 8H7.3l-.4-2H17l1-4H6.1L5 2H2v2h3.2Z"
            />
          </svg>
          <span className="cart-badge__count" data-testid="cart-count">
            {count}
          </span>
        </div>
      </div>
    </header>
  );
}
