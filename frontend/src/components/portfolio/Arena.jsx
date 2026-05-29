import React, { useMemo, useRef, useEffect } from "react";
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
const HIGHWAY_DURATION = 3.8; // seconds car drives on highway
const CIRCLING_DURATION = 5.5; // seconds car circles the hero

// Road dashes along Z axis for the highway intro
function HighwayRoad() {
  return (
    <group>
      {/* Road surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, -24]}>
        <planeGeometry args={[9, 55]} />
        <meshStandardMaterial color="#0d0d10" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Road edges */}
      {[-4, 4].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.69, -24]}>
          <planeGeometry args={[0.12, 55]} />
          <meshBasicMaterial color="#FFFF69" transparent opacity={0.35} />
        </mesh>
      ))}
      {/* Center dashes */}
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.685, -4 - i * 3]}>
          <planeGeometry args={[0.14, 1.8]} />
          <meshBasicMaterial color="#FFFF69" transparent opacity={0.5} />
        </mesh>
      ))}
      {/* Shoulder lines */}
      {Array.from({ length: 18 }).map((_, i) => (
        <React.Fragment key={`s${i}`}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.8, -0.685, -4 - i * 3]}>
            <planeGeometry args={[0.06, 1.2]} />
            <meshBasicMaterial color="#888" transparent opacity={0.2} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2.8, -0.685, -4 - i * 3]}>
            <planeGeometry args={[0.06, 1.2]} />
            <meshBasicMaterial color="#888" transparent opacity={0.2} />
          </mesh>
        </React.Fragment>
      ))}
    </group>
  );
}

export default function Arena({ heroRotationY }) {
  const carRef = useRef();
  const guidedAngle = useRef(-Math.PI / 2); // start at bottom of circle
  const introStartTime = useRef(null);
  const introPhaseStartTime = useRef(null);

  const {
    activeSection,
    carRingIndex,
    panelOpen,
    reducedMotion,
    introDone,
    introPhase,
    setIntroPhase,
    setActive,
  } = usePortfolio();

  const list = PROJECTS_FALLBACK;

  useFrame((state, dt) => {
    if (!carRef.current) return;

    // ── INTRO SEQUENCE ──────────────────────────────────────────────────────
    if (!introDone) return; // preloader still up

    if (introPhase === "highway") {
      if (introPhaseStartTime.current === null) {
        introPhaseStartTime.current = state.clock.elapsedTime;
      }
      const elapsed = state.clock.elapsedTime - introPhaseStartTime.current;
      const raw = Math.min(elapsed / HIGHWAY_DURATION, 1);
      // ease-out cubic
      const p = 1 - Math.pow(1 - raw, 2.5);
      const z = -42 + p * (42 - RING_RADIUS); // -42 → -RING_RADIUS
      carRef.current.position.set(0, 0, z);
      carRef.current.rotation.y = 0; // faces +Z (toward camera)
      if (raw >= 1) {
        setIntroPhase("circling");
        introPhaseStartTime.current = null;
        guidedAngle.current = -Math.PI / 2;
      }
      return;
    }

    if (introPhase === "circling") {
      if (introPhaseStartTime.current === null) {
        introPhaseStartTime.current = state.clock.elapsedTime;
      }
      const elapsed = state.clock.elapsedTime - introPhaseStartTime.current;
      const progress = Math.min(elapsed / CIRCLING_DURATION, 1);
      // 1.25 full orbits
      const angle = -Math.PI / 2 + progress * 1.25 * Math.PI * 2;
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

    // ── NORMAL SECTIONS ──────────────────────────────────────────────────────
    const t = state.clock.elapsedTime;
    let a;

    if (activeSection === "home" && !reducedMotion) {
      guidedAngle.current += dt * 0.5;
      a = guidedAngle.current;
    } else if (activeSection === "work") {
      // Slow orbit while work cards are visible
      guidedAngle.current += dt * 0.22;
      a = guidedAngle.current;
    } else {
      // contact: park at back
      const target = Math.PI;
      const diff = target - guidedAngle.current;
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
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]} receiveShadow>
        <circleGeometry args={[60, 64]} />
        <meshStandardMaterial color="#0a0a0b" metalness={0.55} roughness={0.6} />
      </mesh>

      {/* Ring track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.68, 0]}>
        <ringGeometry args={[RING_RADIUS - 1.4, RING_RADIUS + 1.4, 96]} />
        <meshStandardMaterial color="#111114" metalness={0.8} roughness={0.25} emissive="#0a0a0b" />
      </mesh>

      {/* Track marker dashes */}
      {introDone_ && Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const x = Math.cos(a) * RING_RADIUS;
        const z = Math.sin(a) * RING_RADIUS;
        return (
          <mesh key={i} position={[x, -0.66, z]} rotation={[-Math.PI / 2, 0, -a]}>
            <planeGeometry args={[0.6, 0.1]} />
            <meshBasicMaterial color="#FFE9C4" transparent opacity={0.35} />
          </mesh>
        );
      })}

      {/* Highway road (only during intro) */}
      {showHighway && <HighwayRoad />}

      <ContactShadows position={[0, -0.69, 0]} opacity={0.65} scale={6} blur={2.4} far={4} color="#000" />

      <Hero position={[0, 0, 0]} rotationY={heroRotationY} />

      <pointLight position={[0, 6, 0]} color="#3a4658" intensity={0.6} distance={30} decay={1.4} />

      <Car groupRef={carRef} />

      {/* Project gallery — visible in work section after intro */}
      <ProjectGallery
        projects={list}
        visible={introDone_ && activeSection === "work"}
      />

      <Embers count={35} radius={14} />
      <Atmosphere />
    </group>
  );
}
