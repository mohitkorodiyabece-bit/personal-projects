import { motion } from 'framer-motion';

export default function IntroAnimation() {
  return (
    <motion.div
      className="intro-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8 }}
    >
      <div style={{ textAlign: 'center' }}>
        <motion.div
          className="intro-title"
          initial={{ opacity: 0, y: 30, letterSpacing: '0.2em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '0.05em' }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
        >
          NEXUS
        </motion.div>
        <motion.div
          className="intro-sub"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          Design your space
        </motion.div>
      </div>
    </motion.div>
  );
}
