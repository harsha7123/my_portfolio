import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../../store/usePortfolio";

export default function Preloader() {
  const { introDone, finishIntro } = usePortfolio();
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState("loading"); // loading → ready

  useEffect(() => {
    if (introDone) return;
    let p = 0;
    const t = setInterval(() => {
      p += 8 + Math.random() * 18;
      if (p >= 100) {
        p = 100; clearInterval(t);
        setPhase("ready");
        setTimeout(() => finishIntro(), 900);
      }
      setPct(Math.min(100, Math.round(p)));
    }, 100);
    const safety = setTimeout(() => { clearInterval(t); setPct(100); setPhase("ready"); finishIntro(); }, 5000);
    return () => { clearInterval(t); clearTimeout(safety); };
  }, [finishIntro, introDone]);

  return (
    <AnimatePresence>
      {!introDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "#020202",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}
          data-testid="preloader"
        >
          {/* Corner brackets */}
          {[["top:20px", "left:20px", "borderTop", "borderLeft"],
            ["top:20px", "right:20px", "borderTop", "borderRight"],
            ["bottom:20px", "left:20px", "borderBottom", "borderLeft"],
            ["bottom:20px", "right:20px", "borderBottom", "borderRight"],
          ].map(([pos1, pos2, b1, b2], i) => {
            const style = { position: "absolute", width: 36, height: 36 };
            pos1.split(":").reduce((o, v, i, a) => { if (i % 2) o[a[i-1]] = v; return o; }, style);
            pos2.split(":").reduce((o, v, i, a) => { if (i % 2) o[a[i-1]] = v; return o; }, style);
            style[b1] = "1px solid rgba(232,176,48,0.4)";
            style[b2] = "1px solid rgba(232,176,48,0.4)";
            return <div key={i} style={style} />;
          })}

          {/* Main title */}
          <motion.div
            animate={phase === "ready" ? { scale: 1.05, opacity: 1 } : {}}
            style={{ textAlign: "center", marginBottom: 40 }}
          >
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 11, letterSpacing: "0.4em",
              color: "rgba(232,176,48,0.5)",
              marginBottom: 16, textTransform: "uppercase",
            }}>
              Portfolio
            </div>
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 38, fontWeight: 700,
              letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#F0EAE0",
              textShadow: phase === "ready"
                ? "0 0 20px rgba(232,176,48,0.8), 0 0 60px rgba(232,176,48,0.4)"
                : "none",
              transition: "text-shadow 0.8s ease",
            }}>
              HARSHA
            </div>
          </motion.div>

          {/* Progress */}
          <div style={{ width: 220, marginBottom: 16 }}>
            <div style={{
              width: "100%", height: 1,
              background: "rgba(232,176,48,0.15)",
              position: "relative", overflow: "hidden",
            }}>
              <motion.div
                style={{
                  position: "absolute", top: 0, left: 0, height: "100%",
                  background: "linear-gradient(90deg, #CC2A18, #E8B030)",
                  boxShadow: "0 0 10px rgba(232,176,48,0.5)",
                }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: 9, letterSpacing: "0.25em",
            color: "rgba(232,176,48,0.45)",
          }}>
            {phase === "ready" ? "ENTERING" : `${pct}%`}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
