import { motion } from 'framer-motion';
import {
  Monitor as MonitorIcon, Keyboard as KeyboardIcon, Mouse as MouseIcon,
  Lamp as LampIcon, Leaf, Speaker, Table,
} from 'lucide-react';
import ColorPicker from './ColorPicker.jsx';
import { DESK_MATERIALS, RGB_MODES } from '../data/config.js';

const META = {
  desk:     { icon: Table, title: 'Desk',     sub: 'Structure & finish' },
  monitor:  { icon: MonitorIcon, title: 'Monitor', sub: 'Display & bezel' },
  keyboard: { icon: KeyboardIcon, title: 'Keyboard', sub: 'Body & lighting' },
  mouse:    { icon: MouseIcon, title: 'Mouse', sub: 'Shell & accents' },
  lamp:     { icon: LampIcon, title: 'Desk Lamp', sub: 'Warmth & intensity' },
  plant:    { icon: Leaf, title: 'Plant', sub: 'Presence & pot' },
  speakers: { icon: Speaker, title: 'Speakers', sub: 'Housing & accents' },
};

function Toggle({ label, value, onChange }) {
  return (
    <div className="field">
      <div className="toggle-row">
        <span>{label}</span>
        <button
          className={`switch ${value ? 'on' : ''}`}
          onClick={() => onChange(!value)}
          role="switch"
          aria-checked={value}
          aria-label={label}
        />
      </div>
    </div>
  );
}

export default function CustomizationPanel({ className, selectedObject, config, updateConfig }) {
  const meta = META[selectedObject] || META.desk;
  const Icon = meta.icon;

  return (
    <motion.aside
      className={className}
      initial={{ x: 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      aria-label="Customization panel"
    >
      <div className="customize-header">
        <div className="badge"><Icon size={17} /></div>
        <div>
          <h3>{meta.title}</h3>
          <p>{meta.sub}</p>
        </div>
      </div>

      <motion.div
        key={selectedObject}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {selectedObject === 'desk' && (
          <>
            <div className="field">
              <label className="field-label">Material</label>
              <div className="select-group">
                {Object.entries(DESK_MATERIALS).map(([key, m]) => (
                  <button
                    key={key}
                    className={`chip ${config.deskMaterial === key ? 'active' : ''}`}
                    onClick={() => updateConfig({ deskMaterial: key, deskColor: m.color })}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <ColorPicker
              label="Accent color"
              value={config.deskColor}
              onChange={(c) => updateConfig({ deskColor: c })}
            />
          </>
        )}

        {selectedObject === 'monitor' && (
          <>
            <ColorPicker label="Frame color" value={config.monitorColor}
              onChange={(c) => updateConfig({ monitorColor: c })} />
            <ColorPicker label="Screen glow" value={config.monitorGlow}
              onChange={(c) => updateConfig({ monitorGlow: c })} />
          </>
        )}

        {selectedObject === 'keyboard' && (
          <>
            <ColorPicker label="Body color" value={config.keyboardColor}
              onChange={(c) => updateConfig({ keyboardColor: c })} />
            <div className="field">
              <label className="field-label">RGB mode</label>
              <div className="select-group">
                {RGB_MODES.map((mode) => (
                  <button
                    key={mode}
                    className={`chip ${config.keyboardRGB === mode ? 'active' : ''}`}
                    onClick={() => updateConfig({ keyboardRGB: mode })}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {selectedObject === 'mouse' && (
          <>
            <ColorPicker label="Mouse color" value={config.mouseColor}
              onChange={(c) => updateConfig({ mouseColor: c })} />
            <Toggle label="RGB accent" value={config.mouseRGB}
              onChange={(v) => updateConfig({ mouseRGB: v })} />
          </>
        )}

        {selectedObject === 'lamp' && (
          <>
            <ColorPicker label="Lamp color" value={config.lampColor}
              onChange={(c) => updateConfig({ lampColor: c })} />
            <Toggle label="Light on" value={config.lampOn}
              onChange={(v) => updateConfig({ lampOn: v })} />
            <div className="field">
              <label className="field-label">Intensity ({config.lampIntensity.toFixed(1)})</label>
              <input
                type="range" min="0" max="5" step="0.1"
                value={config.lampIntensity}
                onChange={(e) => updateConfig({ lampIntensity: parseFloat(e.target.value) })}
                className="slider"
                aria-label="Lamp intensity"
              />
            </div>
          </>
        )}

        {selectedObject === 'plant' && (
          <>
            <Toggle label="Show plant" value={config.plantVisible}
              onChange={(v) => updateConfig({ plantVisible: v })} />
            <ColorPicker label="Pot color" value={config.potColor}
              onChange={(c) => updateConfig({ potColor: c })} />
          </>
        )}

        {selectedObject === 'speakers' && (
          <>
            <ColorPicker label="Speaker color" value={config.speakerColor}
              onChange={(c) => updateConfig({ speakerColor: c })} />
            <Toggle label="RGB accents" value={config.speakerRGB}
              onChange={(v) => updateConfig({ speakerRGB: v })} />
          </>
        )}
      </motion.div>
    </motion.aside>
  );
}
