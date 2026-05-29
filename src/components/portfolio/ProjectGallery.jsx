import React, { useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { usePortfolio } from "../../store/usePortfolio";
import { sfxClick } from "../../lib/audio";

const CARD_LAYOUT = [
  { x: -5.5, y: 2.8, z: 2.0, ry: 0.22 },
  { x: -1.8, y: 2.8, z: 4.5, ry: 0.07 },
  { x:  1.8, y: 2.8, z: 4.5, ry: -0.07 },
  { x:  5.5, y: 2.8, z: 2.0, ry: -0.22 },
];

function FloatCard({ idx, children }) {
  const ref = useRef();
  useFrame(s => {
    if (ref.current)
      ref.current.position.y = CARD_LAYOUT[idx].y + Math.sin(s.clock.elapsedTime * 0.6 + idx * 1.4) * 0.06;
  });
  return (
    <group ref={ref} position={[CARD_LAYOUT[idx].x, CARD_LAYOUT[idx].y, CARD_LAYOUT[idx].z]}
      rotation={[0, CARD_LAYOUT[idx].ry, 0]}>
      {children}
    </group>
  );
}

export default function ProjectGallery({ projects, visible }) {
  const { carRingIndex, setRingIndex, setPanelOpen } = usePortfolio();
  const [hov, setHov] = useState(null);
  if (!visible) return null;

  return (
    <group>
      {projects.map((p, i) => {
        const active = carRingIndex === i;
        const h = hov === i;
        return (
          <FloatCard key={p.id} idx={i}>
            <Html center transform distanceFactor={9}
              style={{ width: 185, pointerEvents: "auto" }} zIndexRange={[10, 20]}>
              <div
                onClick={() => { sfxClick(); setRingIndex(i); setPanelOpen(true); }}
                onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)}
                style={{
                  width: 185, background: "#FFFFFF",
                  border: active ? "2px solid #B07C10" : h ? "1.5px solid #C8B090" : "1px solid #D8D2C8",
                  borderRadius: 6, padding: "12px 12px 14px",
                  cursor: "pointer",
                  transform: active ? "scale(1.06) translateY(-4px)" : h ? "scale(1.03) translateY(-2px)" : "scale(1)",
                  transition: "all 0.3s ease",
                  boxShadow: active ? "0 8px 32px rgba(176,124,16,0.2)" : h ? "0 4px 16px rgba(0,0,0,0.1)" : "0 2px 8px rgba(0,0,0,0.06)",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {/* Screenshot */}
                <div style={{ width: "100%", height: 95, background: "#F4F1EB",
                  border: "1px solid #E8E2D8", borderRadius: 4,
                  overflow: "hidden", marginBottom: 10, position: "relative" }}>
                  <img src={p.screenshot} alt={p.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover",
                      opacity: active ? 1 : 0.75, transition: "opacity 0.3s" }}
                    onError={e => e.target.style.display = "none"} />
                  {active && (
                    <div style={{ position: "absolute", top: 6, right: 6,
                      background: "#B07C10", color: "#fff",
                      padding: "2px 6px", fontSize: 8, fontWeight: 600, borderRadius: 2 }}>
                      LIVE
                    </div>
                  )}
                </div>

                {/* Index */}
                <div style={{ fontSize: 9, color: active ? "#B07C10" : "#9A8E82",
                  letterSpacing: "0.1em", marginBottom: 4, fontWeight: 600 }}>
                  0{i + 1} / 04
                </div>

                {/* Title */}
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1A1510",
                  marginBottom: 6, lineHeight: 1.3 }}>
                  {p.title}
                </div>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                  {p.tags.slice(0, 2).map(t => (
                    <span key={t} style={{ fontSize: 9, color: "#7A6E62",
                      border: "1px solid #D8D2C8", padding: "2px 6px",
                      borderRadius: 2, background: "#F8F6F2" }}>
                      {t}
                    </span>
                  ))}
                </div>

                <div style={{ fontSize: 10, color: active ? "#B07C10" : "#B0A898",
                  fontWeight: 600, transition: "color 0.3s" }}>
                  {active ? "Click to Open →" : "View Project →"}
                </div>
              </div>
            </Html>
          </FloatCard>
        );
      })}
    </group>
  );
}
