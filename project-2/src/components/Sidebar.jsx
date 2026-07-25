import { motion } from 'framer-motion';
import {
  Monitor as MonitorIcon, Keyboard as KeyboardIcon, Mouse as MouseIcon,
  Lamp as LampIcon, Leaf, Speaker, Table,
} from 'lucide-react';
import { COMPONENT_LIST, ENVIRONMENTS } from '../data/config.js';

const ICONS = {
  desk: Table, monitor: MonitorIcon, keyboard: KeyboardIcon,
  mouse: MouseIcon, lamp: LampIcon, plant: Leaf, speakers: Speaker,
};

export default function Sidebar({ className, selectedObject, onSelect, environment, onEnvironment }) {
  return (
    <motion.aside
      className={className}
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      aria-label="Components sidebar"
    >
      <section className="section">
        <div className="panel-title">Components</div>
        <div className="comp-list">
          {COMPONENT_LIST.map((c) => {
            const Icon = ICONS[c.id];
            return (
              <button
                key={c.id}
                className={`comp-item ${selectedObject === c.id ? 'active' : ''}`}
                onClick={() => onSelect(c.id)}
                aria-pressed={selectedObject === c.id}
              >
                <span className="icon-wrap"><Icon size={16} /></span>
                {c.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="section">
        <div className="panel-title">Environment</div>
        <div className="env-grid">
          {ENVIRONMENTS.map((env) => (
            <button
              key={env.id}
              className={`env-btn ${environment === env.id ? 'active' : ''}`}
              onClick={() => onEnvironment(env.id)}
              aria-pressed={environment === env.id}
            >
              {env.label}
            </button>
          ))}
        </div>
      </section>
    </motion.aside>
  );
}
