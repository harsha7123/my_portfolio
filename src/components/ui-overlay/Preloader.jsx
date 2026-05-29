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
      p += 10 + Math.random() * 18;
      if (p >= 100) { p = 100; clearInterval(t); setTimeout(finishIntro, 500); }
      setPct(Math.min(100, Math.round(p)));
    }, 90);
    const s = setTimeout(() => { clearInterval(t); setPct(100); finishIntro(); }, 5000);
    return () => { clearInterval(t); clearTimeout(s); };
  }, [finishIntro, introDone]);

  return (
    <AnimatePresence>
      {!introDone && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "#F4F1EB",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}
          data-testid="preloader"
        >
          <div style={{ fontFamily: "'Playfair Display', serif",
            fontSize: 52, fontWeight: 900, color: "#1A1510",
            letterSpacing: "0.06em", marginBottom: 8 }}>
            HARSHA
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif",
            fontSize: 12, color: "#9A8E82", letterSpacing: "0.2em",
            textTransform: "uppercase", marginBottom: 36 }}>
            Portfolio
          </div>
          <div style={{ width: 180, height: 1.5, background: "#D8D2C8", marginBottom: 12 }}>
            <motion.div
              style={{ height: "100%", background: "#B07C10" }}
              animate={{ width: `${pct}%` }} transition={{ duration: 0.1 }}
            />
          </div>
          <div style={{ fontFamily: "'Inter', sans-serif",
            fontSize: 11, color: "#9A8E82" }}>
            {pct}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
