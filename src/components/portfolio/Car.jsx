import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const MODEL_URL = "/models/musclecar.glb";
const BODY_COLOR = new THREE.Color("#080408"); // very dark, reflects warm gold env

export default function Car({ groupRef }) {
  const { scene } = useGLTF(MODEL_URL);
  const wheelsRef = useRef([]);

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    wheelsRef.current = [];
    c.traverse((obj) => {
      if (!obj.isMesh) return;
      obj.castShadow = true; obj.frustumCulled = false;
      const n = (obj.name || "").toLowerCase();
      const pn = (obj.parent?.name || "").toLowerCase();
      if (n.includes("wheel") || n.includes("tire") || n.includes("rim") || pn.includes("wheel"))
        wheelsRef.current.push(obj);
      const mat = obj.material;
      if (!mat) return;
      if (mat.color) {
        const c1 = mat.color;
        const isPaint =
          (c1.r > 0.25 && c1.r > c1.g + 0.05 && c1.r > c1.b + 0.05) ||
          (c1.r < 0.1 && c1.g < 0.1 && c1.b < 0.1 && mat.metalness > 0.4);
        if (isPaint) {
          obj.material = mat.clone();
          obj.material.color = BODY_COLOR.clone();
          obj.material.metalness = 0.95;
          obj.material.roughness = 0.08;
          obj.material.envMapIntensity = 2.2;
          return;
        }
      }
      if (n.includes("headlight") || n.includes("front_light") || n.includes("head_light")) {
        obj.material = mat.clone();
        if (obj.material.emissive) {
          obj.material.emissive = new THREE.Color("#F0D080");
          obj.material.emissiveIntensity = 2.5;
          obj.material.color = new THREE.Color("#FFF0C0");
        }
        return;
      }
      if (n.includes("taillight") || n.includes("brake") || n.includes("rear_light")) {
        obj.material = mat.clone();
        if (obj.material.emissive) {
          obj.material.emissive = new THREE.Color("#CC2A18");
          obj.material.emissiveIntensity = 1.8;
        }
        return;
      }
      if (mat.metalness !== undefined && mat.metalness > 0.3) mat.envMapIntensity = 1.8;
    });
    const bbox = new THREE.Box3().setFromObject(c);
    const size = new THREE.Vector3(); bbox.getSize(size);
    const k = 4.4 / Math.max(size.x, size.y, size.z);
    c.scale.setScalar(k);
    const bbox2 = new THREE.Box3().setFromObject(c);
    c.position.set(0, -0.7 - bbox2.min.y, 0);
    return c;
  }, [scene]);

  useFrame((_, dt) => {
    wheelsRef.current.forEach(w => { if (w) w.rotation.x -= dt * 5.2; });
  });

  return (
    <group ref={groupRef}>
      <primitive object={cloned} />
      {/* Warm golden headlight pools */}
      {[-0.7, 0.7].map((x, i) => (
        <pointLight key={`hl-${i}`} position={[x, 0.5, 2.2]}
          color="#F0C840" intensity={2.5} distance={12} decay={1.8} />
      ))}
      {/* Red exhaust glow */}
      <pointLight position={[0, 0.2, -2.4]} color="#CC2A18" intensity={0.8} distance={4} decay={2} />
      <mesh position={[0, 0.08, -2.5]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#FF5A1F" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}
useGLTF.preload(MODEL_URL);
