import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * LoadingScreen
 * Cinematic intro: animated logo + progress bar. Simulates asset loading
 * with a tweened percentage, then calls `onIntroComplete` so App.jsx can
 * fade the configurator in.
 */
export default function LoadingScreen({ onIntroComplete }) {
  const [percent, setPercent] = useState(0);
  const logoRef = useRef();
  const taglineRef = useRef();
  const barRef = useRef();
  const glowRef = useRef();
  const percentRef = useRef({ value: 0 });

  useEffect(() => {
    const tl = gsap.timeline();

    tl.set(glowRef.current, { opacity: 0, scale: 0.7 })
      .to(glowRef.current, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }, 0)
      .fromTo(
        logoRef.current,
        { opacity: 0, y: 18, letterSpacing: "0.4em" },
        { opacity: 1, y: 0, letterSpacing: "0.08em", duration: 0.9, ease: "power3.out" },
        0.1
      )
      .fromTo(
        taglineRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        0.5
      )
      .fromTo(
        barRef.current.parentElement,
        { opacity: 0 },
        { opacity: 1, duration: 0.4 },
        0.7
      )
      .to(percentRef.current, {
        value: 100,
        duration: 1.1,
        ease: "power1.inOut",
        onUpdate: () => setPercent(Math.round(percentRef.current.value))
      }, 0.75)
      .to(barRef.current, {
        width: "100%",
        duration: 1.1,
        ease: "power1.inOut"
      }, 0.75);

    return () => tl.kill();
  }, []);

  useEffect(() => {
    if (percent >= 100) {
      const t = setTimeout(() => onIntroComplete && onIntroComplete(), 350);
      return () => clearTimeout(t);
    }
  }, [percent, onIntroComplete]);

  return (
    <div className="loading-screen" role="status" aria-live="polite" aria-label="Loading NEXUS DESK">
      <div className="loading-glow" ref={glowRef} />
      <div className="loading-logo" ref={logoRef}>
        NEXUS
      </div>
      <div className="loading-tagline" ref={taglineRef}>
        Design Your Space
      </div>
      <div className="loading-bar-track">
        <div className="loading-bar-fill" ref={barRef} style={{ width: "0%" }} />
      </div>
      <div className="loading-percent">{percent}%</div>
    </div>
  );
}