import { useState } from 'react';
import { useCart } from '../context/useCart.js';
import OptionSelector from './OptionSelector.jsx';

/** A single option is selected by default. */
const defaultCode = (options) => (options.length === 1 ? options[0].code : null);

/**
 * Storage and color selectors + "Añadir" button.
 * The parent renders it with key={product.id}, so the selection resets when the product changes.
 */
export default function ProductActions({ product }) {
  const { addToCart } = useCart();
  const { storages, colors } = product.options;
  const [storageCode, setStorageCode] = useState(() => defaultCode(storages));
  const [colorCode, setColorCode] = useState(() => defaultCode(colors));
  const [status, setStatus] = useState('idle'); // idle | adding | added | error

  const canAdd = storageCode !== null && colorCode !== null && status !== 'adding';

  const onAdd = async () => {
    setStatus('adding');
    try {
      await addToCart({ id: product.id, colorCode, storageCode });
      setStatus('added');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="panel" aria-labelledby="actions-title">
      <h2 id="actions-title" className="panel__title">
        Opciones
      </h2>
      <OptionSelector name="storage" legend="Almacenamiento" options={storages} selected={storageCode} onSelect={setStorageCode} />
      <OptionSelector name="color" legend="Color" options={colors} selected={colorCode} onSelect={setColorCode} />

      <button type="button" className="button button--primary button--block" disabled={!canAdd} onClick={onAdd}>
        {status === 'adding' ? 'Añadiendo…' : 'Añadir'}
      </button>
      <p className="actions__feedback" aria-live="polite">
        {!canAdd && status !== 'adding' && 'Elige almacenamiento y color.'}
        {status === 'added' && 'Producto añadido a la cesta.'}
        {status === 'error' && 'No se ha podido añadir. Inténtalo de nuevo.'}
      </p>
    </section>
  );
}
