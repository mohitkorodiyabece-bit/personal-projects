import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const i = setInterval(() => {
      setPct((p) => (p >= 100 ? 100 : p + Math.random() * 18));
    }, 90);
    return () => clearInterval(i);
  }, []);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loading-content">
        <div className="loading-logo">NEXUS DESK</div>
        <div className="loading-bar">
          <div className="loading-fill" style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
        <div className="loading-percent">{Math.min(Math.floor(pct), 100)}%</div>
      </div>
    </motion.div>
  );
}
