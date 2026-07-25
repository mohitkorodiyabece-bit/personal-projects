import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'nexus-desk-config-v1'

export const DEFAULT_CONFIG = {
  // Desk
  deskColor: '#2a1810',
  deskMaterial: 'wood', // 'wood' | 'metal' | 'glass'

  // Monitor
  monitorColor: '#0a0a0a',
  screenContent: 'code', // 'code' | 'design' | 'gaming' | 'off'
  monitorSize: 1, // 0.8 – 1.4

  // Keyboard
  keyboardColor: '#1a1a2e',
  keyboardRgb: true,
  rgbColor: '#a855f7',

  // Mouse
  mouseColor: '#0f0f1a',
  mouseRgb: true,

  // Lamp
  lampOn: true,
  lampColor: '#fbbf24',
  lampIntensity: 1.2,

  // Speakers
  speakersOn: true,
  speakerColor: '#1a1a2e',

  // Plant
  showPlant: true,

  // Environment
  environment: 'studio', // 'studio' | 'night' | 'sunset' | 'city' | 'warehouse'
  backgroundColor: '#05070f',
}

function loadConfig() {
  if (typeof window === 'undefined') return DEFAULT_CONFIG
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CONFIG
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_CONFIG
  }
}

export default function useConfigurator() {
  const [config, setConfig] = useState(loadConfig)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    } catch {
      /* ignore quota / privacy-mode errors */
    }
  }, [config])

  const updateConfig = useCallback((patch) => {
    setConfig((prev) =>
      typeof patch === 'function' ? patch(prev) : { ...prev, ...patch }
    )
  }, [])

  const resetConfig = useCallback(() => setConfig(DEFAULT_CONFIG), [])

  return { config, updateConfig, resetConfig }
}
