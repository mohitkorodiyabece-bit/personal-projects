import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Layers, Sliders, X } from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import CustomizationPanel from './CustomizationPanel.jsx';

export default function MobileControls({ selectedObject, onSelect, config, updateConfig }) {
  const [open, setOpen] = useState(null); // 'components' | 'customize' | null

  return (
    <>
      <div className="mobile-tabs" role="tablist" aria-label="Mobile navigation">
        <button
          className={open === 'components' ? 'active' : ''}
          onClick={() => setOpen(open === 'components' ? null : 'components')}
        >
          <Layers size={18} />
          Components
        </button>
        <button
          className={open === 'customize' ? 'active' : ''}
          onClick={() => setOpen(open === 'customize' ? null : 'customize')}
        >
          <Sliders size={18} />
          Customize
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-drawer"
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <button className="btn ghost" onClick={() => setOpen(null)} aria-label="Close">
                <X size={16} />
              </button>
            </div>
            {open === 'components' && (
              <Sidebar
                className=""
                selectedObject={selectedObject}
                onSelect={(id) => { onSelect(id); }}
                environment={config.environment}
                onEnvironment={(env) => updateConfig({ environment: env })}
              />
            )}
            {open === 'customize' && (
              <CustomizationPanel
                className=""
                selectedObject={selectedObject}
                config={config}
                updateConfig={updateConfig}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

