import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { RGB_COLORS } from '../data/config.js';

export default function Keyboard({ config, selected, onSelect }) {
  const rgbRef = useRef();
  const keys = useMemo(() => {
    const arr = [];
    const rows = 4, cols = 14;
    const kW = 0.11, kD = 0.11, gap = 0.02;
    const totalW = cols * (kW + gap);
    const totalD = rows * (kD + gap);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        arr.push([
          -totalW / 2 + c * (kW + gap) + kW / 2,
          0.04,
          -totalD / 2 + r * (kD + gap) + kD / 2,
        ]);
      }
    }
    return { arr, kW, kD };
  }, []);

  useFrame((state) => {
    if (rgbRef.current && config.keyboardRGB === 'rainbow') {
      const t = state.clock.elapsedTime;
      rgbRef.current.color.setHSL((t * 0.15) % 1, 0.8, 0.55);
    }
  });

  const rgbColor = RGB_COLORS[config.keyboardRGB] || '#000';
  const rgbOn = config.keyboardRGB !== 'off';

  return (
    <group position={[0, 0.06, 0.4]} onClick={(e) => { e.stopPropagation(); onSelect('keyboard'); }}>
      <RoundedBox args={[1.9, 0.09, 0.7]} radius={0.02} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={config.keyboardColor} roughness={0.5} metalness={0.4} />
      </RoundedBox>

      {/* keys */}
      {keys.arr.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[keys.kW, 0.03, keys.kD]} />
          <meshStandardMaterial color="#2a2a34" roughness={0.6} />
        </mesh>
      ))}

      {/* RGB underglow */}
      {rgbOn && (
        <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.0, 0.8]} />
          <meshBasicMaterial ref={rgbRef} color={rgbColor} transparent opacity={0.6} />
        </mesh>
      )}

      {selected && (
        <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.05, 1.12, 48]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
