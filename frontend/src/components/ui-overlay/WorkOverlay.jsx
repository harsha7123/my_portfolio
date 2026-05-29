import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../../store/usePortfolio";
import { PROJECTS_FALLBACK } from "../../content/portfolio";
import { sfxIgnition, sfxClick } from "../../lib/audio";

const ease = [0.16, 1, 0.3, 1];

export default function WorkOverlay({ projects }) {
  const {
    activeSection,
    carRingIndex,
    panelOpen,
    setPanelOpen,
    setRingIndex,
    introPhase,
  } = usePortfolio();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  const show = activeSection === "work" && introPhase === "done";
  const list = projects && projects.length ? projects : PROJECTS_FALLBACK;
  const current = list[carRingIndex] || list[0];

  useEffect(() => {
    if (show) sfxIgnition();
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Section label — top center */}
          <motion.div
            key="hud"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.9, ease }}
            className="fixed z-30 pointer-events-none px-4"
            style={{ top: 90, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}
            data-testid="work-hud"
          >
            <div className="font-display text-pixel glow-pixel mb-1" style={{ fontSize: 9, letterSpacing: "0.18em" }}>
              02 / WORK
            </div>
            <div className="font-display text-mid" style={{ fontSize: 9, letterSpacing: "0.1em" }}>
              CLICK A PROJECT CARD TO EXPLORE
            </div>
          </motion.div>

          {/* Scroll hint bottom */}
          {!panelOpen && (
            <motion.div
              key="scroll-hint"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.8, ease, delay: 0.3 }}
              className="fixed z-30 pointer-events-none"
              style={{ bottom: 32, left: "50%", transform: "translateX(-50%)", textAlign: "center" }}
            >
              <div className="font-display text-lo" style={{ fontSize: 9, letterSpacing: "0.14em" }}>
                ▾ scroll to <span className="text-pixel">CONTACT</span>
              </div>
            </motion.div>
          )}

          {/* Project detail panel — slides in from right when card clicked */}
          <AnimatePresence>
            {panelOpen && (
              <motion.div
                key="panel"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 60 }}
                transition={{ duration: 1.0, ease }}
                className="fixed z-40 pointer-events-auto project-panel-wrap"
                data-testid="project-panel"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="font-display text-pixel" style={{ fontSize: 10 }}>
                    PROJECT · 0{carRingIndex + 1}
                  </div>
                  <button
                    onClick={() => { sfxClick(); setPanelOpen(false); }}
                    className="nav-link"
                    data-testid="close-panel-btn"
                  >
                    CLOSE ✕
                  </button>
                </div>

                <h2
                  className="font-display text-hi mb-3"
                  style={{ fontSize: 20, lineHeight: 1.25 }}
                  data-testid="project-title"
                >
                  {current.title.toUpperCase()}
                </h2>
                <div className="text-hi opacity-80 mb-3" style={{ fontSize: 12 }}>
                  {current.role} · {current.year}
                </div>
                <p className="text-hi mb-5" style={{ fontSize: 14, lineHeight: 1.6 }}>
                  {current.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-5">
                  {current.tags.map((t) => (
                    <span
                      key={t}
                      className="font-display"
                      style={{
                        fontSize: 8,
                        letterSpacing: "0.12em",
                        padding: "5px 8px",
                        border: "1px solid var(--bg-line)",
                        color: "var(--text-hi)",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Live preview */}
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16 / 10",
                    background: "var(--bg-elev)",
                    border: "1px solid var(--bg-line)",
                    marginBottom: 18,
                    overflow: "hidden",
                    boxShadow: "0 0 0 1px rgba(255,255,105,0.08), 0 12px 40px rgba(0,0,0,0.5)",
                  }}
                >
                  {!iframeLoaded && (
                    <div
                      className="absolute inset-0 flex items-center justify-center font-display text-mid"
                      style={{ fontSize: 10, letterSpacing: "0.12em" }}
                    >
                      ◉ LOADING LIVE PREVIEW…
                    </div>
                  )}
                  <iframe
                    key={current.url}
                    src={current.url}
                    title={current.title}
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-popups"
                    onLoad={() => setIframeLoaded(true)}
                    style={{
                      position: "absolute", top: 0, left: 0,
                      width: "1280px", height: "800px",
                      border: 0, background: "#000",
                      transformOrigin: "top left",
                      transform: "scale(var(--iframe-scale, 0.46))",
                    }}
                    data-testid="project-iframe"
                  />
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <a
                    href={current.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pixel"
                    data-testid="visit-live-btn"
                    onClick={() => sfxClick()}
                  >
                    VISIT LIVE ↗
                  </a>
                  <button
                    onClick={() => {
                      sfxClick();
                      setPanelOpen(false);
                      setRingIndex((carRingIndex + 1) % list.length);
                    }}
                    className="btn-ember"
                    data-testid="drive-on-btn"
                  >
                    NEXT PROJECT ▸
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
