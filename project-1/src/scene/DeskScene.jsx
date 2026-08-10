import { useRef, useEffect, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Environment as DreiEnvironment } from "@react-three/drei";
import * as THREE from "three";

import Desk from "./Desk.jsx";
import Monitor from "./Monitor.jsx";
import Keyboard from "./Keyboard.jsx";
import Mouse from "./Mouse.jsx";
import Lamp from "./Lamp.jsx";
import Plant from "./Plant.jsx";
import Speakers from "./Speakers.jsx";
import SceneLighting from "./SceneLighting.jsx";

import { ENVIRONMENTS } from "../data/config.js";

const DEFAULT_CAMERA_POS = new THREE.Vector3(4.2, 3.1, 5.4);
const DEFAULT_TARGET = new THREE.Vector3(0, 1.1, -0.1);

/**
 * DeskScene
 * Composes every 3D object, the floor, environment fog/background, and
 * OrbitControls. Also owns the "reset view" behavior by watching
 * `resetViewToken` and re-lerping the camera back to its default pose.
 */
export default function DeskScene({
  config,
  selectedObject,
  onSelectObject,
  autoRotate,
  resetViewToken
}) {
  const controlsRef = useRef();
  const { camera, scene } = useThree();
  const resettingRef = useRef(false);

  const env = useMemo(
    () => ENVIRONMENTS[config.environment] || ENVIRONMENTS.studio,
    [config.environment]
  );

  // Apply background + fog whenever the environment changes.
  useEffect(() => {
    scene.background = new THREE.Color(env.background);
    scene.fog = new THREE.Fog(env.fogColor, env.fogNear, env.fogFar);
  }, [env, scene]);

  // Trigger a smooth camera reset whenever resetViewToken changes.
  useEffect(() => {
    if (resetViewToken === 0) return;
    resettingRef.current = true;
  }, [resetViewToken]);

  useFrame(() => {
    if (!resettingRef.current) return;
    camera.position.lerp(DEFAULT_CAMERA_POS, 0.08);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(DEFAULT_TARGET, 0.08);
      controlsRef.current.update();
    }
    if (camera.position.distanceTo(DEFAULT_CAMERA_POS) < 0.02) {
      camera.position.copy(DEFAULT_CAMERA_POS);
      if (controlsRef.current) controlsRef.current.target.copy(DEFAULT_TARGET);
      resettingRef.current = false;
    }
  });

  // Clicking empty space deselects nothing (keeps last selection) — per spec,
  // selection only changes via explicit object/sidebar clicks. We stop
  // propagation on every mesh's onClick, so a background click here is a
  // deliberate no-op rather than a deselect, matching "click selectable objects".
  const handleBackgroundClick = () => {};

  return (
    <>
      <SceneLighting
        environment={config.environment}
        lampOn={config.lampOn}
        lampIntensity={config.lampIntensity}
        lampColor="#ffdca8"
      />

      <DreiEnvironment preset="city" background={false} />

      <group onClick={handleBackgroundClick}>
        <Desk
          material={config.deskMaterial}
          isSelected={selectedObject === "desk"}
          onSelect={onSelectObject}
        />
        <Monitor
          frameColor={config.monitorColor}
          glowColor={config.monitorGlow}
          isSelected={selectedObject === "monitor"}
          onSelect={onSelectObject}
        />
        <Keyboard
          color={config.keyboardColor}
          rgbMode={config.keyboardRGB}
          isSelected={selectedObject === "keyboard"}
          onSelect={onSelectObject}
        />
        <Mouse
          color={config.mouseColor}
          rgbOn={config.mouseRGB}
          isSelected={selectedObject === "mouse"}
          onSelect={onSelectObject}
        />
        <Lamp
          color={config.lampColor}
          on={config.lampOn}
          isSelected={selectedObject === "lamp"}
          onSelect={onSelectObject}
        />
        <Plant
          potColor={config.potColor}
          visible={config.plantVisible}
          isSelected={selectedObject === "plant"}
          onSelect={onSelectObject}
        />
        <Speakers
          color={config.speakerColor}
          rgbOn={config.speakerRGB}
          isSelected={selectedObject === "speakers"}
          onSelect={onSelectObject}
        />
      </group>

      {/* Floor */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color={env.background} roughness={0.95} metalness={0} />
      </mesh>

      <ContactShadows
        position={[0, 0.001, 0]}
        opacity={0.55}
        scale={12}
        blur={2.2}
        far={2.5}
        resolution={512}
        color="#000000"
      />

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        autoRotate={autoRotate}
        autoRotateSpeed={0.9}
        minDistance={2.6}
        maxDistance={9}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 2 - 0.02}
        target={[0, 1.1, -0.1]}
        onStart={() => {
          resettingRef.current = false;
        }}
      />
    </>
  );
}