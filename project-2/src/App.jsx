import React, { useState, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, RotateCcw, Menu, X, Sparkles } from 'lucide-react'

import DeskScene from './scene/DeskScene.jsx'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import CustomizationPanel from './components/CustomizationPanel.jsx'
import useConfigurator from './hooks/useConfigurator.js'

function Loader() {
  return (
    <Html center>
      <div style={{ color: '#7dd3fc', fontFamily: 'sans-serif', letterSpacing: '0.2em' }}>
        LOADING NEXUS…
      </div>
    </Html>
  )
}

export default function App() {
  const { config, updateConfig, resetConfig } = useConfigurator()
  const [selected, setSelected] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [autoRotate, setAutoRotate] = useState(true)
  const canvasRef = useRef(null)

  const takeScreenshot = () => {
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `nexus-desk-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="app-root">
      <Header
        onScreenshot={takeScreenshot}
        onReset={resetConfig}
        onToggleRotate={() => setAutoRotate((v) => !v)}
        autoRotate={autoRotate}
        onMenu={() => setMobileOpen(true)}
      />

      <main className="app-main">
        <Sidebar selected={selected} onSelect={setSelected} />

        <div ref={canvasRef} className="canvas-wrap">
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [4, 3, 6], fov: 45 }}
            gl={{ preserveDrawingBuffer: true, antialias: true }}
          >
            <Suspense fallback={<Loader />}>
              <color attach="background" args={['#05070f']} />
              <fog attach="fog" args={['#05070f', 10, 25]} />
              <ambientLight intensity={0.3} />
              <directionalLight
                position={[5, 8, 5]}
                intensity={1}
                castShadow
                shadow-mapSize={[2048, 2048]}
              />
              <DeskScene
                config={config}
                selected={selected}
                onSelect={setSelected}
              />
              <ContactShadows
                position={[0, -0.01, 0]}
                opacity={0.6}
                scale={12}
                blur={2.5}
                far={4}
              />
              <Environment preset={config.environment || 'studio'} />
              <OrbitControls
                enablePan={false}
                autoRotate={autoRotate}
                autoRotateSpeed={0.6}
                minDistance={4}
                maxDistance={12}
                maxPolarAngle={Math.PI / 2.1}
              />
            </Suspense>
          </Canvas>

          <div className="hint-badge glass">
            <Sparkles size={14} />
            <span>Click parts to customize · Drag to rotate</span>
          </div>
        </div>

        <CustomizationPanel
          selected={selected}
          config={config}
          updateConfig={updateConfig}
          onClose={() => setSelected(null)}
        />
      </main>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-drawer glass"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <button className="drawer-close" onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </button>
            <Sidebar
              selected={selected}
              onSelect={(id) => {
                setSelected(id)
                setMobileOpen(false)
              }}
              mobile
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
