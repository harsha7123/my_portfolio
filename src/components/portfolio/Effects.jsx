import React from "react";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

export default function Effects({ quality = "high" }) {
  const useHeavy = quality === "high";
  return (
    <EffectComposer multisampling={useHeavy ? 4 : 0}>
      <Bloom
        intensity={useHeavy ? 0.65 : 0.4}
        luminanceThreshold={0.3}
        luminanceSmoothing={0.85}
        mipmapBlur
      />
      <Vignette eskil={false} offset={0.25} darkness={0.85} />
    </EffectComposer>
  );
}
