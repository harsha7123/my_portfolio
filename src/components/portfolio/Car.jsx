import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const MODEL_URL = "/models/musclecar.glb";
// Glossy black car — stands out against light ground
const BODY = new THREE.Color("#0A0A0C");

export default function Car({ groupRef }) {
  const { scene } = useGLTF(MODEL_URL);
  const wheelsRef = useRef([]);

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    wheelsRef.current = [];
    c.traverse(obj => {
      if (!obj.isMesh) return;
      obj.castShadow = true; obj.receiveShadow = true; obj.frustumCulled = false;
      const n = (obj.name || "").toLowerCase();
      const pn = (obj.parent?.name || "").toLowerCase();
      if (n.includes("wheel")||n.includes("tire")||n.includes("rim")||pn.includes("wheel"))
        wheelsRef.current.push(obj);
      const mat = obj.material; if (!mat) return;
      if (mat.color) {
        const c1 = mat.color;
        const isPaint = (c1.r > 0.25 && c1.r > c1.g + 0.05 && c1.r > c1.b + 0.05) ||
          (c1.r < 0.1 && c1.g < 0.1 && c1.b < 0.1 && mat.metalness > 0.4);
        if (isPaint) {
          obj.material = mat.clone();
          obj.material.color = BODY.clone();
          obj.material.metalness = 0.98; obj.material.roughness = 0.04;
          obj.material.envMapIntensity = 3.0;
          return;
        }
      }
      if (n.includes("headlight")||n.includes("front_light")||n.includes("head_light")) {
        obj.material = mat.clone();
        if (obj.material.emissive) { obj.material.emissive = new THREE.Color("#FFF5D0"); obj.material.emissiveIntensity = 1.0; }
        return;
      }
      if (n.includes("taillight")||n.includes("brake")||n.includes("rear_light")) {
        obj.material = mat.clone();
        if (obj.material.emissive) { obj.material.emissive = new THREE.Color("#CC2010"); obj.material.emissiveIntensity = 0.6; }
        return;
      }
      if (mat.metalness > 0.3) mat.envMapIntensity = 2.5;
    });
    const bbox = new THREE.Box3().setFromObject(c), size = new THREE.Vector3();
    bbox.getSize(size);
    c.scale.setScalar(4.4 / Math.max(size.x, size.y, size.z));
    const b2 = new THREE.Box3().setFromObject(c);
    c.position.set(0, -0.7 - b2.min.y, 0);
    return c;
  }, [scene]);

  useFrame((_, dt) => wheelsRef.current.forEach(w => w && (w.rotation.x -= dt * 0)));

  return (
    <group ref={groupRef}>
      <primitive object={cloned} />
    </group>
  );
}
useGLTF.preload(MODEL_URL);
