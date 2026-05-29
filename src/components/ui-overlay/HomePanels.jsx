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
          {/* LEFT — main identity */}
          <motion.div key="left"
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 1.1, ease, delay: 0.1 }}
            style={{ position: "fixed", zIndex: 30, pointerEvents: "none",
              top: "50%", left: "5vw", transform: "translateY(-50%)", maxWidth: 360 }}
            data-testid="home-left-panel"
          >
            {/* Label */}
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em",
              color: "#B07C10", textTransform: "uppercase", marginBottom: 12 }}>
              Platform & AI Engineer
            </div>

            {/* Big name */}
            <h1 style={{ fontFamily: "'Playfair Display', serif",
              fontSize: 58, fontWeight: 900, lineHeight: 1,
              color: "#1A1510", margin: "0 0 4px",
              letterSpacing: "0.02em" }}
              data-testid="hero-name">
              HARSHA
            </h1>

            {/* Gold underline */}
            <div style={{ width: 64, height: 3, background: "#B07C10", marginBottom: 20 }} />

            <p style={{ fontSize: 15, lineHeight: 1.7, color: "#3A2E24",
              marginBottom: 10, fontWeight: 400 }}
              data-testid="hero-tagline">
              {profile.tagline}
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#7A6E62", marginBottom: 32 }}>
              {profile.intro}
            </p>
            <div style={{ fontSize: 12, color: "#9A8E82", letterSpacing: "0.08em" }}>
              ↓ Scroll down to see my work
            </div>
          </motion.div>

          {/* RIGHT — skills + cta */}
          <motion.div key="right"
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 1.1, ease, delay: 0.25 }}
            style={{ position: "fixed", zIndex: 30, pointerEvents: "auto",
              top: "50%", right: "5vw", transform: "translateY(-50%)",
              maxWidth: 260, textAlign: "right" }}
            data-testid="home-right-panel"
          >
            <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em",
              color: "#B07C10", textTransform: "uppercase", marginBottom: 12 }}>
              2026
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.7, color: "#3A2E24", marginBottom: 20 }}>
              Platform · AI · Web<br />
              Linux → Shipped Products
            </div>

            {/* Skill chips */}
            <div style={{ display: "flex", flexWrap: "wrap",
              justifyContent: "flex-end", gap: 6, marginBottom: 24 }}>
              {profile.chips.map(c => (
                <span key={c} style={{
                  fontSize: 10, fontWeight: 500, letterSpacing: "0.06em",
                  padding: "4px 10px",
                  background: "#FFFFFF",
                  border: "1px solid #D8D2C8",
                  color: "#3A2E24",
                  borderRadius: 2,
                }}>
                  {c}
                </span>
              ))}
            </div>

            {/* Social links */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginBottom: 20 }}>
              <a href={profile.socials.linkedin} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: "#7A6E62", textDecoration: "none", fontWeight: 500 }}
                data-testid="social-linkedin">LinkedIn ↗</a>
              <a href={`mailto:${profile.socials.email}`}
                style={{ fontSize: 12, color: "#7A6E62", textDecoration: "none", fontWeight: 500 }}
                data-testid="social-email">Email ↗</a>
            </div>

            <button onClick={() => setActive("work")} className="btn-pixel"
              data-testid="enter-work-btn">
              View Work →
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
