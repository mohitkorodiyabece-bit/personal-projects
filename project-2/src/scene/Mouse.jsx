export default function Mouse({ config, selected, onSelect }) {
  return (
    <group position={[1.25, 0.07, 0.5]} onClick={(e) => { e.stopPropagation(); onSelect('mouse'); }}>
      <mesh castShadow>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={config.mouseColor} roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.06, 0.02]} scale={[0.6, 0.3, 1.1]} castShadow>
        <sphereGeometry args={[0.18, 32, 32]} />
        <meshStandardMaterial color={config.mouseColor} roughness={0.3} metalness={0.4} />
      </mesh>
      {/* scroll wheel */}
      <mesh position={[0, 0.14, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.04, 16]} />
        <meshStandardMaterial color="#444" roughness={0.8} />
      </mesh>
      {/* RGB accent line */}
      {config.mouseRGB && (
        <mesh position={[0, 0, -0.05]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.15, 0.008, 8, 32, Math.PI]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
      )}

      {selected && (
        <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.28, 0.32, 32]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}
