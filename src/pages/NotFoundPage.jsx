import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <section className="status">
      <h1 className="page-title">Página no encontrada</h1>
      <Link to="/" className="button">
        Volver al listado
      </Link>
    </section>
  );
}
