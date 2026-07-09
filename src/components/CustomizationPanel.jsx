import { AnimatePresence, motion } from "framer-motion";
import ColorPicker from "./ColorPicker.jsx";
import { DESK_MATERIALS, RGB_MODES } from "../data/config.js";

/**
 * CustomizationPanel
 * Right-hand panel. Renders a different control set depending on
 * `selectedObject`, all writing back into the shared config via
 * `updateConfig(patch)`.
 */
export default function CustomizationPanel({ selectedObject, config, updateConfig }) {
  const titles = {
    desk: "Desk",
    monitor: "Monitor",
    keyboard: "Keyboard",
    mouse: "Mouse",
    lamp: "Desk Lamp",
    plant: "Plant",
    speakers: "Speakers"
  };

  const renderRgbGrid = (currentMode, onChange) => (
    <div className="rgb-grid">
      {RGB_MODES.map((mode) => (
        <button
          key={mode.id}
          className={`rgb-chip${currentMode === mode.id ? " active" : ""}`}
          onClick={() => onChange(mode.id)}
          aria-pressed={currentMode === mode.id}
        >
          <span
            className={`rgb-dot${mode.color === "rainbow" ? " rainbow" : ""}`}
            style={{ background: mode.color && mode.color !== "rainbow" ? mode.color : undefined }}
            aria-hidden="true"
          />
          {mode.label}
        </button>
      ))}
    </div>
  );

  const renderToggleRow = (label, checked, onToggle) => (
    <div className="panel-row">
      <span className="panel-row-label">{label}</span>
      <button
        className={`toggle${checked ? " on" : ""}`}
        onClick={() => onToggle(!checked)}
        role="switch"
        aria-checked={checked}
        aria-label={label}
      >
        <span className="toggle-thumb" />
      </button>
    </div>
  );

  const renderContent = () => {
    switch (selectedObject) {
      case "desk":
        return (
          <>
            <div className="panel-group">
              <div className="panel-group-label">Material</div>
              <div className="material-grid">
                {DESK_MATERIALS.map((mat) => (
                  <button
                    key={mat.id}
                    className={`material-chip${config.deskMaterial === mat.id ? " active" : ""}`}
                    onClick={() =>
                      updateConfig({ deskMaterial: mat.id, deskColor: mat.color })
                    }
                    aria-pressed={config.deskMaterial === mat.id}
                  >
                    {mat.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        );

      case "monitor":
        return (
          <>
            <ColorPicker
              label="Frame Color"
              value={config.monitorColor}
              onChange={(v) => updateConfig({ monitorColor: v })}
            />
            <ColorPicker
              label="Screen Glow"
              value={config.monitorGlow}
              onChange={(v) => updateConfig({ monitorGlow: v })}
            />
          </>
        );

      case "keyboard":
        return (
          <>
            <ColorPicker
              label="Body Color"
              value={config.keyboardColor}
              onChange={(v) => updateConfig({ keyboardColor: v })}
            />
            <div className="panel-group">
              <div className="panel-group-label">RGB Mode</div>
              {renderRgbGrid(config.keyboardRGB, (mode) => updateConfig({ keyboardRGB: mode }))}
            </div>
          </>
        );

      case "mouse":
        return (
          <>
            <ColorPicker
              label="Mouse Color"
              value={config.mouseColor}
              onChange={(v) => updateConfig({ mouseColor: v })}
            />
            <div className="panel-group">
              {renderToggleRow("RGB Accent", config.mouseRGB, (v) => updateConfig({ mouseRGB: v }))}
            </div>
          </>
        );

      case "lamp":
        return (
          <>
            <ColorPicker
              label="Lamp Color"
              value={config.lampColor}
              onChange={(v) => updateConfig({ lampColor: v })}
            />
            <div className="panel-group">
              {renderToggleRow("Light On", config.lampOn, (v) => updateConfig({ lampOn: v }))}
            </div>
            <div className="panel-group">
              <div className="panel-group-label">
                Intensity
                <span>{config.lampIntensity.toFixed(1)}</span>
              </div>
              <input
                type="range"
                className="slider-track"
                min="0.2"
                max="3"
                step="0.1"
                value={config.lampIntensity}
                onChange={(e) => updateConfig({ lampIntensity: parseFloat(e.target.value) })}
                aria-label="Lamp intensity"
              />
            </div>
          </>
        );

      case "plant":
        return (
          <>
            <div className="panel-group">
              {renderToggleRow("Show Plant", config.plantVisible, (v) =>
                updateConfig({ plantVisible: v })
              )}
            </div>
            <ColorPicker
              label="Pot Color"
              value={config.potColor}
              onChange={(v) => updateConfig({ potColor: v })}
            />
          </>
        );

      case "speakers":
        return (
          <>
            <ColorPicker
              label="Speaker Color"
              value={config.speakerColor}
              onChange={(v) => updateConfig({ speakerColor: v })}
            />
            <div className="panel-group">
              {renderToggleRow("RGB Accent", config.speakerRGB, (v) =>
                updateConfig({ speakerRGB: v })
              )}
            </div>
          </>
        );

      default:
        return <p style={{ color: "var(--muted)", fontSize: 13 }}>Select a component to customize it.</p>;
    }
  };

  return (
    <aside className="panel">
      <div className="panel-header">
        <div className="panel-eyebrow">Customize</div>
        <AnimatePresence mode="wait">
          <motion.h2
            key={selectedObject}
            className="panel-title"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {titles[selectedObject] || "Nothing Selected"}
          </motion.h2>
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedObject}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}