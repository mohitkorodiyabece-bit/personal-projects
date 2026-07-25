import { useMemo } from 'react';
import { RoundedBox } from '@react-three/drei';
import { DESK_MATERIALS } from '../data/config.js';

export default function Desk({ config, selected, onSelect }) {
  const mat = DESK_MATERIALS[config.deskMaterial] || DESK_MATERIALS.darkWood;
  const color = config.deskColor || mat.color;

  const props = useMemo(() => ({
    color,
    roughness: mat.roughness,
    metalness: mat.metalness,
  }), [color, mat]);

  return (
    <group onClick={(e) => { e.stopPropagation(); onSelect('desk'); }}>
      {/* top */}
      <RoundedBox args={[4.2, 0.12, 1.8]} radius={0.03} smoothness={4} position={[0, 0, 0]} castShadow receiveShadow>
        <meshStandardMaterial {...props} />
      </RoundedBox>

      {/* legs */}
      {[[-1.95, -0.8, 0.75], [1.95, -0.8, 0.75], [-1.95, -0.8, -0.75], [1.95, -0.8, -0.75]].map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[0.08, 1.6, 0.08]} />
          <meshStandardMaterial color="#1a1a20" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}

      {/* cross brace */}
      <mesh position={[0, -1.5, 0]} castShadow>
        <boxGeometry args={[3.9, 0.06, 0.06]} />
        <meshStandardMaterial color="#1a1a20" roughness={0.4} metalness={0.7} />
      </mesh>

      {/* selection ring */}
      {selected && (
        <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.3, 2.4, 64]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
