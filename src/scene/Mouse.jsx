import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Mouse
 * Simple ergonomic-suggestive shape via a scaled sphere body + scroll
 * wheel hint. RGB accent is a small emissive ring at the rear, toggled
 * by mouseRGB boolean.
 */
export default function Mouse({ color, rgbOn, isSelected, onSelect }) {
  const rgbRef = useRef();

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect("mouse");
  };

  useFrame((state) => {
    if (!rgbRef.current) return;
    if (!rgbOn) {
      rgbRef.current.material.emissiveIntensity = 0;
      return;
    }
    const pulse = 0.6 + Math.sin(state.clock.elapsedTime * 2.4) * 0.3;
    rgbRef.current.material.emissiveIntensity = pulse;
  });

  return (
    <group position={[0.55, 1.075, 0.55]} onClick={handleClick} rotation={[0, 0.15, 0]}>
      <mesh castShadow receiveShadow scale={[1, 0.62, 1.55]}>
        <sphereGeometry args={[0.09, 24, 24]} />
        <meshStandardMaterial
          color={color || "#111111"}
          roughness={0.5}
          metalness={0.35}
          emissive={isSelected ? "#8b5cf6" : "#000000"}
          emissiveIntensity={isSelected ? 0.25 : 0}
        />
      </mesh>

      {/* Scroll wheel hint */}
      <mesh position={[0, 0.052, 0.06]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.012, 0.012, 0.02, 12]} />
        <meshStandardMaterial color="#050505" roughness={0.8} />
      </mesh>

      {/* RGB accent ring at the rear */}
      <mesh ref={rgbRef} position={[0, 0.01, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.02, 0.03, 20]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#8b5cf6"
          emissiveIntensity={0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {isSelected && (
        <mesh position={[0, -0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.13, 0.15, 32]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  );
}