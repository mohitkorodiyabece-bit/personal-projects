import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

/**
 * Speakers
 * Left + right housings, each with two "driver" circles. RGB accent
 * pulses gently around the base ring when speakerRGB is enabled.
 */
export default function Speakers({ color, rgbOn, isSelected, onSelect }) {
  const leftGlowRef = useRef();
  const rightGlowRef = useRef();

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect("speakers");
  };

  useFrame((state) => {
    const intensity = rgbOn ? 0.5 + Math.sin(state.clock.elapsedTime * 1.8) * 0.25 : 0;
    if (leftGlowRef.current) leftGlowRef.current.material.emissiveIntensity = intensity;
    if (rightGlowRef.current) rightGlowRef.current.material.emissiveIntensity = intensity;
  });

  const renderSpeaker = (xOffset, glowRef) => (
    <group position={[xOffset, 1.155, -0.78]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.16, 0.32, 0.16]} />
        <meshStandardMaterial
          color={color || "#111111"}
          roughness={0.55}
          metalness={0.25}
          emissive={isSelected ? "#8b5cf6" : "#000000"}
          emissiveIntensity={isSelected ? 0.18 : 0}
        />
      </mesh>

      {/* Driver circles */}
      <mesh position={[0, 0.08, 0.081]}>
        <circleGeometry args={[0.05, 24]} />
        <meshStandardMaterial color="#050505" roughness={0.8} />
      </mesh>
      <mesh position={[0, -0.07, 0.081]}>
        <circleGeometry args={[0.035, 24]} />
        <meshStandardMaterial color="#050505" roughness={0.8} />
      </mesh>

      {/* RGB base ring */}
      <mesh ref={glowRef} position={[0, -0.165, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.06, 0.075, 20]} />
        <meshStandardMaterial color="#000000" emissive="#22d3ee" emissiveIntensity={0} />
      </mesh>
    </group>
  );

  return (
    <group onClick={handleClick}>
      {renderSpeaker(-1.85, leftGlowRef)}
      {renderSpeaker(1.85, rightGlowRef)}

      {isSelected && (
        <>
          <mesh position={[-1.85, 0.965, -0.78]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.14, 0.17, 24]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.5} />
          </mesh>
          <mesh position={[1.85, 0.965, -0.78]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.14, 0.17, 24]} />
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0.5} />
          </mesh>
        </>
      )}
    </group>
  );
}