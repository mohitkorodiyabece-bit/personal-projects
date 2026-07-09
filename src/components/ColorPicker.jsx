import { COLOR_SWATCHES } from "../data/config.js";

/**
 * ColorPicker
 * Reusable swatch row. `value` is the current hex color; `onChange`
 * receives the new hex string. Used across the CustomizationPanel for
 * every object's color control.
 */
export default function ColorPicker({ value, onChange, label = "Color" }) {
  return (
    <div className="panel-group">
      <div className="panel-group-label">{label}</div>
      <div className="color-swatches" role="group" aria-label={label}>
        {COLOR_SWATCHES.map((swatch) => {
          const isActive = value?.toLowerCase() === swatch.value.toLowerCase();
          return (
            <button
              key={swatch.id}
              className={`color-swatch${isActive ? " active" : ""}`}
              style={{ background: swatch.value }}
              onClick={() => onChange(swatch.value)}
              aria-label={`Set color to ${swatch.label}`}
              aria-pressed={isActive}
              title={swatch.label}
            />
          );
        })}
      </div>
    </div>
  );
}