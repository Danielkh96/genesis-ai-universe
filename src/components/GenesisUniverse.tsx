"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Code2,
  Megaphone,
  Orbit,
  Radar,
  RefreshCw,
  Rocket,
  Sparkles,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type Module = {
  id: string;
  title: string;
  label: string;
  short: string;
  icon: "code" | "agent" | "automation" | "marketing";
  color: string;
  emissive: string;
  position: [number, number, number];
  description: string;
  bullets: string[];
};

type Mentor = {
  name: string;
  role: string;
  avatar: string;
  description: string;
  focus: string[];
};

const modules: Module[] = [
  {
    id: "coding",
    title: "AI Coding Galaxy",
    label: "AI Coding",
    short: "CODE",
    icon: "code",
    color: "#38bdf8",
    emissive: "#0ea5e9",
    position: [-4.1, 1.55, 0.2],
    description: "从不会写代码，到可以用 AI 建网站、工具、App 与业务系统。",
    bullets: ["Cursor / Claude Code 工作流", "Prompt-to-App 实战", "部署到 Vercel 与真实上线"],
  },
  {
    id: "agents",
    title: "AI Agent Galaxy",
    label: "AI Agent",
    short: "AGENT",
    icon: "agent",
    color: "#a855f7",
    emissive: "#7c3aed",
    position: [4.2, 1.2, -0.35],
    description: "打造会思考、会调用工具、会执行任务的 AI Agent 系统。",
    bullets: ["Agent 架构与工具调用", "多 Agent 协作", "业务 SOP 自动执行"],
  },
  {
    id: "automation",
    title: "AI Automation Galaxy",
    label: "Automation",
    short: "AUTO",
    icon: "automation",
    color: "#22c55e",
    emissive: "#16a34a",
    position: [-3.55, -2.05, -0.2],
    description: "把重复性工作变成自动化流程，串接表格、API、社群与 CRM。",
    bullets: ["Google Sheets 自动化", "OpenClaw / API 串接", "自动发帖、写回、通知"],
  },
  {
    id: "marketing",
    title: "AI Marketing Galaxy",
    label: "Marketing",
    short: "MKT",
    icon: "marketing",
    color: "#f97316",
    emissive: "#ea580c",
    position: [3.65, -2.0, 0.25],
    description: "用 AI 生产高转化内容、广告图、短影音脚本与营销漏斗。",
    bullets: ["爆款 Hook 与中文文案", "AI 广告图 / 海报", "FB / IG 内容矩阵"],
  },
];

const mentors: Mentor[] = [
  { name: "Genesis", role: "AI 总导师 · 学习路线总控", avatar: "G", description: "我会把 AI 学习拆成一条清晰路线：先会用，再会做，再会自动化，最后变成业务能力。", focus: ["学习路线", "课程导航", "项目式训练"] },
  { name: "CodeX", role: "AI Coding Mentor", avatar: "C", description: "我负责带你用 AI 写网站、写工具、修 bug、部署上线，让非程序员也能做出真实产品。", focus: ["AI 写代码", "Next.js 项目", "上线部署"] },
  { name: "AgentOS", role: "AI Agent Architect", avatar: "A", description: "我会教你把 AI 变成能执行任务的 Agent，让它可以读资料、调用工具、判断下一步。", focus: ["工具调用", "Agent 流程", "多 Agent 协作"] },
  { name: "AutoPilot", role: "Automation Engineer", avatar: "P", description: "我负责把你的日常工作接成自动流程：表格、API、社群、通知、CRM 全部串起来。", focus: ["Google Sheets", "API", "业务自动化"] },
  { name: "MarketMind", role: "AI Marketing Strategist", avatar: "M", description: "我帮你用 AI 做出吸睛文案、广告图、内容排程和销售漏斗，让流量变成询问。", focus: ["营销文案", "广告素材", "内容矩阵"] },
];

const iconMap = { code: Code2, agent: Bot, automation: Workflow, marketing: Megaphone };

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.075, smoothWheel: true });
    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);
}

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span id="genesis-clock">{time}</span>;
}

function CoreBrain({ activeColor }: { activeColor: string }) {
  const core = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (core.current) {
      core.current.rotation.y = t * 0.28;
      core.current.rotation.x = Math.sin(t * 0.65) * 0.18;
      const pulse = 1 + Math.sin(t * 2.1) * 0.035;
      core.current.scale.setScalar(pulse);
    }
    if (inner.current) inner.current.rotation.y = -t * 0.42;
    if (ringA.current) ringA.current.rotation.z = t * 0.34;
    if (ringB.current) ringB.current.rotation.x = t * 0.24;
  });

  return (
    <group>
      <mesh ref={inner}>
        <icosahedronGeometry args={[1.05, 2]} />
        <meshStandardMaterial color="#031827" emissive={activeColor} emissiveIntensity={1.4} roughness={0.18} metalness={0.72} wireframe />
      </mesh>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.82, 3]} />
        <meshStandardMaterial color="#67e8f9" emissive={activeColor} emissiveIntensity={2.25} roughness={0.08} metalness={0.85} transparent opacity={0.74} />
      </mesh>
      <mesh ref={ringA} rotation={[Math.PI / 2.1, 0, 0]}>
        <torusGeometry args={[1.55, 0.018, 16, 180]} />
        <meshBasicMaterial color={activeColor} transparent opacity={0.86} />
      </mesh>
      <mesh ref={ringB} rotation={[0.8, 0.35, 0.2]}>
        <torusGeometry args={[2.18, 0.009, 16, 220]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.44} />
      </mesh>
      <mesh rotation={[1.15, 0.2, 0]}>
        <torusGeometry args={[2.95, 0.006, 12, 240]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.26} />
      </mesh>
      <pointLight color={activeColor} intensity={9} distance={8} />

    </group>
  );
}

function Planet({ module, active, onSelect }: { module: Module; active: boolean; onSelect: (id: string) => void }) {
  const group = useRef<THREE.Group>(null);
  const planet = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.position.y = module.position[1] + Math.sin(t * 1.25 + module.position[0]) * 0.16;
      group.current.rotation.y = Math.sin(t * 0.32) * 0.12;
    }
    if (planet.current) planet.current.rotation.y = t * 0.52;
    if (halo.current) halo.current.rotation.z = t * (active ? 0.72 : 0.42);
  });

  return (
    <group ref={group} position={module.position} onClick={(event) => { event.stopPropagation(); onSelect(module.id); }}>
      <mesh ref={planet}>
        <sphereGeometry args={[active ? 0.54 : 0.43, 36, 36]} />
        <meshStandardMaterial color={module.color} emissive={module.emissive} emissiveIntensity={active ? 1.9 : 1.05} roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh ref={halo} rotation={[Math.PI / 2.25, 0, 0]}>
        <torusGeometry args={[active ? 0.92 : 0.74, 0.013, 16, 140]} />
        <meshBasicMaterial color={module.color} transparent opacity={active ? 0.95 : 0.45} />
      </mesh>
      <mesh rotation={[Math.PI / 1.8, 0.2, 0]}>
        <torusGeometry args={[active ? 1.24 : 1.02, 0.004, 12, 120]} />
        <meshBasicMaterial color={module.color} transparent opacity={active ? 0.54 : 0.2} />
      </mesh>
      <Text position={[0, -0.9, 0]} fontSize={0.15} color="#e0f2fe" anchorX="center" anchorY="middle">
        {module.short}
      </Text>

    </group>
  );
}

function EnergyLine({ to, color }: { to: [number, number, number]; color: string }) {
  const points = useMemo(() => [new THREE.Vector3(0, 0, 0), new THREE.Vector3(to[0] * 0.52, to[1] * 0.52, to[2]), new THREE.Vector3(...to)], [to]);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  return (
    <mesh>
      <tubeGeometry args={[curve, 64, 0.008, 8, false]} />
      <meshBasicMaterial color={color} transparent opacity={0.36} />
    </mesh>
  );
}

function OrbitalDust() {
  const group = useRef<THREE.Group>(null);
  const particles = useMemo(() => {
    return Array.from({ length: 56 }, (_, i) => {
      const a = (i / 56) * Math.PI * 2;
      const r = 2.1 + (i % 9) * 0.19;
      return { x: Math.cos(a) * r, z: Math.sin(a) * r * 0.55, y: Math.sin(a * 2.4) * 0.18, s: 0.018 + (i % 5) * 0.005 };
    });
  }, []);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.y = clock.getElapsedTime() * 0.08;
  });
  return (
    <group ref={group} rotation={[0.22, 0, 0]}>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[p.s, 8, 8]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#67e8f9" : i % 3 === 1 ? "#a855f7" : "#ffffff"} transparent opacity={0.72} />
        </mesh>
      ))}
    </group>
  );
}

function UniverseCanvas({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) {
  const active = modules.find((m) => m.id === activeId) ?? modules[0];
  return (
    <Canvas className="!h-screen !w-screen pointer-events-none" style={{ width: "100vw", height: "100vh", pointerEvents: "none" }} camera={{ position: [0, 0.3, 7.25], fov: 48 }} dpr={[1, 1.7]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
      <color attach="background" args={["#02030a"]} />
      <fog attach="fog" args={["#02030a", 7, 16]} />
      <ambientLight intensity={0.36} />
      <pointLight position={[0, 2.5, 4]} intensity={7} color="#67e8f9" />
      <pointLight position={[4, -2, 3]} intensity={3.5} color="#a855f7" />
      <Stars radius={90} depth={55} count={2400} factor={4.2} saturation={0.5} fade speed={0.65} />
      <OrbitalDust />
      <CoreBrain activeColor={active.color} />
      {modules.map((m) => (
        <EnergyLine key={`line-${m.id}`} to={m.position} color={m.color} />
      ))}
      {modules.map((m) => (
        <Planet key={m.id} module={m} active={m.id === activeId} onSelect={onSelect} />
      ))}
      <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.45} autoRotate autoRotateSpeed={0.28} />
    </Canvas>
  );
}

export default function GenesisUniverse() {
  useLenis();
  const [activeId, setActiveId] = useState(modules[0].id);
  const [mentorIndex, setMentorIndex] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);
  const [mouse, setMouse] = useState({ x: 50, y: 40 });
  const active = modules.find((m) => m.id === activeId) ?? modules[0];
  const activeMentor = mentors[mentorIndex];
  const ActiveIcon = iconMap[active.icon];

  const selectModule = (id: string) => {
    setActiveId(id);
    setPanelOpen(true);
  };

  useEffect(() => {
    const move = (e: MouseEvent) => setMouse({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const coursePath = useMemo(
    () => [
      ["01", "AI Foundation", "建立 AI 工具基础、提示词思维与学习地图。"],
      ["02", "AI Builder", "用 AI Coding 做出真实网站、工具与自动化小产品。"],
      ["03", "AI Operator", "建立 Agent 与 Automation，把业务 SOP 交给 AI 执行。"],
      ["04", "AI Growth", "用 AI Marketing 做内容、广告素材、漏斗与获客系统。"],
    ],
    []
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#02030a] text-white selection:bg-cyan-300 selection:text-black">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-90"
        style={{
          background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(56,189,248,.18), transparent 24rem), radial-gradient(circle at 74% 18%, rgba(168,85,247,.16), transparent 26rem), radial-gradient(circle at 20% 78%, rgba(249,115,22,.08), transparent 24rem), linear-gradient(180deg, #02030a 0%, #050816 58%, #02030a 100%)`,
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-cyan-200/10 bg-black/30 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-4 py-3 md:px-6">
          <a href="#top" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border border-cyan-300/40 bg-cyan-300/10 shadow-[0_0_30px_rgba(34,211,238,.35)]">
              <Sparkles className="h-5 w-5 text-cyan-200" />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.22em]">GENESIS</p>
              <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-200/70">AI Universe</p>
            </div>
          </a>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            <a href="#top" className="hover:text-cyan-200">宇宙中控台</a>
            <a href="#path" className="hover:text-cyan-200">课程路线</a>
            <a href="#mentors" className="hover:text-cyan-200">AI 导师</a>
            <a href="#join" className="rounded-full border border-cyan-300/40 px-4 py-2 text-cyan-100 hover:bg-cyan-300/10">预约诊断</a>
          </nav>
        </div>
      </header>

      <section id="top" className="relative z-10 min-h-screen overflow-hidden px-4 pt-20 md:px-8 lg:px-12">
        <div className="fixed inset-0 z-0 h-screen w-screen">
          <UniverseCanvas activeId={activeId} onSelect={selectModule} />
        </div>

        <div className="pointer-events-none absolute inset-0 z-30 grid place-items-center lg:translate-x-4">
          <div className="relative hidden h-[620px] w-[620px] lg:block">
            <div className="absolute inset-0 rounded-full border border-cyan-200/15 shadow-[0_0_120px_rgba(34,211,238,.18)]" />
            <div className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-200/15" />
            <div className="absolute left-1/2 top-1/2 grid h-44 w-44 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-cyan-200/60 bg-cyan-300/10 shadow-[0_0_120px_rgba(34,211,238,.55)] backdrop-blur-md">
              <div className="absolute inset-5 animate-pulse rounded-full bg-cyan-200/25 blur-2xl" />
              <BrainCircuit className="relative h-16 w-16 text-cyan-100" />
            </div>
            {modules.map((m, index) => {
              const Icon = iconMap[m.icon];
              const spots = [
                "left-[6%] top-[30%]",
                "right-[4%] top-[26%]",
                "left-[10%] bottom-[20%]",
                "right-[10%] bottom-[18%]",
              ];
              return (
                <button key={m.id} data-module-id={m.id} onClick={() => selectModule(m.id)} className={`pointer-events-auto absolute ${spots[index]} rounded-[1.4rem] border px-4 py-3 text-left shadow-[0_0_34px_rgba(0,0,0,.4)] backdrop-blur-xl transition hover:scale-105 ${activeId === m.id ? "border-cyan-200/80 bg-cyan-200/15" : "border-white/15 bg-black/45"}`}>
                  <span className="mb-1 flex items-center gap-2 text-sm font-black" style={{ color: m.color }}><Icon className="h-4 w-4" /> {m.label}</span>
                  <span className="block text-[10px] text-slate-300">＋ FOCUS ORBIT</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_0%,transparent_48%,rgba(2,3,10,.58)_82%),linear-gradient(90deg,rgba(2,3,10,.78)_0%,transparent_34%,transparent_63%,rgba(2,3,10,.82)_100%)]" />

        <div className="relative z-10 grid min-h-[calc(100vh-5rem)] items-center gap-8 lg:grid-cols-[0.88fr_1.24fr_0.88fr]">
          <motion.div initial={false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.85 }} className="max-w-xl pt-8 lg:pt-0">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-100 backdrop-blur-xl">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" /> BRIEFING · LIVE · <Clock />
            </div>
            <h1 className="text-5xl font-black leading-[0.92] tracking-tight md:text-7xl xl:text-8xl">
              Genesis AI <span className="bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-blue-400 bg-clip-text text-transparent">Universe</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-slate-300 md:text-xl">
              一个真正的互动式 AI 学习宇宙。探索 AI Coding、AI Agent、AI Automation 与 AI Marketing，把课程变成可视化星系。
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button onClick={() => setPanelOpen(true)} className="group inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-4 font-bold text-black shadow-[0_0_38px_rgba(34,211,238,.35)] transition hover:-translate-y-1 hover:bg-white">
                启动宇宙导览 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
              <a href="#join" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-4 font-semibold text-white backdrop-blur-xl hover:border-cyan-200/60 hover:bg-cyan-200/10">
                预约免费 AI 学习诊断
              </a>
            </div>
          </motion.div>

          <div className="relative hidden min-h-[680px] lg:block">
            <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/10 shadow-[0_0_120px_rgba(34,211,238,.12)]" />
            <div className="absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-purple-200/10" />
          </div>

          <motion.aside initial={false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.85, delay: 0.1 }} className="relative z-40 rounded-[2rem] border border-cyan-200/15 bg-black/45 p-5 shadow-[0_0_60px_rgba(34,211,238,.1)] backdrop-blur-2xl">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.34em] text-cyan-200">MISSION CONTROL</p>
                <h2 className="mt-2 text-2xl font-black">宇宙中控台</h2>
              </div>
              <button onClick={() => selectModule("coding")} className="rounded-full border border-white/10 bg-white/5 p-3 text-slate-300 hover:text-cyan-100">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {modules.map((m) => {
                const Icon = iconMap[m.icon];
                const selected = activeId === m.id;
                return (
                  <button
                    key={m.id}
                    data-module-id={m.id}
                    onClick={() => selectModule(m.id)}
                    className={`group flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition hover:-translate-y-1 ${selected ? "border-cyan-200/70 bg-cyan-200/15 shadow-[0_0_32px_rgba(34,211,238,.18)]" : "border-white/10 bg-white/[.04] hover:border-white/25"}`}
                  >
                    <span className="grid h-11 w-11 place-items-center rounded-2xl" style={{ backgroundColor: `${m.color}22`, color: m.color }}><Icon className="h-5 w-5" /></span>
                    <span>
                      <span className="block font-bold text-white">{m.label}</span>
                      <span className="block text-xs text-slate-400">＋ click to focus orbit</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.aside>
        </div>

        <div className="absolute bottom-5 left-1/2 z-20 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-100 backdrop-blur-xl md:flex">
          <Radar className="h-4 w-4" /> Move mouse · auto-rotate universe · click HUD planets
        </div>
      </section>

      <AnimatePresence>
        {panelOpen && (
          <motion.aside initial={false} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 34 }} className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-md rounded-[2rem] border border-white/15 bg-black/75 p-5 shadow-2xl shadow-cyan-950/40 backdrop-blur-2xl md:bottom-8 md:left-8 md:right-auto">
            <button onClick={() => setPanelOpen(false)} className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ backgroundColor: `${active.color}22`, color: active.color }}><ActiveIcon /></div>
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-200">Selected Galaxy</p>
                <h3 id="selected-galaxy-title" className="text-2xl font-black">{active.title}</h3>
              </div>
            </div>
            <p id="selected-galaxy-description" className="leading-7 text-slate-300">{active.description}</p>
            <div id="selected-galaxy-bullets" className="mt-5 space-y-3">
              {active.bullets.map((b) => <div key={b} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm text-slate-200"><Zap className="h-4 w-4 text-cyan-200" />{b}</div>)}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <section id="path" className="relative z-10 mx-auto max-w-7xl px-4 py-24 md:px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.32em] text-cyan-200">Academy Route</p>
            <h2 className="text-4xl font-black md:text-6xl">Genesis 学习路线图</h2>
          </div>
          <p className="max-w-xl text-slate-300">从 AI 基础，到真实产品、Agent、自动化与营销系统，形成完整 AI 业务能力。</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {coursePath.map(([n, title, text]) => (
            <div key={n} className="group rounded-[2rem] border border-white/10 bg-white/[.045] p-6 backdrop-blur-xl transition hover:-translate-y-2 hover:border-cyan-200/40 hover:bg-cyan-200/10">
              <p className="text-6xl font-black text-white/10">{n}</p>
              <h3 className="mt-4 text-xl font-bold">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="mentors" className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 py-20 md:grid-cols-[.85fr_1.15fr] md:px-6">
        <div>
          <p className="mb-3 text-sm uppercase tracking-[0.32em] text-purple-200">AI Mentor Council</p>
          <h2 className="text-4xl font-black md:text-6xl">AI 导师中控室</h2>
          <p className="mt-5 text-lg leading-8 text-slate-300">不是零散课程，而是一组 AI 导师带你完成从学习、实作、自动化到营销变现的完整路线。</p>
        </div>
        <div className="rounded-[2.2rem] border border-white/10 bg-white/[.045] p-5 backdrop-blur-xl">
          <div className="grid gap-3 sm:grid-cols-5">
            {mentors.map((m, i) => (
              <button key={m.name} data-mentor-index={i} onClick={() => setMentorIndex(i)} className={`rounded-3xl border p-4 transition ${i === mentorIndex ? "border-purple-200/60 bg-purple-300/10" : "border-white/10 bg-black/20 hover:bg-white/10"}`}>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-300/30 to-purple-400/30 text-xl font-black">{m.avatar}</div>
                <p className="mt-3 text-sm font-bold">{m.name}</p>
              </button>
            ))}
          </div>
          <div className="mt-5 rounded-[1.7rem] border border-white/10 bg-black/35 p-6">
            <p id="selected-mentor-role" className="text-sm uppercase tracking-[0.28em] text-purple-200">{activeMentor.role}</p>
            <h3 id="selected-mentor-name" className="mt-2 text-3xl font-black">{activeMentor.name}</h3>
            <p id="selected-mentor-description" className="mt-4 text-lg leading-8 text-slate-300">{activeMentor.description}</p>
            <div id="selected-mentor-focus" className="mt-5 flex flex-wrap gap-2">{activeMentor.focus.map((f) => <span key={f} className="rounded-full border border-purple-200/20 bg-purple-200/10 px-3 py-1 text-sm text-purple-100">{f}</span>)}</div>
          </div>
        </div>
      </section>

      <section id="join" className="relative z-10 px-4 py-24 md:px-6">
        <div className="mx-auto max-w-5xl rounded-[2.6rem] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,.28),transparent_35%),radial-gradient(circle_at_70%_30%,rgba(168,85,247,.24),transparent_38%),rgba(255,255,255,.055)] p-8 text-center shadow-[0_0_80px_rgba(34,211,238,.12)] backdrop-blur-xl md:p-14">
          <BrainCircuit className="mx-auto mb-5 h-12 w-12 text-cyan-200" />
          <h2 className="text-4xl font-black md:text-6xl">准备进入 Genesis AI Universe？</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">下一步可以把这里接到 Google Form、Calendly、WhatsApp、Telegram、课程付款页，或你的自动化报名系统。</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a href="mailto:hello@genesis-ai-universe.com?subject=预约 Genesis AI 学习诊断" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-black text-black transition hover:-translate-y-1 hover:bg-cyan-200"><Rocket className="h-4 w-4" /> 预约免费 AI 学习诊断</a>
            <a href="#top" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-7 py-4 font-bold text-white hover:bg-white/10"><Orbit className="h-4 w-4" /> 回到宇宙中控台</a>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-4 py-8 text-center text-sm text-slate-400">
        © 2026 Genesis AI Universe · AI Coding · AI Agents · AI Automation · AI Marketing
      </footer>
    </main>
  );
}
