import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../../store/usePortfolio";

const ease = [0.16, 1, 0.3, 1];

export default function HomePanels({ profile }) {
  const { activeSection, setActive, introPhase } = usePortfolio();
  const show = activeSection === "home" && introPhase === "done";

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* LEFT — identity */}
          <motion.div key="left"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 1.3, ease, delay: 0.1 }}
            style={{ position: "fixed", zIndex: 30, pointerEvents: "none",
              top: "50%", left: "5vw", transform: "translateY(-50%)", maxWidth: 340 }}
            data-testid="home-left-panel"
          >
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9,
              letterSpacing: "0.25em", color: "rgba(232,176,48,0.6)",
              textTransform: "uppercase", marginBottom: 14 }}>
              Platform Engineer
            </div>
            <h1 style={{ fontFamily: "'Cinzel', serif", fontSize: 42,
              fontWeight: 700, letterSpacing: "0.1em", lineHeight: 1,
              color: "#F0EAE0", margin: "0 0 6px",
              textShadow: "0 0 40px rgba(232,176,48,0.3)",
            }} data-testid="hero-name">
              HARSHA
            </h1>
            <div style={{ width: 60, height: 1,
              background: "linear-gradient(90deg, #E8B030, transparent)",
              marginBottom: 20 }} />
            <p style={{ fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 14, lineHeight: 1.7,
              color: "rgba(240,234,224,0.75)", marginBottom: 12 }}
              data-testid="hero-tagline">
              {profile.tagline}
            </p>
            <p style={{ fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 12, lineHeight: 1.7,
              color: "rgba(160,144,128,0.8)", marginBottom: 28 }}>
              {profile.intro}
            </p>
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 8,
              letterSpacing: "0.2em", color: "rgba(160,144,128,0.5)" }}>
              ▾ Scroll to explore
            </div>
          </motion.div>

          {/* RIGHT — details */}
          <motion.div key="right"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 1.3, ease, delay: 0.25 }}
            style={{ position: "fixed", zIndex: 30, pointerEvents: "auto",
              top: "50%", right: "5vw", transform: "translateY(-50%)",
              maxWidth: 280, textAlign: "right" }}
            data-testid="home-right-panel"
          >
            <div style={{ fontFamily: "'Cinzel', serif", fontSize: 9,
              letterSpacing: "0.25em", color: "rgba(232,176,48,0.6)",
              textTransform: "uppercase", marginBottom: 14 }}>
              2026
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 13, lineHeight: 1.7,
              color: "rgba(240,234,224,0.7)", marginBottom: 20 }}>
              Platform · AI · Web<br />
              Linux internals → shipped products
            </div>

            <div style={{ display: "flex", flexWrap: "wrap",
              justifyContent: "flex-end", gap: 6, marginBottom: 24 }}>
              {profile.chips.map(c => (
                <span key={c} style={{
                  fontFamily: "'Cinzel', serif", fontSize: 7,
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  padding: "5px 8px",
                  border: "1px solid rgba(232,176,48,0.2)",
                  color: "rgba(232,176,48,0.7)",
                  background: "rgba(232,176,48,0.04)",
                }}>
                  {c}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginBottom: 20 }}>
              <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer"
                className="nav-link" data-testid="social-linkedin">LinkedIn ↗</a>
              <a href={`mailto:${profile.socials.email}`}
                className="nav-link" data-testid="social-email">Email ↗</a>
            </div>

            <button onClick={() => setActive("work")} className="btn-pixel"
              data-testid="enter-work-btn">
              View Work ›
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
