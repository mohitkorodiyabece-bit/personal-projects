import { useRef, useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { DESK_MATERIALS } from "../data/config.js";

/**
 * Desk
 * The primary surface + support legs. Material/color swap happens by
 * looking up the active preset from DESK_MATERIALS and feeding
 * color/roughness/metalness straight into the meshStandardMaterial.
 */
export default function Desk({ material, isSelected, onSelect }) {
  const groupRef = useRef();

  const preset = useMemo(
    () => DESK_MATERIALS.find((m) => m.id === material) || DESK_MATERIALS[0],
    [material]
  );

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect("desk");
  };

  const legPositions = [
    [-1.85, 0.55, -0.85],
    [1.85, 0.55, -0.85],
    [-1.85, 0.55, 0.85],
    [1.85, 0.55, 0.85]
  ];

  return (
    <group ref={groupRef} onClick={handleClick} position={[0, 0, 0]}>
      {/* Desktop surface */}
      <RoundedBox
        args={[4.2, 0.09, 2]}
        radius={0.03}
        smoothness={4}
        position={[0, 1.05, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial
          color={preset.color}
          roughness={preset.roughness}
          metalness={preset.metalness}
          emissive={isSelected ? "#8b5cf6" : "#000000"}
          emissiveIntensity={isSelected ? 0.12 : 0}
        />
      </RoundedBox>

      {/* Support legs */}
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow receiveShadow>
          <boxGeometry args={[0.08, 1.1, 0.08]} />
          <meshStandardMaterial
            color="#1a1a1f"
            roughness={0.4}
            metalness={0.7}
            emissive={isSelected ? "#8b5cf6" : "#000000"}
            emissiveIntensity={isSelected ? 0.08 : 0}
          />
        </mesh>
      ))}

      {/* Cross-brace stretcher for visual sturdiness */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[3.9, 0.05, 0.05]} />
        <meshStandardMaterial color="#1a1a1f" roughness={0.4} metalness={0.7} />
      </mesh>

      {isSelected && (
        <mesh position={[0, 1.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.15, 2.22, 64]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  );
}