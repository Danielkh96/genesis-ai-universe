"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars, Text } from "@react-three/drei";
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
  position: [number, number, number];
  hud: { x: number; y: number };
  url: string;
  description: string;
};

type NavPlanet = {
  id: string;
  label: string;
  sub: string;
  color: string;
  hud: { x: number; y: number };
  url: string;
};

type CameraView = {
  id: "core" | AgentId;
  target: [number, number, number];
  camera: [number, number, number];
  label: string;
  eyebrow: string;
  text: string;
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
    position: [-4.9, 2.45, -0.6],
    hud: { x: 23, y: 28 },
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
    position: [4.9, 2.3, -0.8],
    hud: { x: 74, y: 29 },
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
    position: [4.65, -2.55, -0.4],
    hud: { x: 74, y: 72 },
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
    position: [-4.65, -2.6, -0.7],
    hud: { x: 25, y: 72 },
    url: "#ai-coding",
    description: "用 AI 建网站、工具、App、自动化系统，并部署上线。",
  },
];

const navPlanets: NavPlanet[] = [
  { id: "academy", label: "Academy", sub: "课程入口", color: "#38bdf8", hud: { x: 14, y: 44 }, url: "#academy" },
  { id: "projects", label: "Projects", sub: "实战作品", color: "#c084fc", hud: { x: 86, y: 44 }, url: "#projects" },
  { id: "templates", label: "Templates", sub: "模板库", color: "#34d399", hud: { x: 16, y: 60 }, url: "#templates" },
  { id: "community", label: "Community", sub: "学习社群", color: "#fb7185", hud: { x: 84, y: 60 }, url: "#community" },
  { id: "roadmap", label: "Roadmap", sub: "路线图", color: "#60a5fa", hud: { x: 38, y: 14 }, url: "#roadmap" },
  { id: "diagnosis", label: "Diagnosis", sub: "AI 诊断", color: "#f97316", hud: { x: 62, y: 14 }, url: "#diagnosis" },
  { id: "vault", label: "Vault", sub: "资源库", color: "#2dd4bf", hud: { x: 39, y: 88 }, url: "#vault" },
  { id: "launch", label: "Launch", sub: "上线部署", color: "#e879f9", hud: { x: 61, y: 88 }, url: "#launch" },
];

const cameraViews: CameraView[] = [
  { id: "core", target: [0, 0, 0], camera: [0, 0.1, 8.0], label: "Genesis Core", eyebrow: "SECTION 00 · CENTRAL BRAIN", text: "从中心大脑进入浩瀚 AI 宇宙，所有 Agent 星球都围绕核心轨道运转。" },
  { id: "automation", target: [-0.55, 0.35, 0], camera: [-1.75, 0.95, 3.05], label: "AI Automation", eyebrow: "SECTION 01 · ORBITAL WORKFLOW", text: "镜头贴近中心大脑，自动化星球在轨道侧翼发光连接。" },
  { id: "marketing", target: [0.55, 0.32, 0], camera: [1.75, 0.9, 3.0], label: "AI Marketing", eyebrow: "SECTION 02 · GROWTH NEBULA", text: "镜头贴近中心大脑，营销星球在右侧轨道发光连接。" },
  { id: "agent", target: [0.52, -0.32, 0], camera: [1.6, -0.95, 2.82], label: "AI Agent", eyebrow: "SECTION 03 · AGENT CLUSTER", text: "镜头贴近中心大脑，Agent 星群像神经节点一样接入核心。" },
  { id: "coding", target: [-0.52, -0.35, 0], camera: [-1.6, -1.0, 2.82], label: "AI Coding", eyebrow: "SECTION 04 · BUILD PORTAL", text: "镜头贴近中心大脑，Coding 星球连接到构建传送门。" },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpVec(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

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

function CameraRig({ cameraPosition, target, progress, userZoom, dragOffset }: { cameraPosition: [number, number, number]; target: [number, number, number]; progress: number; userZoom: number; dragOffset: { x: number; y: number } }) {
  const targetVec = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    const driftX = Math.sin(t * 0.18 + progress * 6) * 0.12;
    const driftY = Math.cos(t * 0.21 + progress * 4) * 0.08;
    const panX = dragOffset.x * 1.15;
    const panY = dragOffset.y * 0.85;
    targetVec.set(target[0] + panX * 0.45, target[1] + panY * 0.45, target[2]);
    const base = new THREE.Vector3(cameraPosition[0] + driftX + panX, cameraPosition[1] + driftY + panY, cameraPosition[2]);
    const direction = base.clone().sub(targetVec);
    const zoomed = targetVec.clone().add(direction.multiplyScalar(1 / userZoom));
    camera.position.lerp(zoomed, 0.085);
    camera.lookAt(targetVec);
  });
  return null;
}

function CentralBrain3D({ color }: { color: string }) {
  const brain = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const plasma = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (brain.current) {
      brain.current.rotation.y = t * 0.16;
      brain.current.rotation.x = Math.sin(t * 0.38) * 0.1;
    }
    if (shell.current) shell.current.scale.setScalar(1 + Math.sin(t * 2.25) * 0.045);
    if (plasma.current) plasma.current.rotation.z = -t * 0.32;
  });

  return (
    <group ref={brain}>
      <mesh ref={plasma}>
        <sphereGeometry args={[1.95, 64, 64]} />
        <meshBasicMaterial color="#efffff" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.82, 4]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={3.0} roughness={0.04} metalness={0.22} transparent opacity={0.72} wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.34, 64, 64]} />
        <meshStandardMaterial color="#f8ffff" emissive="#eaffff" emissiveIntensity={3.0} roughness={0.08} metalness={0.18} transparent opacity={0.34} />
      </mesh>
      {[2.35, 3.05].map((radius, i) => (
        <mesh key={radius} rotation={[0.55 + i * 0.3, 0.2 + i * 0.2, i * 0.65]}>
          <torusGeometry args={[radius, 0.012, 16, 220]} />
          <meshBasicMaterial color={i === 1 ? "#c084fc" : "#67e8f9"} transparent opacity={0.5 - i * 0.08} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      <pointLight color="#ffffff" intensity={7} distance={9} />
      <pointLight color={color} intensity={9} distance={10} />
    </group>
  );
}

function AgentPlanet3D({ agent, active }: { agent: Agent; active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const planet = useRef<THREE.Mesh>(null);
  const base = useMemo(() => new THREE.Vector3(...agent.position), [agent.position]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (group.current) {
      group.current.position.set(base.x + Math.sin(t * 0.42 + base.y) * 0.28, base.y + Math.cos(t * 0.5 + base.x) * 0.18, base.z + Math.sin(t * 0.35) * 0.22);
      group.current.rotation.y = t * 0.15;
    }
    if (planet.current) planet.current.rotation.y = t * 0.7;
  });

  return (
    <group ref={group} position={agent.position}>
      <mesh ref={planet}>
        <sphereGeometry args={[active ? 0.5 : 0.38, 48, 48]} />
        <meshStandardMaterial color={agent.color} emissive={agent.color} emissiveIntensity={active ? 3.2 : 1.55} metalness={0.55} roughness={0.18} />
      </mesh>
      <mesh rotation={[Math.PI / 2.1, 0, 0]}>
        <torusGeometry args={[active ? 0.9 : 0.72, 0.012, 18, 140]} />
        <meshBasicMaterial color={agent.color} transparent opacity={active ? 0.95 : 0.48} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[0.7, 0.35, 0.2]}>
        <torusGeometry args={[active ? 1.25 : 1.0, 0.006, 18, 160]} />
        <meshBasicMaterial color={agent.color} transparent opacity={active ? 0.55 : 0.25} blending={THREE.AdditiveBlending} />
      </mesh>
      <pointLight color={agent.color} intensity={active ? 5 : 2.5} distance={4} />
      <Text position={[0, -0.8, 0]} fontSize={active ? 0.18 : 0.14} color="#eaffff" anchorX="center" anchorY="middle">
        {agent.short}
      </Text>
    </group>
  );
}

function EnergyTube({ to, color }: { to: [number, number, number]; color: string }) {
  const curve = useMemo(() => {
    const end = new THREE.Vector3(...to);
    const mid = end.clone().multiplyScalar(0.45);
    mid.z += 0.7;
    return new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), mid, end]);
  }, [to]);
  return (
    <mesh>
      <tubeGeometry args={[curve, 80, 0.012, 8, false]} />
      <meshBasicMaterial color={color} transparent opacity={0.42} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

function SatelliteModules() {
  const group = useRef<THREE.Group>(null);
  const modules = useMemo(() => Array.from({ length: 42 }, (_, i) => {
    const angle = (i / 42) * Math.PI * 2;
    const radius = 2.15 + (i % 11) * 0.28;
    return {
      position: [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.58, Math.sin(angle * 1.7) * 1.2] as [number, number, number],
      rotation: [Math.sin(angle) * 1.2, angle, Math.cos(angle) * 0.8] as [number, number, number],
      scale: [0.045 + (i % 4) * 0.012, 0.34 + (i % 6) * 0.12, 0.045] as [number, number, number],
      color: i % 4 === 0 ? "#ffffff" : i % 4 === 1 ? "#67e8f9" : i % 4 === 2 ? "#a78bfa" : "#f472b6",
    };
  }), []);
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.z = clock.getElapsedTime() * 0.045;
      group.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.18;
    }
  });
  return (
    <group ref={group}>
      {modules.map((m, i) => (
        <mesh key={i} position={m.position} rotation={m.rotation} scale={m.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={m.color} transparent opacity={0.34} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

function NetworkNodes() {
  const group = useRef<THREE.Group>(null);
  const nodes = useMemo(() => Array.from({ length: 88 }, (_, i) => {
    const angle = (i * 2.399963) % (Math.PI * 2);
    const radius = 3.0 + ((i * 17) % 100) / 100 * 4.8;
    const y = Math.sin(i * 1.37) * 2.9;
    return {
      p: new THREE.Vector3(Math.cos(angle) * radius, y, Math.sin(angle) * radius * 0.65 - 1.4),
      s: 0.018 + (i % 5) * 0.008,
      color: i % 5 === 0 ? "#fb7185" : i % 5 === 1 ? "#fbbf24" : i % 5 === 2 ? "#a78bfa" : "#67e8f9",
    };
  }), []);
  const linePositions = useMemo(() => {
    const values: number[] = [];
    nodes.forEach((node, i) => {
      const next = nodes[(i + 13) % nodes.length];
      const next2 = nodes[(i + 37) % nodes.length];
      if (node.p.distanceTo(next.p) < 5.4 || i % 4 === 0) values.push(node.p.x, node.p.y, node.p.z, next.p.x, next.p.y, next.p.z);
      if (i % 9 === 0 && node.p.distanceTo(next2.p) < 6.8) values.push(node.p.x, node.p.y, node.p.z, next2.p.x, next2.p.y, next2.p.z);
    });
    return new Float32Array(values);
  }, [nodes]);

  useFrame(({ clock }) => {
    if (group.current) {
      group.current.rotation.y = clock.getElapsedTime() * 0.025;
      group.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.1) * 0.06;
    }
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#67e8f9" transparent opacity={0.055} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.p}>
          <sphereGeometry args={[node.s, 8, 8]} />
          <meshBasicMaterial color={node.color} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

function UniverseCanvas({ active, cameraPosition, target, progress, userZoom, dragOffset }: { active: Agent; cameraPosition: [number, number, number]; target: [number, number, number]; progress: number; userZoom: number; dragOffset: { x: number; y: number } }) {
  return (
    <Canvas className="portal-canvas" camera={{ position: [0, 0.1, 8.0], fov: 44 }} dpr={[1, 1.7]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}>
      <color attach="background" args={["#02030a"]} />
      <fog attach="fog" args={["#02030a", 8, 20]} />
      <CameraRig cameraPosition={cameraPosition} target={target} progress={progress} userZoom={userZoom} dragOffset={dragOffset} />
      <ambientLight intensity={0.22} />
      <pointLight position={[0, 3, 5]} intensity={8} color="#eaffff" />
      <pointLight position={[-5, 3, 2]} intensity={4} color="#67e8f9" />
      <pointLight position={[5, -3, 2]} intensity={4} color="#a78bfa" />
      <Stars radius={120} depth={70} count={1800} factor={4.8} saturation={0.7} fade speed={0.85} />
      <NetworkNodes />
      <SatelliteModules />
      <CentralBrain3D color={active.color} />
      {agents.map((agent) => <EnergyTube key={`line-${agent.id}`} to={agent.position} color={agent.color} />)}
      {agents.map((agent) => <AgentPlanet3D key={agent.id} agent={agent} active={active.id === agent.id} />)}
    </Canvas>
  );
}

function ClockworkFallbackLines() {
  return (
    <svg className="portal-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id="lineGlow">
          <feGaussianBlur stdDeviation="0.45" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {agents.map((node) => <line key={node.id} x1="50" y1="50" x2={node.hud.x} y2={node.hud.y} stroke={node.color} strokeWidth="0.13" opacity="0.56" filter="url(#lineGlow)" />)}
    </svg>
  );
}

export default function GenesisUniverse() {
  const [activeId, setActiveId] = useState<AgentId>("automation");
  const [webglReady, setWebglReady] = useState(false);
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const [camera, setCamera] = useState({ target: cameraViews[0].target, cameraPosition: cameraViews[0].camera, progress: 0, viewIndex: 0 });
  const [burst, setBurst] = useState(cameraViews[0]);
  const progressRef = useRef(0);
  const [userZoom, setUserZoom] = useState(1);
  const zoomRef = useRef(1);
  const pinchStartRef = useRef<{ distance: number; zoom: number } | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const lastTouchRef = useRef({ x: 0, y: 0 });
  const [touchGlow, setTouchGlow] = useState({ x: 50, y: 50, active: false });
  const active = agents.find((agent) => agent.id === activeId) ?? agents[0];
  const ActiveIcon = active.icon;
  const currentView = cameraViews[camera.viewIndex] ?? cameraViews[0];

  const applyCameraProgress = (raw: number) => {
    const clamped = Math.min(1, Math.max(0, raw));
    progressRef.current = clamped;
    const scaled = clamped * (cameraViews.length - 1);
    const index = Math.min(cameraViews.length - 2, Math.floor(scaled));
    const local = scaled - index;
    const eased = local * local * (3 - 2 * local);
    const from = cameraViews[index];
    const to = cameraViews[index + 1] ?? from;
    const nearest = Math.min(cameraViews.length - 1, Math.round(scaled));
    const target = lerpVec(from.target, to.target, eased);
    const cameraPosition = lerpVec(from.camera, to.camera, eased);
    setCamera({ target, cameraPosition, progress: clamped, viewIndex: nearest });
    const focus = cameraViews[nearest];
    if (focus) setBurst(focus);
    if (focus?.id && focus.id !== "core") setActiveId(focus.id);
  };

  const scrollToView = (id: "core" | AgentId) => {
    const index = Math.max(0, cameraViews.findIndex((view) => view.id === id));
    applyCameraProgress(index / (cameraViews.length - 1));
    const view = cameraViews[index] ?? cameraViews[0];
    setBurst(view);
    if (id !== "core") setActiveId(id);
  };

  useEffect(() => {
    const move = (event: MouseEvent) => setMouse({ x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100 });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    let frame = 0;
    let inertiaFrame = 0;
    let touchY = 0;
    let pointerDown = false;
    const schedule = (next: number) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => applyCameraProgress(next));
    };
    const setDrag = (next: { x: number; y: number }) => {
      const clamped = {
        x: Math.max(-1.35, Math.min(1.35, next.x)),
        y: Math.max(-0.95, Math.min(0.95, next.y)),
      };
      dragRef.current = clamped;
      setDragOffset(clamped);
    };
    const startInertia = () => {
      cancelAnimationFrame(inertiaFrame);
      const tick = () => {
        velocityRef.current.x *= 0.92;
        velocityRef.current.y *= 0.92;
        const next = {
          x: dragRef.current.x + velocityRef.current.x,
          y: dragRef.current.y + velocityRef.current.y,
        };
        setDrag(next);
        if (Math.abs(velocityRef.current.x) > 0.002 || Math.abs(velocityRef.current.y) > 0.002) {
          inertiaFrame = requestAnimationFrame(tick);
        }
      };
      inertiaFrame = requestAnimationFrame(tick);
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      schedule(progressRef.current + event.deltaY / 5600);
      setDrag({ x: dragRef.current.x - event.deltaX / 900, y: dragRef.current.y - event.deltaY / 2600 });
      velocityRef.current = { x: -event.deltaX / 42000, y: -event.deltaY / 70000 };
      startInertia();
    };
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowDown", "PageDown", " "].includes(event.key)) { event.preventDefault(); schedule(progressRef.current + 1 / (cameraViews.length - 1)); }
      if (["ArrowUp", "PageUp"].includes(event.key)) { event.preventDefault(); schedule(progressRef.current - 1 / (cameraViews.length - 1)); }
      if (event.key === "Home") { event.preventDefault(); schedule(0); }
      if (event.key === "End") { event.preventDefault(); schedule(1); }
    };
    const getPinchDistance = (event: TouchEvent) => {
      const a = event.touches[0];
      const b = event.touches[1];
      if (!a || !b) return 0;
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    };
    const onTouchStart = (event: TouchEvent) => {
      cancelAnimationFrame(inertiaFrame);
      const first = event.touches[0];
      touchY = first?.clientY ?? 0;
      lastTouchRef.current = { x: first?.clientX ?? 0, y: first?.clientY ?? 0 };
      if (first) setTouchGlow({ x: (first.clientX / window.innerWidth) * 100, y: (first.clientY / window.innerHeight) * 100, active: true });
      if (event.touches.length >= 2) {
        pinchStartRef.current = { distance: getPinchDistance(event), zoom: zoomRef.current };
      }
    };
    const onTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      const first = event.touches[0];
      if (first) setTouchGlow({ x: (first.clientX / window.innerWidth) * 100, y: (first.clientY / window.innerHeight) * 100, active: true });
      if (event.touches.length >= 2) {
        const start = pinchStartRef.current;
        const distance = getPinchDistance(event);
        if (start && start.distance > 0) {
          const nextZoom = Math.min(1.9, Math.max(0.68, start.zoom * (distance / start.distance)));
          zoomRef.current = nextZoom;
          setUserZoom(nextZoom);
        }
        return;
      }
      pinchStartRef.current = null;
      if (!first) return;
      const dx = first.clientX - lastTouchRef.current.x;
      const dy = first.clientY - lastTouchRef.current.y;
      lastTouchRef.current = { x: first.clientX, y: first.clientY };
      const deltaProgress = (touchY - first.clientY) / 5200;
      touchY = first.clientY;
      schedule(progressRef.current + deltaProgress);
      const nextDrag = { x: dragRef.current.x + dx / 240, y: dragRef.current.y - dy / 260 };
      velocityRef.current = { x: dx / 5200, y: -dy / 5600 };
      setDrag(nextDrag);
    };
    const onTouchEnd = () => {
      setTouchGlow((value) => ({ ...value, active: false }));
      pinchStartRef.current = null;
      startInertia();
    };
    const onPointerDown = (event: PointerEvent) => {
      if ((event.target as HTMLElement | null)?.closest?.("button,a")) return;
      pointerDown = true;
      cancelAnimationFrame(inertiaFrame);
      lastTouchRef.current = { x: event.clientX, y: event.clientY };
      setTouchGlow({ x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100, active: true });
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!pointerDown) return;
      event.preventDefault();
      const dx = event.clientX - lastTouchRef.current.x;
      const dy = event.clientY - lastTouchRef.current.y;
      lastTouchRef.current = { x: event.clientX, y: event.clientY };
      setTouchGlow({ x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100, active: true });
      setDrag({ x: dragRef.current.x + dx / 240, y: dragRef.current.y - dy / 260 });
      velocityRef.current = { x: dx / 5200, y: -dy / 5600 };
      schedule(progressRef.current + dy / -5200);
    };
    const onPointerUp = () => {
      if (!pointerDown) return;
      pointerDown = false;
      setTouchGlow((value) => ({ ...value, active: false }));
      startInertia();
    };
    const onMouseDown = (event: MouseEvent) => {
      if ((event.target as HTMLElement | null)?.closest?.("button,a")) return;
      pointerDown = true;
      cancelAnimationFrame(inertiaFrame);
      lastTouchRef.current = { x: event.clientX, y: event.clientY };
      setTouchGlow({ x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100, active: true });
    };
    const onMouseMove = (event: MouseEvent) => {
      if (!pointerDown) return;
      event.preventDefault();
      const dx = event.clientX - lastTouchRef.current.x;
      const dy = event.clientY - lastTouchRef.current.y;
      lastTouchRef.current = { x: event.clientX, y: event.clientY };
      setTouchGlow({ x: (event.clientX / window.innerWidth) * 100, y: (event.clientY / window.innerHeight) * 100, active: true });
      setDrag({ x: dragRef.current.x + dx / 240, y: dragRef.current.y - dy / 260 });
      velocityRef.current = { x: dx / 5200, y: -dy / 5600 };
      schedule(progressRef.current + dy / -5200);
    };
    const onMouseUp = () => {
      if (!pointerDown) return;
      pointerDown = false;
      setTouchGlow((value) => ({ ...value, active: false }));
      startInertia();
    };
    frame = requestAnimationFrame(() => applyCameraProgress(0));
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: false });
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove, { passive: false });
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mousemove", onMouseMove, { passive: false });
    document.addEventListener("mouseup", onMouseUp);
    document.body?.addEventListener("mousedown", onMouseDown);
    document.body?.addEventListener("mousemove", onMouseMove, { passive: false });
    document.body?.addEventListener("mouseup", onMouseUp);
    document.addEventListener("pointerdown", onPointerDown, { passive: true });
    document.addEventListener("pointermove", onPointerMove, { passive: false });
    document.addEventListener("pointerup", onPointerUp);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(inertiaFrame);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body?.removeEventListener("mousedown", onMouseDown);
      document.body?.removeEventListener("mousemove", onMouseMove);
      document.body?.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const testCanvas = document.createElement("canvas");
        const gl = testCanvas.getContext("webgl2") || testCanvas.getContext("webgl") || testCanvas.getContext("experimental-webgl");
        setWebglReady(Boolean(gl));
      } catch {
        setWebglReady(false);
      }
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <main
      className="portal-shell"
      style={{
        ["--mx" as string]: `${mouse.x}%`,
        ["--my" as string]: `${mouse.y}%`,
        ["--active" as string]: active.color,
        ["--scroll-progress" as string]: camera.progress,
      }}
    >
      <div className="portal-viewport">
        <div className="portrait-guard">
          <RotateCcw className="h-12 w-12 text-cyan-200" />
          <h1>请横屏进入 Genesis AI Universe</h1>
          <p>这个界面是横屏游戏式星系传送门，旋转手机后可看到完整中心大脑、Agent 星球和导航行星。</p>
        </div>

        <div className="portal-bg" />
        <div className={`touch-glow ${touchGlow.active ? "active" : ""}`} style={{ ["--touch-x" as string]: `${touchGlow.x}%`, ["--touch-y" as string]: `${touchGlow.y}%` }} />
        {webglReady && <UniverseCanvas active={active} cameraPosition={camera.cameraPosition} target={camera.target} progress={camera.progress} userZoom={userZoom} dragOffset={dragOffset} />}
        <ClockworkFallbackLines />

        <header className="portal-briefing">
          <span className="live-dot" />
          <strong>BRIEFING · LIVE</strong>
          <span className="separator">|</span>
          <Clock />
          <span className="separator">|</span>
          <span>GENESIS AI UNIVERSE · 3D CAMERA ONLINE</span>
        </header>

        <div className="scroll-brief">
          <p>{currentView.eyebrow}</p>
          <h1>{currentView.label}</h1>
          <span>{currentView.text}</span>
        </div>

        <div className="progress-rail" aria-hidden="true">
          {cameraViews.map((view, index) => (
            <button key={view.id} onClick={() => scrollToView(view.id)} className={camera.viewIndex === index ? "active" : ""}>
              <i />
              <span>{String(index).padStart(2, "0")}</span>
            </button>
          ))}
        </div>

        <nav className="side-console" aria-label="Universe navigation">
          <button onClick={() => scrollToView("core")} className="console-btn reset"><RefreshCcw className="h-4 w-4" /> 重置</button>
          {agents.map((agent) => (
            <button key={agent.id} onClick={() => scrollToView(agent.id)} className={`console-btn ${activeId === agent.id ? "active" : ""}`} style={{ ["--node" as string]: agent.color }}>
              {agent.name.replace("AI ", "")}
            </button>
          ))}
          <a className="console-btn portal-link" href="#academy">Academy</a>
          <a className="console-btn portal-link" href="#diagnosis">诊断</a>
        </nav>

        <section className="galaxy-stage" aria-label="Genesis AI Universe portal">
          {!webglReady && (
            <>
              <div className="orbit-ring orbit-ring-1" />
              <div className="orbit-ring orbit-ring-2" />
              <div className="orbit-ring orbit-ring-3" />
              <motion.button className="central-brain" aria-label="Genesis central AI brain" initial={false} animate={{ boxShadow: `0 0 70px ${active.glow}, 0 0 190px rgba(103,232,249,.55)` }} transition={{ duration: 0.35 }}>
                <span className="brain-mesh" />
                <span className="brain-core-glow" />
                <BrainCircuit className="brain-icon" />
                <span className="brain-label">GENESIS<br />CORE</span>
              </motion.button>
            </>
          )}

          {agents.map((agent) => {
            const Icon = agent.icon;
            const selected = activeId === agent.id;
            return (
              <button
                key={agent.id}
                data-module-id={agent.id}
                onClick={() => scrollToView(agent.id)}
                className={`agent-planet ${selected ? "selected" : ""}`}
                style={{ left: `${agent.hud.x}%`, top: `${agent.hud.y}%`, ["--node" as string]: agent.color, ["--node-glow" as string]: agent.glow }}
              >
                <span className="planet-orbit" />
                <span className="planet-body"><Icon className="h-7 w-7" /></span>
                <span className="planet-label"><strong>{agent.name}</strong><em>{agent.role}</em></span>
              </button>
            );
          })}

          {navPlanets.map((planet, index) => (
            <a key={planet.id} className="nav-asteroid" href={planet.url} style={{ left: `${planet.hud.x}%`, top: `${planet.hud.y}%`, ["--node" as string]: planet.color, animationDelay: `${index * -0.4}s` }}>
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
          <motion.div
            key={burst.id}
            className="cinematic-burst"
            initial={{ opacity: 0, scale: 0.72, filter: "blur(18px)" }}
            animate={{ opacity: [0, 1, 0.16], scale: [0.72, 1.2, 1], filter: ["blur(18px)", "blur(0px)", "blur(2px)"] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          >
            {burst.label}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.aside key={active.id} className="agent-dossier" initial={{ opacity: 0, y: 18, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.98 }} transition={{ duration: 0.24 }}>
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
            <button key={agent.id} onClick={() => scrollToView(agent.id)} className={activeId === agent.id ? "active" : ""} style={{ ["--node" as string]: agent.color }}>
              {agent.name}
            </button>
          ))}
        </footer>

        <div className="scanline" />
        <div className="corner-hud corner-a"><Sparkles className="h-4 w-4" /> SYSTEM ONLINE</div>
        <div className="corner-hud corner-b"><Satellite className="h-4 w-4" /> 3D NODES: 88</div>
        <div className="corner-hud corner-c"><Zap className="h-4 w-4" /> PINCH TO ZOOM</div>
      </div>

      <div className="scroll-sectors" aria-hidden="true">
        {cameraViews.map((view, index) => (
          <section key={view.id} id={view.id === "core" ? "genesis-core" : `ai-${view.id}`} className="scroll-sector">
            <div><span>{String(index).padStart(2, "0")}</span><strong>{view.label}</strong></div>
          </section>
        ))}
      </div>
    </main>
  );
}
