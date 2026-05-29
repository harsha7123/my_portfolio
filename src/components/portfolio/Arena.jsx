import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import Hero from "./Hero";
import Car from "./Car";
import ProjectGallery from "./ProjectGallery";
import { usePortfolio } from "../../store/usePortfolio";
import { PROJECTS_FALLBACK } from "../../content/portfolio";

// Car drives in from the LEFT and parks beside the hero — no orbit
const PARK_X = -5.5; // parked position x
const PARK_Z = 2.0;  // parked position z
const START_X = -55; // off-screen left
const DRIVE_DURATION = 4.0;
const BRAKE_DURATION = 1.5; // slow decel near end

export default function Arena({ heroRotationY }) {
  const carRef = useRef();
  const phaseRef = useRef(null);

  const { activeSection, reducedMotion, introDone, introPhase, setIntroPhase, setActive } = usePortfolio();

  useFrame((state) => {
    if (!carRef.current || !introDone) return;

    if (introPhase === "highway") {
      if (phaseRef.current === null) phaseRef.current = state.clock.elapsedTime;
      const elapsed = state.clock.elapsedTime - phaseRef.current;
      const raw = Math.min(elapsed / DRIVE_DURATION, 1);
      // Ease out — slows to a smooth stop
      const eased = raw < 0.7
        ? raw / 0.7 * 0.85
        : 0.85 + (raw - 0.7) / 0.3 * 0.15;
      const smoothStop = 1 - Math.pow(1 - eased, 3);
      const x = START_X + smoothStop * (START_X * -1 + PARK_X);
      carRef.current.position.set(x, 0, PARK_Z);
      carRef.current.rotation.y = -Math.PI / 2; // facing right (toward hero)

      if (raw >= 1) {
        setIntroPhase("done");
        setActive("home");
        phaseRef.current = null;
      }
      return;
    }

    // After intro — car stays parked, gentle idle bob
    if (introPhase === "done") {
      const t = state.clock.elapsedTime;
      carRef.current.position.set(PARK_X, reducedMotion ? 0 : Math.sin(t * 2.2) * 0.008, PARK_Z);
      carRef.current.rotation.y = -Math.PI / 2;
    }
  });

  const isLive = introPhase === "done";

  return (
    <group>
      {/* Ground — warm stone/concrete */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.7, 0]} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color="#D8D0C0" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* Subtle ground grid lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={`gx${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-10 + i, -0.695, 0]}>
          <planeGeometry args={[0.02, 60]} />
          <meshBasicMaterial color="#C8C0B0" transparent opacity={0.4} />
        </mesh>
      ))}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={`gz${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.695, -10 + i]}>
          <planeGeometry args={[60, 0.02]} />
          <meshBasicMaterial color="#C8C0B0" transparent opacity={0.4} />
        </mesh>
      ))}

      {/* Road / driveway — car approaches along this */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-20, -0.693, PARK_Z]}>
        <planeGeometry args={[80, 5]} />
        <meshStandardMaterial color="#B8B0A0" roughness={0.9} />
      </mesh>

      {/* Subtle accent line along road edge */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-20, -0.69, PARK_Z - 2.55]}>
        <planeGeometry args={[80, 0.06]} />
        <meshBasicMaterial color="#B07C10" transparent opacity={0.5} />
      </mesh>

      <ContactShadows position={[0, -0.69, 0]} opacity={0.45} scale={20} blur={2.5} far={6} color="#8A7060" />

      {/* Soft environment light via hemisphere */}
      <hemisphereLight args={["#FFF8F0", "#D0C8B8", 0.5]} />

      <Hero position={[0, 0, 0]} rotationY={heroRotationY} />
      <Car groupRef={carRef} />

      {/* Project gallery in work section */}
      <ProjectGallery projects={PROJECTS_FALLBACK} visible={isLive && activeSection === "work"} />
    </group>
  );
}
