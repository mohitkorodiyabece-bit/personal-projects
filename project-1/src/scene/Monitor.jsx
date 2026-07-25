import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/**
 * Monitor
 * Widescreen display with bezel, stand, base, and an animated abstract
 * gradient rendered onto the screen via a shader material so it feels
 * "alive" without needing an external texture asset.
 */
export default function Monitor({ frameColor, glowColor, isSelected, onSelect }) {
  const screenMatRef = useRef();

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect("monitor");
  };

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(glowColor || "#7c3aed") },
      uColorB: { value: new THREE.Color("#22d3ee") }
    }),
    [] // color updates handled in useFrame below to avoid material re-creation
  );

  useFrame((state) => {
    if (screenMatRef.current) {
      screenMatRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      screenMatRef.current.uniforms.uColorA.value.set(glowColor || "#7c3aed");
    }
  });

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    uniform float uTime;
    uniform vec3 uColorA;
    uniform vec3 uColorB;
    varying vec2 vUv;
    void main() {
      float wave = sin((vUv.x * 3.0) + uTime * 0.4) * 0.5 + 0.5;
      float wave2 = cos((vUv.y * 4.0) - uTime * 0.3) * 0.5 + 0.5;
      vec3 color = mix(uColorA, uColorB, wave * wave2);
      float vignette = smoothstep(0.9, 0.2, distance(vUv, vec2(0.5)));
      gl_FragColor = vec4(color * (0.4 + vignette * 0.8), 1.0);
    }
  `;

  return (
    <group position={[0, 1.62, -0.55]} onClick={handleClick}>
      {/* Stand base */}
      <mesh position={[0, -0.36, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.16, 0.19, 0.03, 32]} />
        <meshStandardMaterial color="#0d0d10" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Stand neck */}
      <mesh position={[0, -0.22, 0]} castShadow>
        <boxGeometry args={[0.045, 0.32, 0.09]} />
        <meshStandardMaterial color="#141418" roughness={0.4} metalness={0.5} />
      </mesh>

      {/* Bezel */}
      <RoundedBox args={[1.32, 0.76, 0.045]} radius={0.02} smoothness={3} castShadow>
        <meshStandardMaterial
          color={frameColor || "#111111"}
          roughness={0.55}
          metalness={0.3}
          emissive={isSelected ? "#8b5cf6" : "#000000"}
          emissiveIntensity={isSelected ? 0.15 : 0}
        />
      </RoundedBox>

      {/* Screen (animated shader gradient) */}
      <mesh position={[0, 0, 0.024]}>
        <planeGeometry args={[1.22, 0.66]} />
        <shaderMaterial
          ref={screenMatRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>

      {/* Screen glow light spill */}
      <pointLight
        position={[0, 0, 0.3]}
        intensity={0.5}
        color={glowColor || "#7c3aed"}
        distance={2.2}
        decay={2}
      />

      {isSelected && (
        <mesh position={[0, -0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.24, 0.27, 32]} />
          <meshBasicMaterial color="#8b5cf6" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}