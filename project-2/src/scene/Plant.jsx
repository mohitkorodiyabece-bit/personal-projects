import { useMemo } from 'react';

export default function Plant({ config, selected, onSelect }) {
  const leaves = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      arr.push({
        pos: [Math.cos(a) * 0.12, 0.4 + Math.random() * 0.2, Math.sin(a) * 0.12],
        rot: [Math.random() * 0.5, a, Math.random() * 0.5 - 0.2],
        scale: 0.8 + Math.random() * 0.4,
      });
    }
    return arr;
  }, []);

  if (!config.plantVisible) return null;

  return (
    <group position={[1.7, 0.06, -0.5]} onClick={(e) => { e.stopPropagation(); onSelect('plant'); }}>
      {/* pot */}
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.15, 0.3, 24]} />
        <meshStandardMaterial color={config.potColor} roughness={0.7} />
      </mesh>
      {/* soil */}
      <mesh position={[0, 0.14, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.02, 24]} />
        <meshStandardMaterial color="#2a1a10" roughness={1} />
      </mesh>
      {/* leaves */}
      {leaves.map((l, i) => (
        <mesh key={i} position={l.pos} rotation={l.rot} scale={l.scale} castShadow>
          <coneGeometry args={[0.06, 0.35, 8]} />
          <meshStandardMaterial color="#3d8b4a" roughness={0.7} />
        </mesh>
      ))}
      {/* central stem */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.4, 8]} />
        <meshStandardMaterial color="#2d5a34" />
      </mesh>

      {selected && (
        <mesh position={[0, -0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.26, 0.3, 32]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
