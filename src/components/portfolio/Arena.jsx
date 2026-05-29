import React, { useRef } from "react";
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
const HIGHWAY_DURATION = 4.2;  // car approaches from in FRONT of hero
const CIRCLING_DURATION = 6.0; // car circles hero 1.3 times

// Dark cinematic highway — car comes from z=+42 toward hero at origin
function HighwayRoad() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 22]}>
        <planeGeometry args={[9, 52]} />
        <meshStandardMaterial color="#05050A" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Edge lines — warm amber */}
      {[-4, 4].map((x, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, -0.685, 22]}>
          <planeGeometry args={[0.08, 52]} />
          <meshBasicMaterial color="#E8B030" transparent opacity={0.4} />
        </mesh>
      ))}
      {/* Center dashes */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.682, 3 + i * 2.5]}>
          <planeGeometry args={[0.1, 1.4]} />
          <meshBasicMaterial color="#E8B030" transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  );
}

export default function Arena({ heroRotationY }) {
  const carRef = useRef();
  const guidedAngle = useRef(Math.PI / 2); // starts at front (z+), approaching from z+
  const phaseTimeRef = useRef(null);

  const { activeSection, reducedMotion, introDone, introPhase, setIntroPhase, setActive } = usePortfolio();

  useFrame((state, dt) => {
    if (!carRef.current || !introDone) return;

    // ── HIGHWAY: car comes from z=+42 toward z=+RING_RADIUS ──────────────────
    if (introPhase === "highway") {
      if (phaseTimeRef.current === null) phaseTimeRef.current = state.clock.elapsedTime;
      const elapsed = state.clock.elapsedTime - phaseTimeRef.current;
      const raw = Math.min(elapsed / HIGHWAY_DURATION, 1);
      const p = 1 - Math.pow(1 - raw, 2.2); // ease out
      // Car comes from z=+42 toward z=+RING_RADIUS (the front of the ring)
      const z = 42 - p * (42 - RING_RADIUS);
      carRef.current.position.set(0, 0, z);
      // Car faces -Z (toward hero, toward camera behind hero)
      carRef.current.rotation.y = Math.PI;
      if (raw >= 1) {
        setIntroPhase("circling");
        phaseTimeRef.current = null;
        guidedAngle.current = Math.PI / 2; // start at front of circle
      }
      return;
    }

    // ── CIRCLING ──────────────────────────────────────────────────────────────
    if (introPhase === "circling") {
      if (phaseTimeRef.current === null) phaseTimeRef.current = state.clock.elapsedTime;
      const elapsed = state.clock.elapsedTime - phaseTimeRef.current;
      const progress = Math.min(elapsed / CIRCLING_DURATION, 1);
      // 1.3 orbits from front, going counter-clockwise
      const angle = Math.PI / 2 - progress * 1.3 * Math.PI * 2;
      guidedAngle.current = angle;
      const x = Math.cos(angle) * RING_RADIUS;
      const z = Math.sin(angle) * RING_RADIUS;
      carRef.current.position.set(x, 0, z);
      carRef.current.rotation.y = Math.atan2(-x, -z);
      if (progress >= 1) {
        setIntroPhase("done");
        setActive("home");
        phaseTimeRef.current = null;
      }
      return;
    }

    // ── NORMAL ────────────────────────────────────────────────────────────────
    const t = state.clock.elapsedTime;
    let a;
    if (activeSection === "home" && !reducedMotion) {
      guidedAngle.current += dt * 0.45;
      a = guidedAngle.current;
    } else if (activeSection === "work") {
      guidedAngle.current += dt * 0.18;
      a = guidedAngle.current;
    } else {
      guidedAngle.current += (Math.PI - guidedAngle.current) * Math.min(1, dt * 1.1);
      a = guidedAngle.current;
    }
    const x = Math.cos(a) * RING_RADIUS;
    const z = Math.sin(a) * RING_RADIUS;
    carRef.current.position.set(x, reducedMotion ? 0 : Math.sin(t * 4) * 0.01, z);
    carRef.current.rotation.y = Math.atan2(-x, -z);
  });

  const showHighway = introPhase === "highway";
  const isLive = introPhase === "done";

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]} receiveShadow>
        <circleGeometry args={[60, 64]} />
        <meshStandardMaterial color="#040305" metalness={0.5} roughness={0.65} />
      </mesh>

      {/* Ring track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.68, 0]}>
        <ringGeometry args={[RING_RADIUS - 1.4, RING_RADIUS + 1.4, 96]} />
        <meshStandardMaterial color="#080608" metalness={0.85} roughness={0.2}
          emissive="#060404" emissiveIntensity={1} />
      </mesh>

      {/* Warm gold ring glow line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.674, 0]}>
        <ringGeometry args={[RING_RADIUS - 0.05, RING_RADIUS + 0.05, 96]} />
        <meshBasicMaterial color="#E8B030" transparent opacity={0.18} />
      </mesh>

      {/* Track dashes */}
      {isLive && Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * RING_RADIUS, -0.66, Math.sin(a) * RING_RADIUS]}
            rotation={[-Math.PI / 2, 0, -a]}>
            <planeGeometry args={[0.5, 0.07]} />
            <meshBasicMaterial color="#E8B030" transparent opacity={0.35} />
          </mesh>
        );
      })}

      {/* Warm ring accent lights */}
      {isLive && [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((a, i) => (
        <pointLight key={i}
          position={[Math.cos(a) * RING_RADIUS, 0.3, Math.sin(a) * RING_RADIUS]}
          color="#E8A020" intensity={1.2} distance={5} decay={2} />
      ))}

      {showHighway && <HighwayRoad />}

      <ContactShadows position={[0, -0.69, 0]} opacity={0.7} scale={8} blur={3} far={5} color="#000005" />

      <Hero position={[0, 0, 0]} rotationY={heroRotationY} />
      <pointLight position={[0, 6, 0]} color="#1A0E06" intensity={1.2} distance={30} decay={1.4} />

      <Car groupRef={carRef} />

      <ProjectGallery projects={PROJECTS_FALLBACK} visible={isLive && activeSection === "work"} />

      <Embers count={45} radius={14} />
      <Atmosphere />
    </group>
  );
}
