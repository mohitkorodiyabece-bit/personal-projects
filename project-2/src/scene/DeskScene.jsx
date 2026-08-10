import { Suspense, useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import SceneLighting from './SceneLighting.jsx';
import Desk from './Desk.jsx';

function CameraRig({ resetSignal }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(5, 3.5, 6);
    camera.lookAt(0, 0.5, 0);
  }, [resetSignal, camera]);

  return null;
}

function CaptureHandler({ signal }) {
  const { gl, scene, camera } = useThree();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    gl.render(scene, camera);

    try {
      const dataURL = gl.domElement.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = `nexus-desk-${Date.now()}.png`;
      link.click();
    } catch (e) {
      console.error('Capture failed', e);
    }
  }, [signal, gl, scene, camera]);

  return null;
}

export default function DeskScene({
  config,
  selectedObject,
  setSelectedObject,
  autoRotate,
  resetCameraSignal,
  captureSignal,
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [5, 3.5, 6], fov: 45 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      onPointerMissed={() => setSelectedObject(null)}
    >
      <color attach="background" args={['#20242a']} />

      <Suspense fallback={null}>
        <CameraRig resetSignal={resetCameraSignal} />
        <CaptureHandler signal={captureSignal} />

        {/* Extra debug lights */}
        <ambientLight intensity={1.8} />
        <directionalLight position={[5, 8, 5]} intensity={2.5} castShadow />

        {/* Your lighting */}
        <SceneLighting
          environment={config.environment}
          lampOn={config.lampOn}
          lampIntensity={config.lampIntensity}
          lampColor={config.lampColor}
        />

        <group position={[0, 0.5, 0]}>
          <Desk
            config={config}
            selected={selectedObject === 'desk'}
            onSelect={setSelectedObject}
          />
        </group>

        {/* floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.32, 0]} receiveShadow>
          <planeGeometry args={[40, 40]} />
          <meshStandardMaterial color="#30343f" roughness={0.9} metalness={0.1} />
        </mesh>

        <ContactShadows
          position={[0, -1.31, 0]}
          opacity={0.5}
          scale={12}
          blur={2.4}
          far={4}
          resolution={512}
        />

        <Environment preset="city" />

        <OrbitControls
          enableDamping
          dampingFactor={0.08}
          minDistance={3.5}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2 - 0.05}
          minPolarAngle={0.2}
          target={[0, 0.6, 0]}
          autoRotate={autoRotate}
          autoRotateSpeed={0.8}
        />
      </Suspense>
    </Canvas>
  );
}