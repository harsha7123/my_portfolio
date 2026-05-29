import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { usePortfolio } from "../../store/usePortfolio";

export default function Embers({ count = 55, radius = 14 }) {
  const { reducedMotion, quality } = usePortfolio();
  const n = reducedMotion ? 18 : quality === "low" ? Math.floor(count * 0.4) : count;
  const mesh = useRef();
  const mesh2 = useRef();

  const data = useMemo(() => Array.from({ length: n }, () => ({
    x: (Math.random() - 0.5) * radius * 2,
    y: Math.random() * 7,
    z: (Math.random() - 0.5) * radius * 2,
    speed: 0.12 + Math.random() * 0.4,
    sway: Math.random() * Math.PI * 2,
    scale: 0.022 + Math.random() * 0.04,
    type: Math.random() > 0.45 ? 0 : 1, // 0=gold, 1=red
  })), [n, radius]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!mesh.current || !mesh2.current) return;
    const t = state.clock.elapsedTime;
    let gi = 0, ri = 0;
    data.forEach(p => {
      if (!reducedMotion) {
        p.y += p.speed * 0.014;
        if (p.y > 7) { p.y = 0; p.x = (Math.random() - 0.5) * radius * 2; p.z = (Math.random() - 0.5) * radius * 2; }
      }
      dummy.position.set(
        p.x + Math.sin(t * 0.5 + p.sway) * 0.3,
        p.y,
        p.z + Math.cos(t * 0.4 + p.sway) * 0.3
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      if (p.type === 0) { mesh.current.setMatrixAt(gi, dummy.matrix); gi++; }
      else { mesh2.current.setMatrixAt(ri, dummy.matrix); ri++; }
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh2.current.instanceMatrix.needsUpdate = true;
  });

  const gc = Math.max(data.filter(d => d.type === 0).length, 1);
  const rc = Math.max(data.filter(d => d.type === 1).length, 1);

  return (
    <>
      <instancedMesh ref={mesh} args={[null, null, gc]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#E8A020" transparent opacity={0.8} />
      </instancedMesh>
      <instancedMesh ref={mesh2} args={[null, null, rc]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#CC4418" transparent opacity={0.65} />
      </instancedMesh>
    </>
  );
}
