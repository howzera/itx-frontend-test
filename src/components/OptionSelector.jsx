/** Radio group shown as buttons: one choice, keyboard accessible, native form semantics. */
export default function OptionSelector({ name, legend, options, selected, onSelect }) {
  return (
    <fieldset className="option-selector">
      <legend>{legend}</legend>
      <div className="option-selector__options">
        {options.map((option) => (
          <label key={option.code} className="option">
            <input
              type="radio"
              name={name}
              value={option.code}
              checked={selected === option.code}
              onChange={() => onSelect(option.code)}
            />
            <span>{option.name}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
