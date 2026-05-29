import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Arena from "./Arena";
import CameraRig from "./CameraRig";
import { usePortfolio } from "../../store/usePortfolio";

export default function Scene() {
  const dragRef = useRef({ active: false, last: 0 });
  const [rot, setRot] = useState(0);
  const inertia = useRef(0);
  const { reducedMotion, quality } = usePortfolio();

  useEffect(() => {
    if (reducedMotion) return;
    let raf, lastT = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
      if (Math.abs(inertia.current) > 0.0005) { setRot(r => r + inertia.current); inertia.current *= 0.92; }
      else if (!dragRef.current.active) setRot(r => r + dt * 0.06);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  const onPointerDown = e => { dragRef.current = { active: true, last: e.clientX }; };
  const onPointerMove = e => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.last;
    dragRef.current.last = e.clientX;
    setRot(r => r + dx * 0.005); inertia.current = dx * 0.005;
  };
  const onPointerUp = () => { dragRef.current.active = false; };
  const dpr = quality === "low" ? [1, 1.1] : quality === "mid" ? [1, 1.35] : [1, 1.5];

  return (
    <Canvas
      shadows={quality !== "low"} dpr={dpr}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 3, 10], fov: 42, near: 0.1, far: 200 }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove}
      onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      data-testid="portfolio-canvas"
    >
      {/* Light cream sky */}
      <color attach="background" args={["#E8E4DA"]} />
      <fog attach="fog" args={["#F0EDE6", 22, 90]} />

      {/* Bright ambient — makes everything visible */}
      <ambientLight intensity={1.4} color="#FFF8F0" />

      {/* Strong sun from upper right */}
      <directionalLight position={[12, 20, 10]} intensity={1.8} color="#FFF5E0" castShadow
        shadow-mapSize={[2048, 2048]} />

      {/* Soft fill from left */}
      <directionalLight position={[-10, 8, 6]} intensity={0.6} color="#D0E8FF" />

      {/* Ground bounce */}
      <pointLight position={[0, -1, 5]} color="#F0E8D0" intensity={0.8} distance={20} decay={2} />

      <Suspense fallback={null}>
        <Arena heroRotationY={rot} />
      </Suspense>
      <CameraRig />
    </Canvas>
  );
}
