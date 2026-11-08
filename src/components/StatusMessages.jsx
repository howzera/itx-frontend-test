import { useEffect, useState } from 'react';

const SLOW_AFTER_MS = 3000;

export function Loader({ label = 'Cargando…' }) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), SLOW_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="status" role="status">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
      {slow && <p className="status__hint">El servidor se está despertando; la primera carga puede tardar hasta un minuto.</p>}
    </div>
  );
}

export function ErrorMessage({ title, error, onRetry, children }) {
  return (
    <div className="status status--error" role="alert">
      <p className="status__title">{title}</p>
      {error?.message && <p className="status__hint">{error.message}</p>}
      <div className="status__actions">
        {onRetry && (
          <button type="button" className="button" onClick={onRetry}>
            Reintentar
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
