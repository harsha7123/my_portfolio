import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../../store/usePortfolio";
import { PROJECTS_FALLBACK } from "../../content/portfolio";
import { sfxClick } from "../../lib/audio";

export default function WorkOverlay({ projects }) {
  const { activeSection, carRingIndex, panelOpen, setPanelOpen, setRingIndex, introPhase } = usePortfolio();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const show = activeSection === "work" && introPhase === "done";
  const list = projects?.length ? projects : PROJECTS_FALLBACK;
  const current = list[carRingIndex] || list[0];

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Top label */}
          <motion.div key="hud"
            initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.7 }}
            style={{ position: "fixed", zIndex: 30, pointerEvents: "none",
              top: 80, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}
            data-testid="work-hud">
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 600,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: "#B07C10", marginBottom: 4 }}>
              Work
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12,
              color: "#7A6E62", letterSpacing: "0.06em" }}>
              Click a project card to explore
            </div>
          </motion.div>

          {/* Scroll hint */}
          {!panelOpen && (
            <motion.div key="hint"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
              style={{ position: "fixed", zIndex: 30, pointerEvents: "none",
                bottom: 28, left: "50%", transform: "translateX(-50%)" }}>
              <div style={{ fontSize: 11, color: "#9A8E82", letterSpacing: "0.1em" }}>
                ↓ Scroll to Contact
              </div>
            </motion.div>
          )}

          {/* Detail panel */}
          <AnimatePresence>
            {panelOpen && (
              <motion.div key="panel"
                initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.8, ease: [0.16,1,0.3,1] }}
                className="project-panel-wrap" data-testid="project-panel">

                <div style={{ display: "flex", alignItems: "center",
                  justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: "#B07C10",
                    letterSpacing: "0.14em", textTransform: "uppercase" }}>
                    Project 0{carRingIndex + 1}
                  </div>
                  <button onClick={() => { sfxClick(); setPanelOpen(false); }}
                    style={{ fontSize: 12, color: "#7A6E62", background: "none",
                      border: "none", cursor: "pointer", fontFamily: "'Inter', sans-serif" }}
                    data-testid="close-panel-btn">
                    Close ✕
                  </button>
                </div>

                <h2 style={{ fontFamily: "'Playfair Display', serif",
                  fontSize: 22, fontWeight: 700, color: "#1A1510",
                  marginBottom: 8, lineHeight: 1.2 }}
                  data-testid="project-title">
                  {current.title}
                </h2>
                <div style={{ fontSize: 12, color: "#9A8E82", marginBottom: 12 }}>
                  {current.role} · {current.year}
                </div>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "#3A2E24", marginBottom: 16 }}>
                  {current.description}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
                  {current.tags.map(t => (
                    <span key={t} style={{ fontSize: 10, color: "#5A4E42",
                      border: "1px solid #D8D2C8", padding: "3px 9px",
                      background: "#F8F6F2", borderRadius: 2 }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Preview */}
                <div style={{ width: "100%", aspectRatio: "16/10",
                  background: "#F4F1EB", border: "1px solid #D8D2C8",
                  marginBottom: 18, overflow: "hidden", position: "relative", borderRadius: 4 }}>
                  {!iframeLoaded && (
                    <div style={{ position: "absolute", inset: 0, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 12, color: "#9A8E82" }}>
                      Loading preview…
                    </div>
                  )}
                  <iframe key={current.url} src={current.url} title={current.title}
                    loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups"
                    onLoad={() => setIframeLoaded(true)}
                    style={{ position: "absolute", top: 0, left: 0,
                      width: "1280px", height: "800px", border: 0,
                      transformOrigin: "top left",
                      transform: "scale(var(--iframe-scale, 0.45))" }}
                    data-testid="project-iframe" />
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <a href={current.url} target="_blank" rel="noopener noreferrer"
                    className="btn-pixel" onClick={() => sfxClick()}
                    data-testid="visit-live-btn">
                    Visit Live ↗
                  </a>
                  <button className="btn-ember"
                    onClick={() => { sfxClick(); setPanelOpen(false); setRingIndex((carRingIndex+1)%list.length); }}
                    data-testid="drive-on-btn">
                    Next →
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
