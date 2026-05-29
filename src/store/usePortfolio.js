import { create } from "zustand";
export const SECTIONS = ["home", "work", "contact"];
const reducedMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const isMobile = typeof navigator !== "undefined" && /Mobi|Android|iPhone|iPad/.test(navigator.userAgent);
const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 4 : 4;
const quality = isMobile || cores < 4 ? "low" : cores < 8 ? "mid" : "high";
const storedSound = typeof window !== "undefined" && window.localStorage ? window.localStorage.getItem("harsha_sound") === "on" : false;

export const usePortfolio = create((set, get) => ({
  activeSection: "home",
  setActive: (s) => set({ activeSection: s }),

  introPhase: "highway", // 'highway' | 'done'
  setIntroPhase: (p) => set({ introPhase: p }),

  carRingIndex: 0, panelOpen: false,
  setRingIndex: (i) => set({ carRingIndex: i }),
  setPanelOpen: (b) => set({ panelOpen: b }),

  soundOn: storedSound, reducedMotion, quality,
  toggleSound: () => {
    const v = !get().soundOn;
    if (typeof window !== "undefined") window.localStorage.setItem("harsha_sound", v ? "on" : "off");
    set({ soundOn: v });
  },
  setSound: (v) => { if (typeof window !== "undefined") window.localStorage.setItem("harsha_sound", v ? "on" : "off"); set({ soundOn: v }); },

  introDone: false,
  finishIntro: () => set({ introDone: true }),
}));
