import { useMemo } from "react";

/**
 * Plant
 * Stylized pot + a handful of curved stems with leaf blobs. Fully
 * removable via `visible` — when false the group returns null rather
 * than just being scaled to zero, to avoid any residual raycasting.
 */
export default function Plant({ potColor, visible, isSelected, onSelect }) {
  const handleClick = (e) => {
    e.stopPropagation();
    onSelect("plant");
  };

  const stems = useMemo(
    () => [
      { pos: [0, 0.18, 0], rot: [0.1, 0, 0.05], leafPos: [0.02, 0.16, 0], scale: 1 },
      { pos: [0.03, 0.16, 0.02], rot: [0.05, 0.4, -0.15], leafPos: [0.07, 0.15, 0.03], scale: 0.85 },
      { pos: [-0.03, 0.17, -0.02], rot: [-0.1, -0.5, 0.2], leafPos: [-0.06, 0.15, -0.04], scale: 0.9 },
      { pos: [0.01, 0.19, -0.03], rot: [0.15, 0.2, -0.05], leafPos: [0.02, 0.19, -0.06], scale: 0.75 }
    ],
    []
  );

  if (!visible) return null;

  return (
    <group position={[-1.55, 1.075, -0.6]} onClick={handleClick}>
      {/* Pot */}
      <mesh castShadow receiveShadow position={[0, 0.045, 0]}>
        <cylinderGeometry args={[0.09, 0.075, 0.09, 20]} />
        <meshStandardMaterial
          color={potColor || "#8b5cf6"}
          roughness={0.55}
          metalness={0.1}
          emissive={isSelected ? "#8b5cf6" : "#000000"}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </mesh>

      {/* Soil cap */}
      <mesh position={[0, 0.09, 0]}>
        <cylinderGeometry args={[0.082, 0.082, 0.012, 20]} />
        <meshStandardMaterial color="#2b1c12" roughness={0.9} />
      </mesh>

      {/* Stems + leaves */}
      {stems.map((s, i) => (
        <group key={i} position={s.pos} rotation={s.rot}>
          <mesh castShadow scale={[1, s.scale, 1]}>
            <cylinderGeometry args={[0.006, 0.008, 0.18, 8]} />
            <meshStandardMaterial color="#3f6b3a" roughness={0.7} />
          </mesh>
          <mesh castShadow position={s.leafPos} scale={[0.85, 0.4, 1.3]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial color="#4f8c47" roughness={0.6} />
          </mesh>
        </group>
      ))}

      {isSelected && (
        <mesh position={[0, -0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.13, 0.16, 32]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  );
}