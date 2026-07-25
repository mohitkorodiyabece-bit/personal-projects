export default function Lamp({ config, selected, onSelect }) {
  return (
    <group position={[-1.6, 0.06, -0.2]} onClick={(e) => { e.stopPropagation(); onSelect('lamp'); }}>
      {/* base */}
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.25, 0.05, 32]} />
        <meshStandardMaterial color={config.lampColor} roughness={0.4} metalness={0.6} />
      </mesh>
      {/* arm lower */}
      <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0.35]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.0, 12]} />
        <meshStandardMaterial color={config.lampColor} roughness={0.3} metalness={0.7} />
      </mesh>
      {/* arm upper */}
      <mesh position={[0.32, 1.05, 0]} rotation={[0, 0, -0.6]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.8, 12]} />
        <meshStandardMaterial color={config.lampColor} roughness={0.3} metalness={0.7} />
      </mesh>
      {/* head */}
      <group position={[0.55, 1.4, 0]} rotation={[0, 0, -1.0]}>
        <mesh castShadow>
          <coneGeometry args={[0.18, 0.3, 24, 1, true]} />
          <meshStandardMaterial color={config.lampColor} roughness={0.3} metalness={0.7} side={2} />
        </mesh>
        {config.lampOn && (
          <mesh position={[0, -0.14, 0]}>
            <circleGeometry args={[0.16, 24]} />
            <meshBasicMaterial color="#fff2cc" />
          </mesh>
        )}
      </group>

      {selected && (
        <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.32, 0.37, 32]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
