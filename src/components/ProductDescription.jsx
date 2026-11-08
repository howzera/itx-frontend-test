import { formatPrice, formatWeight, orNotAvailable } from '../utils/format.js';

export default function ProductDescription({ product }) {
  const specs = [
    ['Marca', product.brand],
    ['Modelo', product.model],
    ['Precio', formatPrice(product.price)],
    ['CPU', product.cpu],
    ['RAM', product.ram],
    ['Sistema operativo', product.os],
    ['Resolución de pantalla', product.screenResolution],
    ['Tamaño de pantalla', product.screenSize],
    ['Batería', product.battery],
    ['Cámara principal', product.primaryCamera],
    ['Cámara frontal', product.secondaryCamera],
    ['Dimensiones', product.dimensions],
    ['Peso', formatWeight(product.weight)],
  ];

  return (
    <section className="panel" aria-labelledby="description-title">
      <h2 id="description-title" className="panel__title">
        Descripción
      </h2>
      <dl className="specs">
        {specs.map(([label, value]) => (
          <div key={label} className="specs__row">
            <dt>{label}</dt>
            <dd>{orNotAvailable(value)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
