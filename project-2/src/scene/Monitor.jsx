import { RoundedBox } from '@react-three/drei';

export default function Monitor({ config, selected, onSelect }) {
  return (
    <group position={[0, 0.06, -0.5]} onClick={(e) => { e.stopPropagation(); onSelect('monitor'); }}>
      {/* base */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.4, 0.04, 32]} />
        <meshStandardMaterial color={config.monitorColor} roughness={0.4} metalness={0.6} />
      </mesh>
      {/* stand */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.08, 0.7, 0.08]} />
        <meshStandardMaterial color={config.monitorColor} roughness={0.3} metalness={0.7} />
      </mesh>
      {/* frame */}
      <group position={[0, 1.15, 0]}>
        <RoundedBox args={[2.6, 1.5, 0.08]} radius={0.03} smoothness={4} castShadow>
          <meshStandardMaterial color={config.monitorColor} roughness={0.35} metalness={0.5} />
        </RoundedBox>
        {/* screen */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[2.45, 1.35]} />
          <meshStandardMaterial
            color={config.monitorGlow}
            emissive={config.monitorGlow}
            emissiveIntensity={0.9}
            roughness={0.2}
          />
        </mesh>
        {/* subtle inner gradient plate for depth */}
        <mesh position={[0, 0, 0.048]}>
          <planeGeometry args={[2.35, 1.25]} />
          <meshBasicMaterial color="#0b0b15" transparent opacity={0.35} />
        </mesh>
      </group>

      {selected && (
        <mesh position={[0, 1.15, -0.08]}>
          <boxGeometry args={[2.75, 1.65, 0.02]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.35} />
        </mesh>
      )}
    </group>
  );
}
