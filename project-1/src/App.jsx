import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";

import Header from "./components/Header.jsx";
import Sidebar from "./components/Sidebar.jsx";
import CustomizationPanel from "./components/CustomizationPanel.jsx";
import BottomControls from "./components/BottomControls.jsx";
import SaveToast from "./components/SaveToast.jsx";
import ConfirmModal from "./components/ConfirmModal.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import MobileControls from "./components/MobileControls.jsx";

import DeskScene from "./scene/DeskScene.jsx";

import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { DEFAULT_CONFIG, STORAGE_KEY } from "./data/config.js";

export default function App() {
  // ---------------------------------------------------------------------
  // Core application state
  // ---------------------------------------------------------------------
  const [config, setConfig, clearConfig] = useLocalStorage(STORAGE_KEY, DEFAULT_CONFIG);
  const [selectedObject, setSelectedObject] = useState("desk");
  const [autoRotate, setAutoRotate] = useState(false);
  const [resetViewToken, setResetViewToken] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [introDone, setIntroDone] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 860 : false
  );

  const canvasRef = useRef(null);
  const appShellRef = useRef(null);

  // ---------------------------------------------------------------------
  // Responsive breakpoint tracking
  // ---------------------------------------------------------------------
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 860);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------------------------------------------------------------------
  // Simulated asset/loading progress -> intro -> configurator
  // ---------------------------------------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && !introDone && appShellRef.current) {
      gsap.fromTo(
        appShellRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, [isLoading, introDone]);

  // ---------------------------------------------------------------------
  // Config update helper — merges partial updates into the config object
  // and persists via useLocalStorage's setter.
  // ---------------------------------------------------------------------
  const updateConfig = useCallback(
    (patch) => {
      setConfig((prev) => ({ ...prev, ...patch }));
    },
    [setConfig]
  );

  // ---------------------------------------------------------------------
  // Save setup -> localStorage (already synced by useLocalStorage on every
  // updateConfig call) + toast feedback.
  // ---------------------------------------------------------------------
  const handleSave = useCallback(() => {
    // Force a write of the current in-memory config, then show feedback.
    setConfig((prev) => ({ ...prev }));
    setShowToast(true);
  }, [setConfig]);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 2600);
    return () => clearTimeout(t);
  }, [showToast]);

  // ---------------------------------------------------------------------
  // Reset flow — confirmation modal, then restore defaults.
  // ---------------------------------------------------------------------
  const requestReset = useCallback(() => setShowResetModal(true), []);

  const confirmReset = useCallback(() => {
    clearConfig();
    setSelectedObject("desk");
    setAutoRotate(false);
    setResetViewToken((n) => n + 1);
    setShowResetModal(false);
    setShowToast(true);
  }, [clearConfig]);

  const cancelReset = useCallback(() => setShowResetModal(false), []);

  // ---------------------------------------------------------------------
  // Camera controls
  // ---------------------------------------------------------------------
  const handleResetView = useCallback(() => {
    setResetViewToken((n) => n + 1);
  }, []);

  const handleToggleAutoRotate = useCallback(() => {
    setAutoRotate((v) => !v);
  }, []);

  const handleFullView = useCallback(() => {
    if (appShellRef.current?.requestFullscreen) {
      appShellRef.current.requestFullscreen().catch(() => {
        // Fullscreen can be denied by the browser/user — fail silently.
      });
    }
  }, []);

  // ---------------------------------------------------------------------
  // Screenshot capture — reads pixels straight off the WebGL canvas.
  // Requires preserveDrawingBuffer, set on the <Canvas> gl prop below.
  // ---------------------------------------------------------------------
  const handleCapture = useCallback(() => {
    const canvasEl = canvasRef.current?.querySelector("canvas");
    if (!canvasEl) return;
    try {
      const dataUrl = canvasEl.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `nexus-desk-setup-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.warn("Screenshot capture failed:", error);
    }
  }, []);

  // ---------------------------------------------------------------------
  // Selection handler shared by Sidebar + 3D scene click targets.
  // ---------------------------------------------------------------------
  const handleSelectObject = useCallback((objectId) => {
    setSelectedObject(objectId);
    setMobileDrawerOpen(true);
  }, []);

  if (isLoading) {
    return <LoadingScreen onIntroComplete={() => setIntroDone(true)} />;
  }

  return (
    <div className="app-shell" ref={appShellRef}>
      <Header onSave={handleSave} onReset={requestReset} />

      <div className="app-body">
        {!isMobile && (
          <Sidebar
            selectedObject={selectedObject}
            onSelectObject={handleSelectObject}
            environment={config.environment}
            onEnvironmentChange={(env) => updateConfig({ environment: env })}
          />
        )}

        <main className="viewport" ref={canvasRef}>
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [4.2, 3.1, 5.4], fov: 42 }}
            gl={{ preserveDrawingBuffer: true, antialias: true }}
          >
            <Suspense fallback={null}>
              <DeskScene
                config={config}
                selectedObject={selectedObject}
                onSelectObject={handleSelectObject}
                autoRotate={autoRotate}
                resetViewToken={resetViewToken}
              />
            </Suspense>
          </Canvas>

          <BottomControls
            onResetView={handleResetView}
            onToggleAutoRotate={handleToggleAutoRotate}
            autoRotate={autoRotate}
            onFullView={handleFullView}
            onCapture={handleCapture}
          />
        </main>

        {!isMobile && (
          <CustomizationPanel
            selectedObject={selectedObject}
            config={config}
            updateConfig={updateConfig}
          />
        )}
      </div>

      {isMobile && (
        <MobileControls
          selectedObject={selectedObject}
          onSelectObject={handleSelectObject}
          config={config}
          updateConfig={updateConfig}
          drawerOpen={mobileDrawerOpen}
          onCloseDrawer={() => setMobileDrawerOpen(false)}
          onOpenDrawer={() => setMobileDrawerOpen(true)}
        />
      )}

      <SaveToast visible={showToast} message="Setup saved successfully" />

      <ConfirmModal
        open={showResetModal}
        title="Reset your setup?"
        message="This will restore every component to its default color, material, and lighting. This can't be undone."
        confirmLabel="Reset"
        cancelLabel="Cancel"
        onConfirm={confirmReset}
        onCancel={cancelReset}
      />
    </div>
  );
}