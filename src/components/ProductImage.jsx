export default function ProductImage({ src, alt }) {
  return (
    <div className="product-image">
      <img src={src} alt={alt} width="320" height="424" />
    </div>
  );
}
