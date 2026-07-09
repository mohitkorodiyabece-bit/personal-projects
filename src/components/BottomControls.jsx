import { motion } from "framer-motion";
import { RotateCcw, RefreshCw, Maximize2, Camera } from "lucide-react";

/**
 * BottomControls
 * Floating pill bar over the 3D viewport: reset camera, toggle
 * auto-rotate, request fullscreen, and capture a screenshot of the canvas.
 */
export default function BottomControls({
  onResetView,
  onToggleAutoRotate,
  autoRotate,
  onFullView,
  onCapture
}) {
  return (
    <motion.div
      className="bottom-controls glass"
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <button
        className="bottom-control-btn"
        onClick={onResetView}
        aria-label="Reset camera view"
      >
        <RotateCcw size={15} />
        <span>Reset View</span>
      </button>

      <button
        className={`bottom-control-btn${autoRotate ? " active" : ""}`}
        onClick={onToggleAutoRotate}
        aria-pressed={autoRotate}
        aria-label="Toggle auto rotate"
      >
        <RefreshCw size={15} />
        <span>Auto Rotate</span>
      </button>

      <button
        className="bottom-control-btn"
        onClick={onFullView}
        aria-label="Enter full view"
      >
        <Maximize2 size={15} />
        <span>Full View</span>
      </button>

      <div className="bottom-control-divider" aria-hidden="true" />

      <button
        className="bottom-control-btn"
        onClick={onCapture}
        aria-label="Capture setup as image"
      >
        <Camera size={15} />
        <span>Capture Setup</span>
      </button>
    </motion.div>
  );
}