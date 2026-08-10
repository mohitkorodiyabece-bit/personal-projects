import { useMemo } from 'react';

export default function SceneLighting({ environment, lampOn, lampIntensity, lampColor }) {
  const preset = useMemo(() => {
    switch (environment) {
      case 'night':
        return { ambient: 0.15, dir: 0.4, dirColor: '#8b9dff', bg: '#02020a', tint: '#3b82f6' };
      case 'sunset':
        return { ambient: 0.35, dir: 1.2, dirColor: '#ffb27a', bg: '#1a0d18', tint: '#f59e0b' };
      case 'studio':
      default:
        return { ambient: 0.5, dir: 0.9, dirColor: '#ffffff', bg: '#0a0a12', tint: '#8b5cf6' };
    }
  }, [environment]);

  return (
    <>
      <color attach="background" args={[preset.bg]} />
      <fog attach="fog" args={[preset.bg, 8, 22]} />

      <ambientLight intensity={preset.ambient} />

      <directionalLight
        position={[5, 8, 5]}
        intensity={preset.dir}
        color={preset.dirColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />

      {/* rim */}
      <pointLight position={[-4, 3, -3]} intensity={0.6} color={preset.tint} />
      <pointLight position={[4, 2, -2]} intensity={0.4} color="#22d3ee" />

      {/* lamp light — belongs to the lamp but included here for scene control */}
      {lampOn && (
        <pointLight
          position={[-1.2, 1.6, 0.2]}
          intensity={lampIntensity}
          color={lampColor}
          distance={5}
          decay={2}
          castShadow
        />
      )}
    </>
  );
}
