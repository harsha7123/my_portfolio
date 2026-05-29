import React, { useRef, useState } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { usePortfolio } from "../../store/usePortfolio";
import { sfxClick } from "../../lib/audio";

// 4 cards fanned in a wide arc facing the camera (camera at z≈13, y≈4)
const CARD_LAYOUT = [
  { x: -5.2, y: 2.6, z: 2.5, ry: 0.28 },
  { x: -1.8, y: 2.8, z: 5.0, ry: 0.09 },
  { x: 1.8,  y: 2.8, z: 5.0, ry: -0.09 },
  { x: 5.2,  y: 2.6, z: 2.5, ry: -0.28 },
];

function FloatGroup({ idx, children }) {
  const ref = useRef();
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y =
      CARD_LAYOUT[idx].y + Math.sin(t * 0.7 + idx * 1.3) * 0.07;
  });
  return (
    <group
      ref={ref}
      position={[CARD_LAYOUT[idx].x, CARD_LAYOUT[idx].y, CARD_LAYOUT[idx].z]}
      rotation={[0, CARD_LAYOUT[idx].ry, 0]}
    >
      {children}
    </group>
  );
}

export default function ProjectGallery({ projects, visible }) {
  const { carRingIndex, setRingIndex, setPanelOpen } = usePortfolio();
  const [hovered, setHovered] = useState(null);

  if (!visible) return null;

  return (
    <group>
      {projects.map((proj, i) => {
        const isActive = carRingIndex === i;
        const isHov = hovered === i;
        return (
          <FloatGroup key={proj.id} idx={i}>
            <Html
              center
              transform
              distanceFactor={9}
              style={{ width: 190, pointerEvents: "auto" }}
              zIndexRange={[10, 20]}
            >
              <div
                onClick={() => {
                  sfxClick();
                  setRingIndex(i);
                  setPanelOpen(true);
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width: 190,
                  background: isActive
                    ? "rgba(12,12,18,0.97)"
                    : "rgba(10,10,14,0.88)",
                  border: isActive
                    ? "1px solid rgba(255,255,105,0.65)"
                    : isHov
                    ? "1px solid rgba(255,255,105,0.3)"
                    : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 3,
                  padding: "12px 12px 14px",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
                  transform: isActive
                    ? "scale(1.06) translateY(-4px)"
                    : isHov
                    ? "scale(1.03) translateY(-2px)"
                    : "scale(1)",
                  boxShadow: isActive
                    ? `0 0 24px rgba(255,255,105,0.18), 0 0 0 1px rgba(255,255,105,0.1), inset 0 0 20px rgba(255,255,105,0.03)`
                    : isHov
                    ? "0 4px 20px rgba(0,0,0,0.6)"
                    : "0 2px 12px rgba(0,0,0,0.4)",
                  backdropFilter: "blur(12px)",
                  userSelect: "none",
                  fontFamily: "var(--font-body, 'Space Grotesk', sans-serif)",
                }}
              >
                {/* Screenshot / thumbnail */}
                <div
                  style={{
                    width: "100%",
                    height: 100,
                    background: "#0a0a10",
                    border: `1px solid ${isActive ? "rgba(255,255,105,0.2)" : "rgba(255,255,255,0.05)"}`,
                    borderRadius: 2,
                    overflow: "hidden",
                    marginBottom: 10,
                    position: "relative",
                  }}
                >
                  <img
                    src={proj.screenshot}
                    alt={proj.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      opacity: isActive ? 1 : 0.7,
                      transition: "opacity 0.3s",
                    }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        background: "rgba(255,255,105,0.15)",
                        border: "1px solid rgba(255,255,105,0.5)",
                        padding: "2px 6px",
                        fontSize: 7,
                        fontFamily: "var(--font-display, monospace)",
                        color: "#ffff69",
                        letterSpacing: "0.1em",
                      }}
                    >
                      ● LIVE
                    </div>
                  )}
                </div>

                {/* Index */}
                <div
                  style={{
                    fontSize: 8,
                    fontFamily: "var(--font-display, monospace)",
                    color: isActive ? "#ffff69" : "#8a8a8e",
                    letterSpacing: "0.12em",
                    marginBottom: 5,
                  }}
                >
                  0{i + 1} / 04
                </div>

                {/* Title */}
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: isActive ? "#f2f2f2" : "#b8b8ba",
                    marginBottom: 6,
                    lineHeight: 1.3,
                    letterSpacing: "0.02em",
                  }}
                >
                  {proj.title}
                </div>

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                  {proj.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      style={{
                        fontSize: 8,
                        fontFamily: "var(--font-display, monospace)",
                        color: "#8a8a8e",
                        border: "1px solid rgba(255,255,255,0.1)",
                        padding: "2px 5px",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div
                  style={{
                    fontSize: 8,
                    fontFamily: "var(--font-display, monospace)",
                    color: isActive ? "#ffff69" : isHov ? "#b8b8ba" : "#5a5a5e",
                    letterSpacing: "0.12em",
                    transition: "color 0.3s",
                  }}
                >
                  {isActive ? "VIEW PROJECT ▸" : "CLICK TO OPEN ▸"}
                </div>
              </div>
            </Html>
          </FloatGroup>
        );
      })}
    </group>
  );
}
