import { Route, Routes } from 'react-router';
import Header from './components/Header.jsx';
import { CartProvider } from './context/CartProvider.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import ProductListPage from './pages/ProductListPage.jsx';

export default function App() {
  return (
    <CartProvider>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </CartProvider>
  );
}
