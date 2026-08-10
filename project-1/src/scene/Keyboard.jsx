import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { RGB_MODES } from "../data/config.js";

/**
 * Keyboard
 * Base + a procedurally laid-out grid of keys. RGB lighting is faked with
 * an emissive strip along the front edge whose color follows the active
 * RGB mode, animating hue for "rainbow".
 */
export default function Keyboard({ color, rgbMode, isSelected, onSelect }) {
  const rgbStripRef = useRef();

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect("keyboard");
  };

  const activeMode = useMemo(
    () => RGB_MODES.find((m) => m.id === rgbMode) || RGB_MODES[0],
    [rgbMode]
  );

  // Precompute a 6x16 key grid once.
  const keys = useMemo(() => {
    const rows = 5;
    const cols = 15;
    const list = [];
    const startX = -0.62;
    const startZ = -0.19;
    const stepX = 0.088;
    const stepZ = 0.088;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        list.push([startX + c * stepX, 0.041, startZ + r * stepZ]);
      }
    }
    return list;
  }, []);

  useFrame((state) => {
    if (!rgbStripRef.current) return;
    if (activeMode.id === "off") {
      rgbStripRef.current.intensity = 0;
      return;
    }
    if (activeMode.id === "rainbow") {
      const hue = (state.clock.elapsedTime * 0.15) % 1;
      const c = new THREE.Color().setHSL(hue, 0.8, 0.55);
      rgbStripRef.current.color = c;
      rgbStripRef.current.intensity = 0.9;
    } else {
      rgbStripRef.current.color = new THREE.Color(activeMode.color);
      rgbStripRef.current.intensity = 0.75;
    }
  });

  return (
    <group position={[-0.75, 1.105, 0.35]} onClick={handleClick}>
      <RoundedBox args={[1.35, 0.03, 0.5]} radius={0.015} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial
          color={color || "#111111"}
          roughness={0.6}
          metalness={0.3}
          emissive={isSelected ? "#8b5cf6" : "#000000"}
          emissiveIntensity={isSelected ? 0.2 : 0}
        />
      </RoundedBox>

      {keys.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.07, 0.018, 0.07]} />
          <meshStandardMaterial color="#08080a" roughness={0.7} metalness={0.1} />
        </mesh>
      ))}

      {/* RGB edge strip */}
      <mesh position={[0, 0.005, 0.255]}>
        <boxGeometry args={[1.3, 0.008, 0.01]} />
        <meshStandardMaterial
          color="#000000"
          emissive={activeMode.id === "off" ? "#000000" : activeMode.color === "rainbow" ? "#8b5cf6" : activeMode.color}
          emissiveIntensity={activeMode.id === "off" ? 0 : 1}
        />
      </mesh>
      <pointLight ref={rgbStripRef} position={[0, 0.03, 0.28]} distance={0.8} decay={2} intensity={0} />

      {isSelected && (
        <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.78, 0.82, 48]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  );
}