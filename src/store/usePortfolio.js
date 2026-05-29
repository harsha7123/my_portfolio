import { create } from "zustand";

export const SECTIONS = ["home", "work", "contact"];

const reducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isMobile =
  typeof navigator !== "undefined" &&
  /Mobi|Android|iPhone|iPad/.test(navigator.userAgent);

const cores =
  typeof navigator !== "undefined" ? navigator.hardwareConcurrency || 4 : 4;

const quality = isMobile || cores < 4 ? "low" : cores < 8 ? "mid" : "high";

const storedSound =
  typeof window !== "undefined" && window.localStorage
    ? window.localStorage.getItem("harsha_sound") === "on"
    : false;

export const usePortfolio = create((set, get) => ({
  activeSection: "home",
  setActive: (s) => set({ activeSection: s }),

  // Intro sequence: highway → circling → done
  introPhase: "highway", // 'highway' | 'circling' | 'done'
  setIntroPhase: (p) => set({ introPhase: p }),

  // WORK arena
  carRingIndex: 0,
  panelOpen: false,
  carAngle: 0,
  carVelocity: 0,

  setRingIndex: (i) => set({ carRingIndex: i }),
  setPanelOpen: (b) => set({ panelOpen: b }),
  setCarAngle: (a) => set({ carAngle: a }),
  setCarVelocity: (v) => set({ carVelocity: v }),

  // user options
  soundOn: storedSound,
  reducedMotion,
  quality,
  setSound: (v) => {
    if (typeof window !== "undefined")
      window.localStorage.setItem("harsha_sound", v ? "on" : "off");
    set({ soundOn: v });
  },
  toggleSound: () => {
    const v = !get().soundOn;
    if (typeof window !== "undefined")
      window.localStorage.setItem("harsha_sound", v ? "on" : "off");
    set({ soundOn: v });
  },

  // preloader
  introDone: false,
  finishIntro: () => set({ introDone: true }),
}));
