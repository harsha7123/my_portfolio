import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import Hero from "./Hero";
import Car from "./Car";
import ProjectGallery from "./ProjectGallery";
import Embers from "./Embers";
import Atmosphere from "./Atmosphere";
import { usePortfolio } from "../../store/usePortfolio";
import { PROJECTS_FALLBACK } from "../../content/portfolio";

const RING_RADIUS = 6.5;
const HIGHWAY_DURATION = 3.8;
const CIRCLING_DURATION = 5.5;

function HighwayRoad() {
  return (
    <group>
      {/* Main road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, -24]}>
        <planeGeometry args={[10, 58]} />
        <meshStandardMaterial color="#05091A" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* Edge glow lines */}
      {[-4.5, 4.5].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.685, -24]}>
          <planeGeometry args={[0.1, 58]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.5} />
        </mesh>
      ))}
      {/* Center dashes */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.682, -3 - i * 2.8]}>
          <planeGeometry args={[0.12, 1.6]} />
          <meshBasicMaterial color="#00E5FF" transparent opacity={0.45} />
        </mesh>
      ))}
      {/* Secondary lane lines */}
      {[-2.5, 2.5].map((x, j) =>
        Array.from({ length: 20 }).map((_, i) => (
          <mesh key={`${j}-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.682, -3 - i * 2.8]}>
            <planeGeometry args={[0.06, 1.0]} />
            <meshBasicMaterial color="#7B2FFF" transparent opacity={0.3} />
          </mesh>
        ))
      )}
    </group>
  );
}

export default function Arena({ heroRotationY }) {
  const carRef = useRef();
  const guidedAngle = useRef(-Math.PI / 2);
  const introPhaseStartTime = useRef(null);

  const {
    activeSection,
    reducedMotion,
    introDone,
    introPhase,
    setIntroPhase,
    setActive,
  } = usePortfolio();

  useFrame((state, dt) => {
    if (!carRef.current || !introDone) return;

    // ── INTRO ────────────────────────────────────────────────────────────────
    if (introPhase === "highway") {
      if (introPhaseStartTime.current === null)
        introPhaseStartTime.current = state.clock.elapsedTime;
      const elapsed = state.clock.elapsedTime - introPhaseStartTime.current;
      const raw = Math.min(elapsed / HIGHWAY_DURATION, 1);
      const p = 1 - Math.pow(1 - raw, 2.5);
      carRef.current.position.set(0, 0, -42 + p * (42 - RING_RADIUS));
      carRef.current.rotation.y = 0;
      if (raw >= 1) {
        setIntroPhase("circling");
        introPhaseStartTime.current = null;
        guidedAngle.current = -Math.PI / 2;
      }
      return;
    }

    if (introPhase === "circling") {
      if (introPhaseStartTime.current === null)
        introPhaseStartTime.current = state.clock.elapsedTime;
      const elapsed = state.clock.elapsedTime - introPhaseStartTime.current;
      const progress = Math.min(elapsed / CIRCLING_DURATION, 1);
      const angle = -Math.PI / 2 + progress * 1.3 * Math.PI * 2;
      guidedAngle.current = angle;
      const x = Math.cos(angle) * RING_RADIUS;
      const z = Math.sin(angle) * RING_RADIUS;
      carRef.current.position.set(x, 0, z);
      carRef.current.rotation.y = Math.atan2(-x, -z);
      if (progress >= 1) {
        setIntroPhase("done");
        setActive("home");
        introPhaseStartTime.current = null;
      }
      return;
    }

    // ── NORMAL ───────────────────────────────────────────────────────────────
    const t = state.clock.elapsedTime;
    let a;
    if (activeSection === "home" && !reducedMotion) {
      guidedAngle.current += dt * 0.5;
      a = guidedAngle.current;
    } else if (activeSection === "work") {
      guidedAngle.current += dt * 0.2;
      a = guidedAngle.current;
    } else {
      const diff = Math.PI - guidedAngle.current;
      guidedAngle.current += diff * Math.min(1, dt * 1.2);
      a = guidedAngle.current;
    }
    const x = Math.cos(a) * RING_RADIUS;
    const z = Math.sin(a) * RING_RADIUS;
    carRef.current.position.set(x, 0, z);
    carRef.current.rotation.y = Math.atan2(-x, -z);
    carRef.current.position.y = reducedMotion ? 0 : Math.sin(t * 4) * 0.01;
  });

  const showHighway = introPhase === "highway";
  const introDone_ = introPhase === "done";

  return (
    <group>
      {/* Ground — dark grid-like surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]} receiveShadow>
        <circleGeometry args={[60, 64]} />
        <meshStandardMaterial color="#040810" metalness={0.7} roughness={0.5} />
      </mesh>

      {/* Subtle ground glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.695, 0]}>
        <ringGeometry args={[0, 12, 64]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.025} />
      </mesh>

      {/* Ring track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.68, 0]}>
        <ringGeometry args={[RING_RADIUS - 1.4, RING_RADIUS + 1.4, 96]} />
        <meshStandardMaterial color="#06101E" metalness={0.9} roughness={0.2}
          emissive="#030A1A" emissiveIntensity={1} />
      </mesh>

      {/* Ring edge glow line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.674, 0]}>
        <ringGeometry args={[RING_RADIUS - 0.06, RING_RADIUS + 0.06, 96]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.22} />
      </mesh>

      {/* Track marker dashes */}
      {introDone_ && Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const x = Math.cos(a) * RING_RADIUS;
        const z = Math.sin(a) * RING_RADIUS;
        return (
          <mesh key={i} position={[x, -0.66, z]} rotation={[-Math.PI / 2, 0, -a]}>
            <planeGeometry args={[0.5, 0.08]} />
            <meshBasicMaterial color="#00E5FF" transparent opacity={0.4} />
          </mesh>
        );
      })}

      {/* Ring point lights — electric blue glow */}
      {introDone_ && [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a, i) => (
        <pointLight
          key={i}
          position={[Math.cos(a) * RING_RADIUS, 0.2, Math.sin(a) * RING_RADIUS]}
          color="#00AAFF"
          intensity={1.5}
          distance={5}
          decay={2}
        />
      ))}

      {/* Highway road (intro only) */}
      {showHighway && <HighwayRoad />}

      <ContactShadows position={[0, -0.69, 0]} opacity={0.5} scale={8} blur={3} far={5} color="#000020" />

      <Hero position={[0, 0, 0]} rotationY={heroRotationY} />

      {/* Scene fill light */}
      <pointLight position={[0, 6, 0]} color="#0A2050" intensity={0.8} distance={30} decay={1.4} />

      <Car groupRef={carRef} />

      <ProjectGallery
        projects={PROJECTS_FALLBACK}
        visible={introDone_ && activeSection === "work"}
      />

      <Embers count={40} radius={14} />
      <Atmosphere />
    </group>
  );
}
