import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Arena from "./Arena";
import CameraRig from "./CameraRig";
import Effects from "./Effects";
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
      else if (!dragRef.current.active) setRot(r => r + dt * 0.08);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  const onPointerDown = e => { dragRef.current = { active: true, last: e.clientX }; };
  const onPointerMove = e => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.last; dragRef.current.last = e.clientX;
    setRot(r => r + dx * 0.006); inertia.current = dx * 0.006;
  };
  const onPointerUp = () => { dragRef.current.active = false; };
  const dpr = quality === "low" ? [1, 1.1] : quality === "mid" ? [1, 1.35] : [1, 1.5];

  return (
    <Canvas
      shadows={quality !== "low"} dpr={dpr}
      gl={{ antialias: quality !== "low", alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 2.4, 7.5], fov: 38, near: 0.1, far: 200 }}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove}
      onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
      style={{ position: "fixed", inset: 0, zIndex: 0 }}
      data-testid="portfolio-canvas"
    >
      {/* Dark cinematic void */}
      <color attach="background" args={["#04030A"]} />
      <fog attach="fog" args={["#0A0608", 15, 85]} />

      {/* Warm ambient — low golden fill */}
      <ambientLight intensity={0.18} color="#1A1008" />

      {/* Main key light — warm gold from upper right */}
      <directionalLight position={[10, 20, 8]} intensity={0.7} color="#F0C860" castShadow />

      {/* Cool rim from left — creates cinematic contrast */}
      <directionalLight position={[-14, 10, -8]} intensity={0.3} color="#6080C0" />

      {/* Deep warm fill from below */}
      <pointLight position={[0, -1, 4]} color="#200F06" intensity={2} distance={18} decay={2} />

      <Suspense fallback={null}>
        <Arena heroRotationY={rot} />
        {quality !== "low" && <Effects quality={quality} />}
      </Suspense>
      <CameraRig />
    </Canvas>
  );
}
