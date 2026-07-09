import { useMemo } from "react";
import { ENVIRONMENTS } from "../data/config.js";

/**
 * SceneLighting
 * Centralizes all Three.js lights and derives their intensity/color from
 * the active environment preset (studio / night / sunset). Also renders
 * the lamp's point light when the desk lamp is switched on.
 */
export default function SceneLighting({ environment, lampOn, lampIntensity, lampColor }) {
  const env = useMemo(() => ENVIRONMENTS[environment] || ENVIRONMENTS.studio, [environment]);

  return (
    <>
      <ambientLight intensity={env.ambientIntensity} color={env.ambientColor} />

      <directionalLight
        position={[5, 8, 4]}
        intensity={env.dirIntensity}
        color={env.dirColor}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-bias={-0.0005}
      />

      {/* Fill light from the opposite side to avoid a fully flat/dark scene */}
      <pointLight position={[-4, 3, -3]} intensity={env.ambientIntensity * 0.8} color={env.accent} />

      {/* Rim/accent light tied to the environment's accent color */}
      <pointLight position={[0, 2.5, -4]} intensity={0.6} color={env.accent} distance={10} decay={2} />

      {/* Soft top-down spot for the desk surface */}
      <spotLight
        position={[0, 6, 2]}
        angle={0.5}
        penumbra={0.6}
        intensity={env.dirIntensity * 0.4}
        color={env.dirColor}
        castShadow={false}
      />

      {lampOn && (
        <pointLight
          position={[1.4, 1.55, -0.55]}
          intensity={lampIntensity}
          color={lampColor || "#ffe8c2"}
          distance={4.5}
          decay={2}
        />
      )}
    </>
  );
}