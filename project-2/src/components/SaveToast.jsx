import { motion } from 'framer-motion';
import { Check, RotateCcw, Camera } from 'lucide-react';

export default function SaveToast({ message, icon }) {
  const Icon = icon === 'reset' ? RotateCcw : icon === 'camera' ? Camera : Check;
  return (
    <motion.div
      className="toast"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="status"
    >
      <div className="toast-icon"><Icon size={16} /></div>
      {message}
    </motion.div>
  );
}
