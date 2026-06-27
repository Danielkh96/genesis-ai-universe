"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, BrainCircuit, Code2, ExternalLink, Megaphone, RefreshCcw, RotateCcw, Satellite, Sparkles, Workflow, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type AgentId = "automation" | "marketing" | "agent" | "coding";

type Agent = {
  id: AgentId;
  name: string;
  short: string;
  role: string;
  color: string;
  glow: string;
  icon: typeof Workflow;
  position: { x: number; y: number };
  url: string;
  description: string;
};

type NavPlanet = {
  id: string;
  label: string;
  sub: string;
  color: string;
  position: { x: number; y: number };
  url: string;
};

const agents: Agent[] = [
  {
    id: "automation",
    name: "AI Automation",
    short: "AUTO",
    role: "自动化流程星系",
    color: "#22d3ee",
    glow: "rgba(34,211,238,.78)",
    icon: Workflow,
    position: { x: 23, y: 28 },
    url: "#ai-automation",
    description: "表格、API、社群、CRM 与 OpenClaw 工作流自动连接。",
  },
  {
    id: "marketing",
    name: "AI Marketing",
    short: "MKT",
    role: "增长营销星系",
    color: "#f472b6",
    glow: "rgba(244,114,182,.76)",
    icon: Megaphone,
    position: { x: 74, y: 29 },
    url: "#ai-marketing",
    description: "爆款 Hook、广告图、内容矩阵、短影音脚本与营销漏斗。",
  },
  {
    id: "agent",
    name: "AI Agent",
    short: "AGENT",
    role: "智能代理星系",
    color: "#a78bfa",
    glow: "rgba(167,139,250,.78)",
    icon: Bot,
    position: { x: 74, y: 72 },
    url: "#ai-agent",
    description: "让 AI 会思考、调用工具、拆任务，并成为业务执行助手。",
  },
  {
    id: "coding",
    name: "AI Coding",
    short: "CODE",
    role: "产品构建星系",
    color: "#fbbf24",
    glow: "rgba(251,191,36,.76)",
    icon: Code2,
    position: { x: 25, y: 72 },
    url: "#ai-coding",
    description: "用 AI 建网站、工具、App、自动化系统，并部署上线。",
  },
];

const navPlanets: NavPlanet[] = [
  { id: "academy", label: "Academy", sub: "课程入口", color: "#38bdf8", position: { x: 14, y: 44 }, url: "#academy" },
  { id: "projects", label: "Projects", sub: "实战作品", color: "#c084fc", position: { x: 86, y: 44 }, url: "#projects" },
  { id: "templates", label: "Templates", sub: "模板库", color: "#34d399", position: { x: 16, y: 60 }, url: "#templates" },
  { id: "community", label: "Community", sub: "学习社群", color: "#fb7185", position: { x: 84, y: 60 }, url: "#community" },
  { id: "roadmap", label: "Roadmap", sub: "路线图", color: "#60a5fa", position: { x: 38, y: 14 }, url: "#roadmap" },
  { id: "diagnosis", label: "Diagnosis", sub: "AI 诊断", color: "#f97316", position: { x: 62, y: 14 }, url: "#diagnosis" },
  { id: "vault", label: "Vault", sub: "资源库", color: "#2dd4bf", position: { x: 39, y: 88 }, url: "#vault" },
  { id: "launch", label: "Launch", sub: "上线部署", color: "#e879f9", position: { x: 61, y: 88 }, url: "#launch" },
];

const allNodes = [...agents, ...navPlanets];

function Clock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return <span>{time}</span>;
}

function CentralBrain3D({ color }: { color: string }) {
  const brain = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (brain.current) {
      brain.current.rotation.y = t * 0.22;
      brain.current.rotation.x = Math.sin(t * 0.45) * 0.12;
    }
    if (shell.current) shell.current.scale.setScalar(1 + Math.sin(t * 2.4) * 0.035);
    if (ring.current) ring.current.rotation.z = t * 0.45;
  });

  return (
    <group ref={brain}>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.85, 4]} />
        <meshStandardMaterial color="#dffcff" emissive={color} emissiveIntensity={2.2} roughness={0.05} metalness={0.3} transparent opacity={0.78} wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.55, 64, 64]} />
        <meshStandardMaterial color="#f8ffff" emissive="#67e8f9" emissiveIntensity={2.8} roughness={0.15} metalness={0.28} transparent opacity={0.72} />
      </mesh>
      <mesh rotation={[0.45, 0.2, 0.1]}>
        <torusGeometry args={[2.25, 0.018, 16, 220]} />
        <meshBasicMaterial color="#67e8f9" transparent opacity={0.82} />
      </mesh>
      <mesh ref={ring} rotation={[1.2, 0.3, 0.6]}>
        <torusGeometry args={[2.8, 0.01, 16, 240]} />
        <meshBasicMaterial color="#c084fc" transparent opacity={0.38} />
      </mesh>
      <pointLight color={color} intensity={10} distance={10} />
    </group>
  );
}

function AgentPlanet3D({ agent, index, active }: { agent: Agent; index: number; active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const planet = useRef<THREE.Mesh>(null);
  const angle = (index / agents.length) * Math.PI * 2 + Math.PI * 0.2;
  const radius = 4.05;
  const pos: [number, number, number] = [Math.cos(angle) * radius, Math.sin(angle) * 2.35, Math.sin(angle) * 0.7];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) group.current.position.y = pos[1] + Math.sin(t * 1.2 + index) * 0.15;
    if (planet.current) planet.current.rotation.y = t * 0.7;
  });

  return (
    <group ref={group} position={pos}>
      <mesh ref={planet}>
        <sphereGeometry args={[active ? 0.36 : 0.29, 36, 36]} />
        <meshStandardMaterial color={agent.color} emissive={agent.color} emissiveIntensity={active ? 2.4 : 1.25} metalness={0.5} roughness={0.22} />
      </mesh>
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[active ? 0.72 : 0.58, 0.01, 16, 120]} />
        <meshBasicMaterial color={agent.color} transparent opacity={active ? 0.95 : 0.45} />
      </mesh>
      <Text position={[0, -0.64, 0]} fontSize={0.13} color="#effcff" anchorX="center" anchorY="middle">
        {agent.short}
      </Text>
    </group>
  );
}

function SignalBars() {
  const group = useRef<THREE.Group>(null);
  const bars = useMemo(() => Array.from({ length: 30 }, (_, i) => ({ angle: (i / 30) * Math.PI * 2, h: 0.35 + (i % 7) * 0.18, r: 3.05 + (i % 5) * 0.12 })), []);
  useFrame(({ clock }) => {
    if (group.current) group.current.rotation.z = clock.getElapsedTime() * 0.08;
  });
  return (
    <group ref={group} rotation={[0.2, 0, 0]}>
      {bars.map((bar, i) => (
        <mesh key={i} position={[Math.cos(bar.angle) * bar.r, Math.sin(bar.angle) * bar.r * 0.58, 0]} rotation={[0, 0, bar.angle]}>
          <boxGeometry args={[0.035, bar.h, 0.055]} />
          <meshBasicMaterial color={i % 3 === 0 ? "#dffbff" : i % 3 === 1 ? "#67e8f9" : "#a78bfa"} transparent opacity={0.82} />
        </mesh>
      ))}
    </group>
  );
}

function UniverseCanvas({ active }: { active: Agent }) {
  return (
    <Canvas className="portal-canvas" camera={{ position: [0, 0.1, 7.2], fov: 46 }} dpr={[1, 1.55]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
      <color attach="background" args={["#02030a"]} />
      <fog attach="fog" args={["#02030a", 7, 15]} />
      <ambientLight intensity={0.34} />
      <pointLight position={[0, 3, 4]} intensity={7} color="#67e8f9" />
      <pointLight position={[4, -2, 3]} intensity={4} color="#a78bfa" />
      <Stars radius={88} depth={54} count={2600} factor={4.2} saturation={0.6} fade speed={0.8} />
      <SignalBars />
      <CentralBrain3D color={active.color} />
      {agents.map((agent, i) => <AgentPlanet3D key={agent.id} agent={agent} index={i} active={active.id === agent.id} />)}
      <OrbitControls enablePan={false} enableZoom={false} rotateSpeed={0.28} autoRotate autoRotateSpeed={0.22} />
    </Canvas>
  );
}

function NetworkLines() {
  const center = { x: 50, y: 50 };
  return (
    <svg className="portal-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id="lineGlow">
          <feGaussianBlur stdDeviation="0.45" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {allNodes.map((node) => (
        <line key={node.id} x1={center.x} y1={center.y} x2={node.position.x} y2={node.position.y} stroke={(node as Agent).color ?? (node as NavPlanet).color} strokeWidth="0.13" opacity="0.72" filter="url(#lineGlow)" />
      ))}
      {navPlanets.map((node, i) => {
        const next = navPlanets[(i + 1) % navPlanets.length];
        return <line key={`${node.id}-${next.id}`} x1={node.position.x} y1={node.position.y} x2={next.position.x} y2={next.position.y} stroke="#38bdf8" strokeWidth="0.07" opacity="0.35" filter="url(#lineGlow)" />;
      })}
    </svg>
  );
}

export default function GenesisUniverse() {
  const [activeId, setActiveId] = useState<AgentId>("automation");
  const [webglReady, setWebglReady] = useState(false);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const active = agents.find((agent) => agent.id === activeId) ?? agents[0];
  const ActiveIcon = active.icon;

  useEffect(() => {
    const move = (event: MouseEvent) => setMouse({ x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100 });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isAutomation = navigator.webdriver || userAgent.includes("headless") || userAgent.includes("playwright");
    if (isAutomation) return;

    const id = window.setTimeout(() => {
      const testCanvas = document.createElement("canvas");
      const gl = testCanvas.getContext("webgl2") || testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
      setWebglReady(Boolean(gl));
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <main className="portal-shell" style={{ ["--mx" as string]: `${mouse.x}%`, ["--my" as string]: `${mouse.y}%`, ["--active" as string]: active.color }}>
      <div className="portrait-guard">
        <RotateCcw className="h-12 w-12 text-cyan-200" />
        <h1>请横屏进入 Genesis AI Universe</h1>
        <p>这个界面是横屏游戏式星系传送门，旋转手机后可看到完整中心大脑、Agent 星球和导航行星。</p>
      </div>

      <div className="portal-bg" />
      {webglReady && <UniverseCanvas active={active} />}
      <NetworkLines />

      <header className="portal-briefing">
        <span className="live-dot" />
        <strong>BRIEFING · LIVE</strong>
        <span className="separator">|</span>
        <Clock />
        <span className="separator">|</span>
        <span>GENESIS AI UNIVERSE · 传送门在线</span>
      </header>

      <nav className="side-console" aria-label="Universe navigation">
        <button onClick={() => setActiveId("automation")} className="console-btn reset"><RefreshCcw className="h-4 w-4" /> 重置</button>
        {agents.map((agent) => (
          <button key={agent.id} onClick={() => setActiveId(agent.id)} className={`console-btn ${activeId === agent.id ? "active" : ""}`} style={{ ["--node" as string]: agent.color }}>
            {agent.name.replace("AI ", "")}
          </button>
        ))}
        <a className="console-btn portal-link" href="#academy">Academy</a>
        <a className="console-btn portal-link" href="#diagnosis">诊断</a>
      </nav>

      <section className="galaxy-stage" aria-label="Genesis AI Universe portal">
        <div className="orbit-ring orbit-ring-1" />
        <div className="orbit-ring orbit-ring-2" />
        <div className="orbit-ring orbit-ring-3" />
        <motion.button
          className="central-brain"
          aria-label="Genesis central AI brain"
          initial={false}
          animate={{ boxShadow: `0 0 70px ${active.glow}, 0 0 190px rgba(103,232,249,.55)` }}
          transition={{ duration: 0.35 }}
        >
          <span className="brain-mesh" />
          <span className="brain-core-glow" />
          <BrainCircuit className="brain-icon" />
          <span className="brain-label">GENESIS<br />CORE</span>
        </motion.button>

        {agents.map((agent) => {
          const Icon = agent.icon;
          const selected = activeId === agent.id;
          return (
            <button
              key={agent.id}
              data-module-id={agent.id}
              onClick={() => setActiveId(agent.id)}
              className={`agent-planet ${selected ? "selected" : ""}`}
              style={{ left: `${agent.position.x}%`, top: `${agent.position.y}%`, ["--node" as string]: agent.color, ["--node-glow" as string]: agent.glow }}
            >
              <span className="planet-orbit" />
              <span className="planet-body"><Icon className="h-7 w-7" /></span>
              <span className="planet-label"><strong>{agent.name}</strong><em>{agent.role}</em></span>
            </button>
          );
        })}

        {navPlanets.map((planet, index) => (
          <a
            key={planet.id}
            className="nav-asteroid"
            href={planet.url}
            style={{ left: `${planet.position.x}%`, top: `${planet.position.y}%`, ["--node" as string]: planet.color, animationDelay: `${index * -0.4}s` }}
          >
            <span className="asteroid-dot" />
            <span className="asteroid-card"><strong>{planet.label}</strong><em>{planet.sub}</em></span>
          </a>
        ))}

        <div className="data-block data-block-a">AI ROUTE<br /><span>LEARNING MAP</span></div>
        <div className="data-block data-block-b">DEPLOY<br /><span>VERCEL / GITHUB</span></div>
        <div className="data-block data-block-c">TOOLS<br /><span>AGENT OS</span></div>
        <div className="light-beam beam-a" />
        <div className="light-beam beam-b" />
      </section>

      <AnimatePresence mode="wait">
        <motion.aside
          key={active.id}
          className="agent-dossier"
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.24 }}
        >
          <div className="dossier-icon" style={{ color: active.color, background: `${active.color}22` }}><ActiveIcon /></div>
          <div>
            <p>SELECTED AGENT</p>
            <h2 id="selected-galaxy-title">{active.name}</h2>
            <span>{active.role}</span>
          </div>
          <p id="selected-galaxy-description" className="dossier-desc">{active.description}</p>
          <a href={active.url} className="dossier-link">进入这个星球 <ExternalLink className="h-4 w-4" /></a>
        </motion.aside>
      </AnimatePresence>

      <footer className="agent-dock" aria-label="Agent selector">
        {agents.map((agent) => (
          <button key={agent.id} onClick={() => setActiveId(agent.id)} className={activeId === agent.id ? "active" : ""} style={{ ["--node" as string]: agent.color }}>
            {agent.name}
          </button>
        ))}
      </footer>

      <div className="scanline" />
      <div className="corner-hud corner-a"><Sparkles className="h-4 w-4" /> SYSTEM ONLINE</div>
      <div className="corner-hud corner-b"><Satellite className="h-4 w-4" /> NAV NODES: 12</div>
      <div className="corner-hud corner-c"><Zap className="h-4 w-4" /> ENERGY LINKED</div>
    </main>
  );
}
