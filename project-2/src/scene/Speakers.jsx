function Speaker({ position, config }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.35, 0.55, 0.3]} />
        <meshStandardMaterial color={config.speakerColor} roughness={0.5} metalness={0.3} />
      </mesh>
      {/* woofer */}
      <mesh position={[0, -0.1, 0.16]}>
        <cylinderGeometry args={[0.11, 0.11, 0.02, 24]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#1a1a20" roughness={0.9} />
      </mesh>
      <mesh position={[0, -0.1, 0.17]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.005, 24]} />
        <meshStandardMaterial color="#0b0b10" roughness={1} />
      </mesh>
      {/* tweeter */}
      <mesh position={[0, 0.15, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.02, 20]} />
        <meshStandardMaterial color="#1a1a20" roughness={0.9} />
      </mesh>
      {/* RGB ring */}
      {config.speakerRGB && (
        <mesh position={[0, -0.1, 0.175]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.12, 0.008, 8, 32]} />
          <meshBasicMaterial color="#8b5cf6" />
        </mesh>
      )}
    </group>
  );
}

export default function Speakers({ config, selected, onSelect }) {
  return (
    <group onClick={(e) => { e.stopPropagation(); onSelect('speakers'); }}>
      <Speaker position={[-1.7, 0.34, -0.4]} config={config} />
      <Speaker position={[1.7, 0.34, -0.4]} config={config} />
      {selected && (
        <>
          <mesh position={[-1.7, -0.02, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.32, 0.36, 32]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
          </mesh>
          <mesh position={[1.7, -0.02, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.32, 0.36, 32]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
          </mesh>
        </>
      )}
    </group>
  );
}
