import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePortfolio } from "../../store/usePortfolio";

export default function Preloader() {
  const { introDone, finishIntro } = usePortfolio();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (introDone) return;
    let p = 0;
    const t = setInterval(() => {
      p += 10 + Math.random() * 16;
      if (p >= 100) {
        p = 100;
        clearInterval(t);
        setTimeout(() => finishIntro(), 400);
      }
      setPct(Math.min(100, Math.round(p)));
    }, 90);
    const safety = setTimeout(() => { clearInterval(t); setPct(100); finishIntro(); }, 4500);
    return () => { clearInterval(t); clearTimeout(safety); };
  }, [finishIntro, introDone]);

  return (
    <AnimatePresence>
      {!introDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: "#020408" }}
          data-testid="preloader"
        >
          {/* Top corner decorations */}
          <div style={{ position: "absolute", top: 24, left: 24, width: 40, height: 40,
            borderTop: "1px solid rgba(0,229,255,0.5)", borderLeft: "1px solid rgba(0,229,255,0.5)" }} />
          <div style={{ position: "absolute", top: 24, right: 24, width: 40, height: 40,
            borderTop: "1px solid rgba(0,229,255,0.5)", borderRight: "1px solid rgba(0,229,255,0.5)" }} />
          <div style={{ position: "absolute", bottom: 24, left: 24, width: 40, height: 40,
            borderBottom: "1px solid rgba(0,229,255,0.5)", borderLeft: "1px solid rgba(0,229,255,0.5)" }} />
          <div style={{ position: "absolute", bottom: 24, right: 24, width: 40, height: 40,
            borderBottom: "1px solid rgba(0,229,255,0.5)", borderRight: "1px solid rgba(0,229,255,0.5)" }} />

          <div className="font-display text-pixel glow-pixel mb-2" style={{ fontSize: 9, letterSpacing: "0.3em" }}>
            SYS_BOOT
          </div>
          <div className="font-display" style={{ fontSize: 22, letterSpacing: "0.25em", color: "#fff",
            textShadow: "0 0 30px rgba(0,229,255,0.8), 0 0 60px rgba(0,229,255,0.4)", marginBottom: 32 }}>
            HARSHA
          </div>

          <div className="progress-track mb-3" style={{ width: 240 }}>
            <div className="progress-fill" style={{ width: `${pct}%` }} data-testid="preloader-fill" />
          </div>

          <div className="font-display text-lo" style={{ fontSize: 8, letterSpacing: "0.2em" }}>
            {pct < 100 ? `INITIALIZING_SEQUENCE... ${pct}%` : "LAUNCH_READY"}
          </div>

          <div className="font-display" style={{ position: "absolute", bottom: 36,
            fontSize: 8, letterSpacing: "0.15em", color: "rgba(0,229,255,0.3)" }}>
            CHEDALLA GOPALA KRISHNA SRI HARSHA
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
