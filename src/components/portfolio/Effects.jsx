import React from "react";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

export default function Effects({ quality = "high" }) {
  const heavy = quality === "high";
  return (
    <EffectComposer multisampling={heavy ? 4 : 0}>
      <Bloom intensity={heavy ? 0.55 : 0.35} luminanceThreshold={0.4} luminanceSmoothing={0.8} mipmapBlur />
      <Vignette eskil={false} offset={0.2} darkness={0.92} />
    </EffectComposer>
  );
}
