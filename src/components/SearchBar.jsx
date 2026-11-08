export default function SearchBar({ value, onChange, resultCount }) {
  return (
    <div className="search">
      <label htmlFor="search" className="visually-hidden">
        Buscar por marca o modelo
      </label>
      <input
        id="search"
        type="search"
        className="search__input"
        placeholder="Buscar por marca o modelo"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />
      {resultCount !== undefined && (
        <span className="search__count" aria-live="polite">
          {resultCount} {resultCount === 1 ? 'resultado' : 'resultados'}
        </span>
      )}
    </div>
  );
}
