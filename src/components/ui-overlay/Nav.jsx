import React, { useEffect } from "react";
import { usePortfolio, SECTIONS } from "../../store/usePortfolio";
import { enableSound, disableSound, sfxClick } from "../../lib/audio";

export default function Nav() {
  const { activeSection, setActive, soundOn, toggleSound, introPhase } = usePortfolio();
  useEffect(() => { soundOn ? enableSound() : disableSound(); }, [soundOn]);
  const onNav = s => { sfxClick(); setActive(s); };

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 40,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "18px 5vw",
      background: "rgba(244,241,235,0.88)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(216,210,200,0.6)",
    }} data-testid="top-nav">
      <div style={{ fontFamily: "'Playfair Display', serif",
        fontSize: 18, fontWeight: 900, color: "#1A1510", letterSpacing: "0.04em" }}
        data-testid="brand">
        HARSHA
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        {SECTIONS.map(s => (
          <button key={s} onClick={() => onNav(s)}
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 12, fontWeight: activeSection === s ? 600 : 400,
              letterSpacing: "0.08em", textTransform: "uppercase",
              color: activeSection === s ? "#1A1510" : "#9A8E82",
              background: "transparent", border: "none",
              padding: "6px 14px", cursor: "pointer",
              borderBottom: activeSection === s ? "2px solid #B07C10" : "2px solid transparent",
              transition: "all 0.2s",
            }}
            data-testid={`nav-${s}`}>
            {s}
          </button>
        ))}
      </div>
    </nav>
  );
}
