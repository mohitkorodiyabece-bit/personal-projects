import { SWATCHES } from '../data/config.js';

export default function ColorPicker({ value, onChange, colors = SWATCHES, label }) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      <div className="swatches" role="radiogroup" aria-label={label || 'Color'}>
        {colors.map((c) => (
          <button
            key={c}
            role="radio"
            aria-checked={value?.toLowerCase() === c.toLowerCase()}
            className={`swatch ${value?.toLowerCase() === c.toLowerCase() ? 'active' : ''}`}
            style={{ background: c }}
            onClick={() => onChange(c)}
            aria-label={`Color ${c}`}
          />
        ))}
      </div>
    </div>
  );
}
