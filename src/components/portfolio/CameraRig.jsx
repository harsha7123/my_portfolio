import React, { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { usePortfolio } from "../../store/usePortfolio";

// Clean camera positions for light theme
const WP = {
  highway: { pos: [-8, 3.5, 14], look: [-3, 1.5, 0], fov: 46 }, // side angle watching car arrive
  home:    { pos: [0, 3.2, 10],  look: [0, 1.5, 0],  fov: 42 }, // front view — hero + parked car
  work:    { pos: [0, 4.2, 14],  look: [0, 1.8, 0],  fov: 50 }, // wider — shows project cards
  contact: { pos: [0, 2.0, 5],   look: [0, 1.4, 0],  fov: 36 }, // close up
};

function portrait() { return typeof window !== "undefined" && window.innerHeight > window.innerWidth; }

export default function CameraRig() {
  const { camera } = useThree();
  const { activeSection, reducedMotion, introPhase, introDone } = usePortfolio();
  const look = useRef({ x: 0, y: 1.5, z: 0 });
  const fovRef = useRef({ fov: 42 });
  const [rk, setRk] = React.useState(0);

  useEffect(() => {
    const h = () => setRk(k => k + 1);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  useEffect(() => {
    if (!introDone) return;
    const p = portrait();
    let wp;

    if (introPhase === "highway") {
      wp = WP.highway;
    } else {
      if (activeSection === "home")    wp = p ? { pos: [0,3.5,13], look: [0,1.5,0], fov: 52 } : WP.home;
      else if (activeSection === "work")    wp = p ? { pos: [0,5,18],  look: [0,1.8,0], fov: 60 } : WP.work;
      else if (activeSection === "contact") wp = p ? { pos: [0,2.5,8], look: [0,1.4,0], fov: 48 } : WP.contact;
    }
    if (!wp) return;

    const dur = reducedMotion ? 0.15 : 1.6;
    const ease = "power3.inOut";
    gsap.to(camera.position, { x: wp.pos[0], y: wp.pos[1], z: wp.pos[2], duration: dur, ease, overwrite: true });
    gsap.to(look.current, { x: wp.look[0], y: wp.look[1], z: wp.look[2], duration: dur, ease, overwrite: true });
    gsap.to(fovRef.current, {
      fov: wp.fov, duration: dur, ease, overwrite: true,
      onUpdate: () => { camera.fov = fovRef.current.fov; camera.updateProjectionMatrix(); },
    });
  }, [activeSection, introPhase, introDone, reducedMotion, camera, rk]);

  useFrame(() => camera.lookAt(look.current.x, look.current.y, look.current.z));
  return null;
}
