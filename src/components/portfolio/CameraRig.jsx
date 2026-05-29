import React, { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { usePortfolio } from "../../store/usePortfolio";

const WAYPOINTS = {
  highway:  { pos: [0, 2.5, 10],   look: [0, 0.4, -12], fov: 48 },
  circling: { pos: [11, 7, 10],    look: [0, 1.0, 0],   fov: 52 },
  home:     { pos: [0, 2.4, 7.5],  look: [0, 1.2, 0],   fov: 38 },
  work:     { pos: [0, 3.8, 13],   look: [0, 1.5, 0],   fov: 52 },
  contact:  { pos: [0, 1.8, 4.5],  look: [0, 1.4, 0],   fov: 32 },
};

function isPortrait() {
  if (typeof window === "undefined") return false;
  return window.innerHeight > window.innerWidth;
}

export default function CameraRig() {
  const { camera } = useThree();
  const { activeSection, reducedMotion, introPhase, introDone } = usePortfolio();
  const lookAt = useRef({ x: 0, y: 1.2, z: 0 });
  const fovRef = useRef({ fov: 38 });

  const [resizeKey, setResizeKey] = React.useState(0);
  useEffect(() => {
    const onResize = () => setResizeKey((k) => k + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!introDone) return; // wait for preloader
    
    let wp;
    const portrait = isPortrait();

    if (introPhase === "highway") {
      wp = WAYPOINTS.highway;
    } else if (introPhase === "circling") {
      wp = WAYPOINTS.circling;
    } else {
      // introPhase === 'done' → use activeSection
      if (activeSection === "home") {
        wp = portrait
          ? { pos: [0, 2.6, 11], look: [0, 1.2, 0], fov: 52 }
          : WAYPOINTS.home;
      } else if (activeSection === "work") {
        wp = portrait
          ? { pos: [0, 4.5, 16], look: [0, 1.5, 0], fov: 60 }
          : WAYPOINTS.work;
      } else if (activeSection === "contact") {
        wp = portrait
          ? { pos: [0, 2.2, 7], look: [0, 1.4, 0], fov: 50 }
          : WAYPOINTS.contact;
      }
    }

    if (!wp) return;

    const dur = reducedMotion ? 0.2 : introPhase === "circling" ? 2.0 : 1.6;
    const ease = reducedMotion ? "power1.out" : "power3.inOut";

    gsap.to(camera.position, {
      x: wp.pos[0], y: wp.pos[1], z: wp.pos[2],
      duration: dur, ease, overwrite: true,
    });
    gsap.to(lookAt.current, {
      x: wp.look[0], y: wp.look[1], z: wp.look[2],
      duration: dur, ease, overwrite: true,
    });
    gsap.to(fovRef.current, {
      fov: wp.fov,
      duration: dur, ease, overwrite: true,
      onUpdate: () => {
        camera.fov = fovRef.current.fov;
        camera.updateProjectionMatrix();
      },
    });
  }, [activeSection, introPhase, introDone, reducedMotion, camera, resizeKey]);

  useFrame(() => {
    camera.lookAt(lookAt.current.x, lookAt.current.y, lookAt.current.z);
  });

  return null;
}
