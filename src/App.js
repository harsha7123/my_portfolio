import React, { useEffect, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, ContactShadows, Environment, Html } from "@react-three/drei";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import "./App.css";

// ─── DATA ────────────────────────────────────────────────────────────────────
const PROFILE = {
  name: "HARSHA",
  role: "Platform & AI Engineer",
  tagline: "From Linux kernel internals to shipped AI products.",
  about: `With a B.Tech in Electrical Engineering from NIT Durgapur and hands-on experience at Samsung R&D, I specialize in Linux platform engineering and AI-powered NLP systems. I love working at the intersection of low-level systems and high-level intelligence — patching kernels, building LSTM models, and shipping fast, beautiful web products. Let's build something incredible together.`,
  chips: ["Ex-Samsung R&D", "NIT Durgapur", "Linux Kernel", "PyTorch / NLP", "RAG", "B.Tech EE"],
  email: "chedallaharsha3412@gmail.com",
  phone: "+91 78937 71551",
  linkedin: "https://www.linkedin.com/in/chedalla-sriharsha-9a411225a",
};

const SERVICES = [
  { num: "01", name: "Linux Platform Engineering", desc: "Kernel optimization, CVE patching, OS builds with Meson, KSM debugging, and memory performance tuning for production systems." },
  { num: "02", name: "AI & Deep Learning", desc: "Building LSTM-based NLP models, emotion detection systems, and autocomplete engines using PyTorch and real-world datasets." },
  { num: "03", name: "RAG & Chatbot Systems", desc: "Designing retrieval-augmented generation pipelines, vector databases, and AI-native chatbots for enterprise and product teams." },
  { num: "04", name: "Web Development", desc: "End-to-end React SPAs — from architecture to deployment. Fast, clean, production-grade interfaces built with intention." },
  { num: "05", name: "System Performance", desc: "20%+ OS performance improvements through strategic kernel config, memory footprint reduction, and benchmarking with VDbench and VDLTP." },
];

const PROJECTS = [
  {
    num: "01", type: "Samsung R&D",
    name: "Linux Kernel CVE Patching",
    url: "https://www.linkedin.com/in/chedalla-sriharsha-9a411225a",
    imgs: [
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&q=80",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80",
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80",
    ],
  },
  {
    num: "02", type: "Personal Project",
    name: "Voice Emotion Detection",
    url: "https://github.com/harsha7123",
    imgs: [
      "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80",
      "https://images.unsplash.com/photo-1579403124614-197f69d8187b?w=600&q=80",
    ],
  },
  {
    num: "03", type: "Freelance",
    name: "NAutomation Labs",
    url: "https://nautomationlabs.com",
    imgs: [
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&q=80",
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&q=80",
    ],
  },
];

const GIFS = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

// ─── REUSABLE ─────────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, y = 30, x = 0, duration = 0.7 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ContactButton({ style = {} }) {
  return (
    <a href={`mailto:${PROFILE.email}`} style={{
      display: "inline-flex", alignItems: "center",
      padding: "12px 32px", borderRadius: 999,
      background: "linear-gradient(123deg,#18011F 7%,#B600A8 37%,#7621B0 72%,#BE4C00 100%)",
      boxShadow: "0 4px 4px rgba(181,1,167,0.25), inset 4px 4px 12px #7721B1",
      outline: "2px solid #fff", outlineOffset: -3,
      color: "#fff", fontWeight: 500,
      fontFamily: "Kanit, sans-serif",
      fontSize: 13, letterSpacing: "0.12em",
      textTransform: "uppercase", textDecoration: "none",
      cursor: "pointer", transition: "transform 0.2s",
      ...style,
    }}
    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
    >
      Contact Me
    </a>
  );
}

// ─── 3D HERO ──────────────────────────────────────────────────────────────────
function HeroModel({ heroRotY }) {
  const { scene: heroScene } = useGLTF("/models/hero.glb");
  const { scene: carScene } = useGLTF("/models/musclecar.glb");
  const carRef = useRef();
  const heroRef = useRef();
  const wheelsRef = useRef([]);

  const carModel = useMemo(() => {
    const c = carScene.clone(true);
    wheelsRef.current = [];
    c.traverse(obj => {
      if (!obj.isMesh) return;
      obj.castShadow = true;
      const n = (obj.name || "").toLowerCase();
      const pn = (obj.parent?.name || "").toLowerCase();
      if (n.includes("wheel") || n.includes("tire") || pn.includes("wheel"))
        wheelsRef.current.push(obj);
      const mat = obj.material;
      if (!mat) return;
      if (mat.color) {
        const c1 = mat.color;
        const isPaint = (c1.r < 0.1 && c1.g < 0.1 && c1.b < 0.1 && mat.metalness > 0.4) ||
          (c1.r > 0.25 && c1.r > c1.g + 0.05);
        if (isPaint) {
          obj.material = mat.clone();
          obj.material.color = new THREE.Color("#8B0000"); // Dark red — Ford Mustang red
          obj.material.metalness = 0.95;
          obj.material.roughness = 0.06;
          obj.material.envMapIntensity = 2.5;
        }
      }
    });
    const bbox = new THREE.Box3().setFromObject(c);
    const size = new THREE.Vector3(); bbox.getSize(size);
    c.scale.setScalar(4.2 / Math.max(size.x, size.y, size.z));
    const b2 = new THREE.Box3().setFromObject(c);
    c.position.set(0, -b2.min.y - 0.6, 0);
    return c;
  }, [carScene]);

  const heroModel = useMemo(() => {
    const h = heroScene.clone(true);
    h.traverse(obj => {
      if (obj.isMesh) { obj.castShadow = true; obj.receiveShadow = true; }
    });
    const bbox = new THREE.Box3().setFromObject(h);
    const size = new THREE.Vector3(); bbox.getSize(size);
    h.scale.setScalar(2.8 / Math.max(size.x, size.y, size.z));
    const b2 = new THREE.Box3().setFromObject(h);
    h.position.set(0, -b2.min.y - 0.6, 0);
    return h;
  }, [heroScene]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (carRef.current) carRef.current.position.y = Math.sin(t * 1.8) * 0.04;
    if (heroRef.current) {
      heroRef.current.rotation.y = heroRotY;
      heroRef.current.position.y = Math.sin(t * 1.2) * 0.025;
    }
  });

  return (
    <>
      {/* Car — offset to left */}
      <group ref={carRef} position={[-3.2, 0, 0]}>
        <primitive object={carModel} />
        {/* Headlights */}
        {[-0.5, 0.5].map((x, i) => (
          <pointLight key={i} position={[x, 0.5, 2.2]} color="#FFF5CC" intensity={3} distance={10} decay={2} />
        ))}
        {/* Exhaust red glow */}
        <pointLight position={[0, 0.2, -2]} color="#FF3000" intensity={1.2} distance={4} decay={2} />
      </group>

      {/* Hero man — center right */}
      <group ref={heroRef} position={[1.8, 0, 0.5]}>
        <primitive object={heroModel} />
        {/* Rim light on hero */}
        <pointLight position={[-2, 3, -1]} color="#B600A8" intensity={2} distance={6} decay={2} />
        <pointLight position={[2, 2, 1]} color="#FFC060" intensity={1.5} distance={5} decay={2} />
      </group>
    </>
  );
}

function HeroCamera() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 2.8, 9);
    camera.lookAt(0, 1.2, 0);
  }, [camera]);
  useFrame(() => camera.lookAt(0, 1.2, 0));
  return null;
}

function HeroScene() {
  const [rot, setRot] = useState(0);
  const dragRef = useRef({ active: false, last: 0 });
  const inertia = useRef(0);
  useEffect(() => {
    let raf, lastT = performance.now();
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - lastT) / 1000); lastT = now;
      if (Math.abs(inertia.current) > 0.0004) { setRot(r => r + inertia.current); inertia.current *= 0.90; }
      else setRot(r => r + dt * 0.12);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <Canvas shadows gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}
      style={{ position: "absolute", inset: 0 }}
      onPointerDown={e => { dragRef.current = { active: true, last: e.clientX }; }}
      onPointerMove={e => {
        if (!dragRef.current.active) return;
        const dx = e.clientX - dragRef.current.last; dragRef.current.last = e.clientX;
        setRot(r => r + dx * 0.005); inertia.current = dx * 0.005;
      }}
      onPointerUp={() => { dragRef.current.active = false; }}
    >
      <color attach="background" args={["#0C0C0C"]} />
      <fog attach="fog" args={["#0C0C0C", 14, 40]} />
      <ambientLight intensity={0.3} color="#2020FF" />
      <directionalLight position={[8, 14, 6]} intensity={1.4} color="#FFF0D0" castShadow shadow-mapSize={[2048, 2048]} />
      <directionalLight position={[-10, 6, -4]} intensity={0.4} color="#4040FF" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0A0A0A" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Ground glow */}
      <pointLight position={[0, -0.4, 0]} color="#8B0000" intensity={2} distance={8} decay={2} />
      <React.Suspense fallback={null}>
        <HeroModel heroRotY={rot} />
      </React.Suspense>
      <ContactShadows position={[0, -0.59, 0]} opacity={0.6} scale={14} blur={3} far={6} />
      <HeroCamera />
    </Canvas>
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section style={{ height: "100vh", position: "relative", overflow: "hidden", background: "#0C0C0C", display: "flex", flexDirection: "column" }}>
      {/* Navbar */}
      <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ position: "relative", zIndex: 20, display: "flex", justifyContent: "space-between",
          padding: "24px 5vw", alignItems: "center" }}>
        {["About", "Services", "Projects", "Contact"].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{
            color: "#D7E2EA", fontWeight: 500, textTransform: "uppercase",
            letterSpacing: "0.1em", fontSize: "clamp(0.75rem, 1.2vw, 1.1rem)",
            textDecoration: "none", transition: "opacity 0.2s",
          }}
          onMouseEnter={e => e.target.style.opacity = 0.5}
          onMouseLeave={e => e.target.style.opacity = 1}
          >{l}</a>
        ))}
      </motion.nav>

      {/* 3D Canvas */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <HeroScene />
      </div>

      {/* Big name — bottom left */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 10, padding: "0 5vw 6vh" }}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.15 }}
          style={{ overflow: "hidden" }}>
          <h1 style={{
            fontFamily: "Kanit, sans-serif",
            fontSize: "clamp(14vw, 17.5vw, 18vw)",
            fontWeight: 900, textTransform: "uppercase",
            lineHeight: 0.85, letterSpacing: "-0.02em",
            whiteSpace: "nowrap", margin: 0,
            background: "linear-gradient(180deg, #646973 0%, #BBCCD7 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Harsha
          </h1>
        </motion.div>

        {/* Bottom bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", paddingTop: 12 }}>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.35 }}
            style={{ color: "#D7E2EA", fontWeight: 300, textTransform: "uppercase",
              letterSpacing: "0.08em", lineHeight: 1.4, margin: 0,
              fontSize: "clamp(0.7rem, 1.2vw, 1.1rem)", maxWidth: 260 }}>
            Platform & AI engineer — Linux internals to shipped products
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }}>
            <ContactButton />
          </motion.div>
        </div>
      </div>

      {/* Drag hint */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        style={{ position: "absolute", top: "50%", right: "3vw", zIndex: 20,
          color: "rgba(215,226,234,0.35)", fontSize: 10, letterSpacing: "0.15em",
          textTransform: "uppercase", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
        Drag to rotate
      </motion.div>
    </section>
  );
}

// ─── MARQUEE SECTION ──────────────────────────────────────────────────────────
function MarqueeSection() {
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const val = (window.scrollY - (window.scrollY + rect.top - window.innerHeight)) * 0.3;
      setOffset(val);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const row1 = [...GIFS.slice(0, 11), ...GIFS.slice(0, 11), ...GIFS.slice(0, 11)];
  const row2 = [...GIFS.slice(11), ...GIFS.slice(11), ...GIFS.slice(11)];

  return (
    <section ref={sectionRef} style={{ background: "#0C0C0C", padding: "10rem 0 3rem", overflow: "hidden" }}>
      {[{ imgs: row1, dir: 1 }, { imgs: row2, dir: -1 }].map(({ imgs, dir }, ri) => (
        <div key={ri} style={{ display: "flex", gap: 12, marginBottom: ri === 0 ? 12 : 0,
          transform: `translateX(${dir * offset - 200}px)`, willChange: "transform", transition: "none" }}>
          {imgs.map((src, i) => (
            <img key={i} src={src} alt="" loading="lazy"
              style={{ width: 420, height: 270, borderRadius: 16, objectFit: "cover", flexShrink: 0 }} />
          ))}
        </div>
      ))}
    </section>
  );
}

// ─── ABOUT SECTION ────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section id="about" style={{ minHeight: "100vh", background: "#0C0C0C", position: "relative",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "80px 5vw", textAlign: "center" }}>

      {/* Corner 3D decorative elements — using Harsha's actual photo */}
      <motion.div initial={{ opacity: 0, x: -80 }} whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.1 }}
        style={{ position: "absolute", top: "4%", left: "4%", zIndex: 2 }}>
        <img src="/harsha.jpg" alt="Harsha"
          style={{ width: 140, height: 180, objectFit: "cover", objectPosition: "top",
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            border: "2px solid rgba(215,226,234,0.2)", filter: "grayscale(20%)" }} />
      </motion.div>

      <FadeIn delay={0.15} x={80}>
        <div style={{ position: "absolute", top: "4%", right: "4%",
          width: 120, height: 120, borderRadius: "50%",
          background: "radial-gradient(circle, #B600A8 0%, #18011F 70%)",
          opacity: 0.6, filter: "blur(2px)" }} />
      </FadeIn>

      <FadeIn delay={0.25} x={-80}>
        <div style={{ position: "absolute", bottom: "8%", left: "6%",
          width: 100, height: 100,
          background: "conic-gradient(from 0deg, #BE4C00, #7621B0, #B600A8, #BE4C00)",
          borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
          opacity: 0.5 }} />
      </FadeIn>

      <FadeIn delay={0.3} x={80}>
        <div style={{ position: "absolute", bottom: "8%", right: "6%",
          width: 130, height: 130, borderRadius: 12,
          border: "2px solid rgba(215,226,234,0.15)",
          background: "rgba(215,226,234,0.03)",
          display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "rgba(215,226,234,0.3)", fontSize: 32 }}>⚡</span>
        </div>
      </FadeIn>

      {/* Heading */}
      <FadeIn y={40}>
        <h2 style={{
          fontFamily: "Kanit, sans-serif", fontWeight: 900, textTransform: "uppercase",
          lineHeight: 1, letterSpacing: "-0.02em", margin: "0 0 40px",
          fontSize: "clamp(3rem, 12vw, 140px)",
          background: "linear-gradient(180deg, #646973 0%, #BBCCD7 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          About me
        </h2>
      </FadeIn>

      <FadeIn delay={0.15} y={20}>
        <p style={{ color: "#D7E2EA", fontWeight: 300, textAlign: "center",
          lineHeight: 1.7, maxWidth: 580, margin: "0 auto 60px",
          fontSize: "clamp(1rem, 1.8vw, 1.25rem)" }}>
          {PROFILE.about}
        </p>
      </FadeIn>

      {/* Chips */}
      <FadeIn delay={0.2} y={20}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 56 }}>
          {PROFILE.chips.map(c => (
            <span key={c} style={{
              padding: "6px 16px", borderRadius: 999,
              border: "1px solid rgba(215,226,234,0.25)",
              color: "#D7E2EA", fontSize: 12, fontWeight: 400,
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}>
              {c}
            </span>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.3}>
        <ContactButton />
      </FadeIn>
    </section>
  );
}

// ─── SERVICES SECTION ─────────────────────────────────────────────────────────
function ServicesSection() {
  return (
    <section id="services" style={{
      background: "#fff", borderRadius: "60px 60px 0 0",
      padding: "clamp(80px, 10vw, 130px) 5vw",
      marginTop: -2,
    }}>
      <FadeIn>
        <h2 style={{ fontFamily: "Kanit, sans-serif", fontWeight: 900,
          textTransform: "uppercase", textAlign: "center",
          fontSize: "clamp(3rem, 12vw, 140px)", color: "#0C0C0C",
          letterSpacing: "-0.02em", lineHeight: 1, marginBottom: "clamp(60px, 8vw, 120px)" }}>
          Services
        </h2>
      </FadeIn>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {SERVICES.map((s, i) => (
          <FadeIn key={s.num} delay={i * 0.1} y={20}>
            <div style={{ display: "flex", gap: "clamp(16px, 3vw, 40px)", alignItems: "flex-start",
              padding: "clamp(28px, 4vw, 48px) 0",
              borderBottom: i < SERVICES.length - 1 ? "1px solid rgba(12,12,12,0.12)" : "none",
              borderTop: i === 0 ? "1px solid rgba(12,12,12,0.12)" : "none",
            }}>
              <span style={{ fontFamily: "Kanit, sans-serif", fontWeight: 900,
                fontSize: "clamp(2.5rem, 8vw, 110px)", color: "#0C0C0C",
                lineHeight: 1, flexShrink: 0, opacity: 0.9 }}>
                {s.num}
              </span>
              <div style={{ paddingTop: 6 }}>
                <div style={{ fontFamily: "Kanit, sans-serif", fontWeight: 500,
                  textTransform: "uppercase", marginBottom: 8,
                  fontSize: "clamp(1rem, 2vw, 1.9rem)", color: "#0C0C0C" }}>
                  {s.name}
                </div>
                <div style={{ fontWeight: 300, lineHeight: 1.6, opacity: 0.6,
                  fontSize: "clamp(0.85rem, 1.4vw, 1.1rem)", maxWidth: 520, color: "#0C0C0C" }}>
                  {s.desc}
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ─── PROJECTS SECTION ─────────────────────────────────────────────────────────
function ProjectCard({ project, index, total, progress }) {
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div style={{ height: "85vh", display: "flex", alignItems: "flex-start",
      justifyContent: "center", position: "sticky", top: 96 + index * 28 }}>
      <motion.div style={{
        scale, transformOrigin: "top center", width: "100%", maxWidth: 1100,
        background: "#0C0C0C", border: "2px solid #D7E2EA",
        borderRadius: 56, padding: "clamp(16px, 2.5vw, 32px)",
      }}>
        {/* Card top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16,
          marginBottom: "clamp(16px, 2.5vw, 28px)", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "Kanit, sans-serif", fontWeight: 900,
            fontSize: "clamp(2rem, 7vw, 90px)", color: "#D7E2EA", lineHeight: 1 }}>
            {project.num}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ color: "rgba(215,226,234,0.5)", fontSize: 11,
              fontWeight: 400, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 4 }}>
              {project.type}
            </div>
            <div style={{ fontFamily: "Kanit, sans-serif", fontWeight: 600,
              color: "#D7E2EA", fontSize: "clamp(1rem, 2.2vw, 1.8rem)",
              textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {project.name}
            </div>
          </div>
          <a href={project.url} target="_blank" rel="noopener noreferrer"
            style={{ padding: "10px 24px", borderRadius: 999,
              border: "2px solid #D7E2EA", color: "#D7E2EA",
              fontWeight: 500, fontSize: 12, letterSpacing: "0.12em",
              textTransform: "uppercase", textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(215,226,234,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            View →
          </a>
        </div>

        {/* Card images */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ width: "40%", display: "flex", flexDirection: "column", gap: 12 }}>
            {project.imgs.slice(0, 2).map((src, i) => (
              <img key={i} src={src} alt="" loading="lazy"
                style={{ width: "100%",
                  height: i === 0 ? "clamp(120px, 14vw, 200px)" : "clamp(150px, 20vw, 300px)",
                  objectFit: "cover", borderRadius: 40 }} />
            ))}
          </div>
          <div style={{ width: "60%" }}>
            <img src={project.imgs[2]} alt="" loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 40 }} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ProjectsSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section id="projects" ref={ref} style={{
      background: "#0C0C0C", borderRadius: "60px 60px 0 0",
      marginTop: -40, position: "relative", zIndex: 10,
      padding: "clamp(60px, 8vw, 100px) 5vw 0",
    }}>
      <FadeIn>
        <h2 style={{ fontFamily: "Kanit, sans-serif", fontWeight: 900,
          textTransform: "uppercase", textAlign: "center",
          fontSize: "clamp(3rem, 12vw, 140px)", letterSpacing: "-0.02em", lineHeight: 1,
          marginBottom: "clamp(40px, 6vw, 80px)",
          background: "linear-gradient(180deg, #646973 0%, #BBCCD7 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Projects
        </h2>
      </FadeIn>

      <div>
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.num} project={p} index={i} total={PROJECTS.length} progress={scrollYProgress} />
        ))}
      </div>
      <div style={{ height: "20vh" }} />
    </section>
  );
}

// ─── CONTACT SECTION ──────────────────────────────────────────────────────────
function ContactSection() {
  return (
    <section id="contact" style={{
      background: "#0C0C0C", padding: "clamp(80px, 10vw, 140px) 5vw",
      textAlign: "center",
    }}>
      <FadeIn>
        <h2 style={{ fontFamily: "Kanit, sans-serif", fontWeight: 900,
          textTransform: "uppercase", lineHeight: 1, letterSpacing: "-0.02em",
          fontSize: "clamp(3rem, 12vw, 140px)", marginBottom: 32,
          background: "linear-gradient(180deg, #646973 0%, #BBCCD7 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>
          Let&apos;s Talk
        </h2>
      </FadeIn>

      <FadeIn delay={0.1} y={20}>
        <p style={{ color: "rgba(215,226,234,0.6)", fontWeight: 300,
          fontSize: "clamp(1rem, 1.8vw, 1.3rem)", maxWidth: 480, margin: "0 auto 48px",
          lineHeight: 1.7 }}>
          Open to platform engineering roles, AI projects, and freelance web work.
          Let&apos;s build something incredible together.
        </p>
      </FadeIn>

      <FadeIn delay={0.2} y={20}>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
          <ContactButton />
          <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer"
            style={{ padding: "12px 32px", borderRadius: 999,
              border: "2px solid rgba(215,226,234,0.35)",
              color: "#D7E2EA", fontWeight: 500, fontSize: 13,
              letterSpacing: "0.12em", textTransform: "uppercase",
              textDecoration: "none", transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(215,226,234,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            LinkedIn ↗
          </a>
        </div>
      </FadeIn>

      <FadeIn delay={0.3}>
        <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap",
          color: "rgba(215,226,234,0.4)", fontSize: 13, letterSpacing: "0.08em" }}>
          <span>{PROFILE.email}</span>
          <span>{PROFILE.phone}</span>
          <span>India</span>
        </div>
      </FadeIn>

      {/* Footer */}
      <div style={{ marginTop: 80, paddingTop: 24, borderTop: "1px solid rgba(215,226,234,0.1)",
        display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
        color: "rgba(215,226,234,0.25)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        <span>© 2026 · Chedalla Gopala Krishna Sri Harsha</span>
        <span>Platform Engineer · NIT Durgapur · Ex-Samsung R&D</span>
      </div>
    </section>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ background: "#0C0C0C", overflowX: "clip" }}>
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  );
}
