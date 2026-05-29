import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { usePortfolio } from "../../store/usePortfolio";

/** Instanced cyber-particles — electric blue/cyan drifting upward */
export default function Embers({ count = 60, radius = 14 }) {
  const { reducedMotion, quality } = usePortfolio();
  const n = reducedMotion
    ? Math.min(count, 20)
    : quality === "low"
    ? Math.floor(count * 0.4)
    : count;

  const mesh = useRef();
  const mesh2 = useRef();

  const data = useMemo(() => {
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push({
        x: (Math.random() - 0.5) * radius * 2,
        y: Math.random() * 7,
        z: (Math.random() - 0.5) * radius * 2,
        speed: 0.15 + Math.random() * 0.5,
        sway: Math.random() * Math.PI * 2,
        scale: 0.025 + Math.random() * 0.045,
        type: Math.random() > 0.4 ? 0 : 1, // 0=cyan, 1=purple
      });
    }
    return arr;
  }, [n, radius]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!mesh.current || !mesh2.current) return;
    const t = state.clock.elapsedTime;
    let ci = 0, pi = 0;
    data.forEach((p) => {
      if (!reducedMotion) {
        p.y += p.speed * 0.015;
        if (p.y > 7) {
          p.y = 0;
          p.x = (Math.random() - 0.5) * radius * 2;
          p.z = (Math.random() - 0.5) * radius * 2;
        }
      }
      dummy.position.set(
        p.x + (reducedMotion ? 0 : Math.sin(t * 0.5 + p.sway) * 0.35),
        p.y,
        p.z + (reducedMotion ? 0 : Math.cos(t * 0.35 + p.sway) * 0.35)
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      if (p.type === 0) {
        mesh.current.setMatrixAt(ci, dummy.matrix);
        ci++;
      } else {
        mesh2.current.setMatrixAt(pi, dummy.matrix);
        pi++;
      }
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    mesh2.current.instanceMatrix.needsUpdate = true;
  });

  const cyanCount = data.filter((d) => d.type === 0).length;
  const purpleCount = data.filter((d) => d.type === 1).length;

  return (
    <>
      {/* Cyan particles */}
      <instancedMesh ref={mesh} args={[null, null, Math.max(cyanCount, 1)]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#00E5FF" transparent opacity={0.75} />
      </instancedMesh>
      {/* Purple particles */}
      <instancedMesh ref={mesh2} args={[null, null, Math.max(purpleCount, 1)]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#9B5FFF" transparent opacity={0.6} />
      </instancedMesh>
    </>
  );
}
