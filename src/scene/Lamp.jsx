/**
 * Lamp
 * Base + articulated arm + head. When `on` is true, the head's material
 * gets an emissive boost so it visually reads as lit even before the
 * accompanying pointLight (rendered in SceneLighting) reaches it.
 */
export default function Lamp({ color, on, isSelected, onSelect }) {
  const handleClick = (e) => {
    e.stopPropagation();
    onSelect("lamp");
  };

  return (
    <group position={[1.55, 1.07, -0.65]} onClick={handleClick}>
      {/* Base */}
      <mesh castShadow receiveShadow position={[0, 0.015, 0]}>
        <cylinderGeometry args={[0.11, 0.13, 0.03, 24]} />
        <meshStandardMaterial
          color={color || "#222222"}
          roughness={0.5}
          metalness={0.5}
          emissive={isSelected ? "#8b5cf6" : "#000000"}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Lower arm segment */}
      <mesh castShadow position={[0.02, 0.22, 0]} rotation={[0, 0, -0.25]}>
        <cylinderGeometry args={[0.016, 0.016, 0.38, 12]} />
        <meshStandardMaterial color={color || "#222222"} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Joint */}
      <mesh castShadow position={[0.13, 0.4, 0]}>
        <sphereGeometry args={[0.028, 16, 16]} />
        <meshStandardMaterial color="#0d0d10" roughness={0.3} metalness={0.7} />
      </mesh>

      {/* Upper arm segment */}
      <mesh castShadow position={[0.28, 0.46, 0]} rotation={[0, 0, 0.55]}>
        <cylinderGeometry args={[0.014, 0.014, 0.32, 12]} />
        <meshStandardMaterial color={color || "#222222"} roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Lamp head */}
      <mesh castShadow position={[0.4, 0.58, 0]} rotation={[0, 0, 2.4]}>
        <coneGeometry args={[0.09, 0.14, 24, 1, true]} />
        <meshStandardMaterial
          color={color || "#222222"}
          roughness={0.4}
          metalness={0.5}
          emissive={on ? "#ffdca8" : "#000000"}
          emissiveIntensity={on ? 0.6 : 0}
          side={2}
        />
      </mesh>

      {isSelected && (
        <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.16, 0.19, 32]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  );
}