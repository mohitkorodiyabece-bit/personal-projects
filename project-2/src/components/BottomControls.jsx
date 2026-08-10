import { motion } from 'framer-motion';
import { RotateCw, Maximize2, Camera, RefreshCw } from 'lucide-react';

export default function BottomControls({ autoRotate, onToggleAutoRotate, onResetView, onCapture }) {
  return (
    <motion.div
      className="bottom-controls"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <button className="btn" onClick={onResetView} aria-label="Reset view">
        <RefreshCw size={14} /> <span>Reset View</span>
      </button>
      <button
        className={`btn ${autoRotate ? 'primary' : ''}`}
        onClick={onToggleAutoRotate}
        aria-pressed={autoRotate}
        aria-label="Toggle auto rotate"
      >
        <RotateCw size={14} /> <span>Auto Rotate</span>
      </button>
      <button className="btn" onClick={onResetView} aria-label="Full view">
        <Maximize2 size={14} /> <span>Full View</span>
      </button>
      <button className="btn" onClick={onCapture} aria-label="Capture setup">
        <Camera size={14} /> <span>Capture</span>
      </button>
    </motion.div>
  );
}
