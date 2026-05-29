import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const MODEL_URL = "/models/musclecar.glb";

// Deep midnight blue — will catch the electric blue environment lights beautifully
const BODY_COLOR = new THREE.Color("#040B20");

export default function Car({ groupRef }) {
  const { scene } = useGLTF(MODEL_URL);
  const wheelsRef = useRef([]);

  const cloned = useMemo(() => {
    const c = scene.clone(true);
    wheelsRef.current = [];

    c.traverse((obj) => {
      if (!obj.isMesh) return;
      obj.castShadow = true;
      obj.receiveShadow = false;
      obj.frustumCulled = false;

      const n = (obj.name || "").toLowerCase();
      const parentName = (obj.parent?.name || "").toLowerCase();

      if (
        n.includes("wheel") || n.includes("tire") || n.includes("tyre") ||
        n.includes("rim") || parentName.includes("wheel")
      ) {
        wheelsRef.current.push(obj);
      }

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
          obj.material.metalness = 0.96;
          obj.material.roughness = 0.06;
          obj.material.envMapIntensity = 2.0;
          return;
        }
      }

      // Headlights — electric blue
      if (n.includes("headlight") || n.includes("front_light") || n.includes("head_light")) {
        obj.material = mat.clone();
        if (obj.material.emissive) {
          obj.material.emissive = new THREE.Color("#00E5FF");
          obj.material.emissiveIntensity = 2.2;
          obj.material.color = new THREE.Color("#80F0FF");
        }
        return;
      }
      // Tail-lights — neon purple
      if (n.includes("taillight") || n.includes("brake") || n.includes("rear_light") || n.includes("tail_light")) {
        obj.material = mat.clone();
        if (obj.material.emissive) {
          obj.material.emissive = new THREE.Color("#7B2FFF");
          obj.material.emissiveIntensity = 1.4;
        }
        return;
      }

      if (mat.metalness !== undefined && mat.metalness > 0.3) {
        mat.envMapIntensity = 1.8;
      }
    });

    const bbox = new THREE.Box3().setFromObject(c);
    const size = new THREE.Vector3();
    bbox.getSize(size);
    const targetLen = 4.4;
    const maxDim = Math.max(size.x, size.y, size.z);
    const k = maxDim > 0 ? targetLen / maxDim : 1.0;
    c.scale.setScalar(k);

    const bbox2 = new THREE.Box3().setFromObject(c);
    c.position.set(0, -0.7 - bbox2.min.y, 0);
    return c;
  }, [scene]);

  useFrame((_, dt) => {
    wheelsRef.current.forEach((w) => { if (w) w.rotation.x -= dt * 5.2; });
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={cloned} />

      {/* Electric blue headlight pools */}
      {[-0.7, 0.7].map((x, i) => (
        <pointLight
          key={`hl-${i}`}
          position={[x, 0.5, 2.2]}
          color="#00D4FF"
          intensity={2.0}
          distance={10}
          decay={1.8}
        />
      ))}

      {/* Neon purple underglow */}
      <pointLight position={[0, -0.3, 0]} color="#7B2FFF" intensity={0.8} distance={4} decay={2} />

      {/* Exhaust — purple glow */}
      <mesh position={[0, 0.05, -2.5]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshBasicMaterial color="#7B2FFF" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

useGLTF.preload(MODEL_URL);
