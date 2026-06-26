"use client";

import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Code2,
  GraduationCap,
  Megaphone,
  MousePointer2,
  Orbit,
  Rocket,
  Sparkles,
  Workflow,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Module = {
  id: string;
  title: string;
  label: string;
  icon: "code" | "agent" | "automation" | "marketing";
  color: string;
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
    icon: "code",
    color: "#38bdf8",
    position: [-3.3, 1.25, 0],
    description: "从不会写代码，到可以用 AI 建网站、工具、App 与业务系统。",
    bullets: ["Cursor / Claude Code / GitHub Copilot 工作流", "Prompt-to-App 实战", "部署到 Vercel 与真实上线"],
  },
  {
    id: "agents",
    title: "AI Agent Galaxy",
    label: "AI Agent",
    icon: "agent",
    color: "#a855f7",
    position: [3.15, 1.05, 0],
    description: "打造会思考、会调用工具、会执行任务的 AI Agent 系统。",
    bullets: ["Agent 架构与工具调用", "多 Agent 协作", "业务 SOP 自动执行"],
  },
  {
    id: "automation",
    title: "AI Automation Galaxy",
    label: "Automation",
    icon: "automation",
    color: "#22c55e",
    position: [-2.75, -1.65, 0],
    description: "把重复性工作变成自动化流程，串接表格、API、社群与 CRM。",
    bullets: ["Google Sheets 自动化", "OpenClaw / API 串接", "自动发帖、写回、通知"],
  },
  {
    id: "marketing",
    title: "AI Marketing Galaxy",
    label: "Marketing",
    icon: "marketing",
    color: "#f97316",
    position: [2.85, -1.55, 0],
    description: "用 AI 生产高转化内容、广告图、短影音脚本与营销漏斗。",
    bullets: ["爆款 Hook 与中文文案", "AI 广告图 / 海报", "FB / IG 内容矩阵"],
  },
];

const mentors: Mentor[] = [
  {
    name: "Genesis",
    role: "AI 总导师 · 学习路线总控",
    avatar: "G",
    description: "我会帮你把 AI 学习拆成一条清晰路线：先会用，再会做，再会自动化，最后能变成业务能力。",
    focus: ["学习路线", "课程导航", "项目式训练"],
  },
  {
    name: "CodeX",
    role: "AI Coding Mentor",
    avatar: "C",
    description: "我负责带你用 AI 写网站、写工具、修 bug、部署上线，让非程序员也能做出真实产品。",
    focus: ["AI 写代码", "Next.js 项目", "上线部署"],
  },
  {
    name: "AgentOS",
    role: "AI Agent Architect",
    avatar: "A",
    description: "我会教你把 AI 变成能执行任务的 Agent，让它可以读资料、调用工具、判断下一步。",
    focus: ["工具调用", "Agent 流程", "多 Agent 协作"],
  },
  {
    name: "AutoPilot",
    role: "Automation Engineer",
    avatar: "P",
    description: "我负责把你的日常工作接成自动流程：表格、API、社群、通知、CRM 全部串起来。",
    focus: ["Google Sheets", "API", "业务自动化"],
  },
  {
    name: "MarketMind",
    role: "AI Marketing Strategist",
    avatar: "M",
    description: "我帮你用 AI 做出吸睛文案、广告图、内容排程和销售漏斗，让流量变成询问。",
    focus: ["营销文案", "广告素材", "内容矩阵"],
  },
];

const iconMap = {
  code: Code2,
  agent: Bot,
  automation: Workflow,
  marketing: Megaphone,
};

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });
    let frame = 0;
    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }
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

export default function GenesisUniverse() {
  useLenis();
  const [active, setActive] = useState(modules[0]);
  const [mentorIndex, setMentorIndex] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);
  const [mouse, setMouse] = useState({ x: 50, y: 40 });
  const activeMentor = mentors[mentorIndex];
  const ActiveIcon = iconMap[active.icon];

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
        className="pointer-events-none fixed inset-0 z-0 opacity-80"
        style={{
          background: `radial-gradient(circle at ${mouse.x}% ${mouse.y}%, rgba(56,189,248,.22), transparent 26rem), radial-gradient(circle at 80% 10%, rgba(168,85,247,.18), transparent 28rem), linear-gradient(180deg, #02030a 0%, #050816 55%, #02030a 100%)`,
        }}
      />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:70px_70px] [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/25 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
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
            <a href="#galaxies" className="hover:text-cyan-200">四大星系</a>
            <a href="#mentors" className="hover:text-cyan-200">AI 导师</a>
            <a href="#path" className="hover:text-cyan-200">课程路线</a>
            <a href="#join" className="rounded-full border border-cyan-300/40 px-4 py-2 text-cyan-100 hover:bg-cyan-300/10">预约诊断</a>
          </nav>
        </div>
      </header>

      <section id="top" className="relative z-10 grid min-h-screen items-center gap-8 px-4 pt-24 md:grid-cols-[1.05fr_.95fr] md:px-10 lg:px-16">
        <div className="mx-auto max-w-3xl md:mx-0">
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-cyan-100">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" /> BRIEFING · LIVE · <Clock />
          </motion.div>
          <motion.h1 initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.08 }} className="text-5xl font-black leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
            Genesis AI <span className="bg-gradient-to-r from-cyan-200 via-fuchsia-200 to-blue-400 bg-clip-text text-transparent">Universe</span>
          </motion.h1>
          <motion.p initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, delay: 0.18 }} className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
            在一个互动式 AI 宇宙里，学会 <b className="text-cyan-100">AI Coding</b>、<b className="text-purple-100">AI Agent</b>、<b className="text-emerald-100">AI Automation</b> 和 <b className="text-orange-100">AI Marketing</b>。从技术小白，升级成会打造 AI 系统的实战型创作者。
          </motion.p>
          <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.28 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#galaxies" className="group inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-4 font-bold text-black shadow-[0_0_38px_rgba(34,211,238,.35)] transition hover:-translate-y-1 hover:bg-white">
              进入 Genesis 宇宙 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a href="#join" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-4 font-semibold text-white backdrop-blur hover:border-cyan-200/60 hover:bg-cyan-200/10">
              预约免费 AI 学习诊断
            </a>
          </motion.div>
          <div className="mt-10 grid grid-cols-3 gap-3 text-center sm:max-w-xl">
            {["4 大核心课程", "5 位 AI 导师", "12+ 实战项目"].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-white/[.045] p-4 backdrop-blur-xl">
                <p className="text-sm text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[560px] min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-black/20 shadow-2xl shadow-cyan-950/40">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,.12),transparent_22%),radial-gradient(circle_at_70%_30%,rgba(168,85,247,.13),transparent_28%)]" />
          <div className="absolute inset-0 z-10 grid place-items-center">
            <div className="pointer-events-none absolute h-[310px] w-[310px] rounded-full border border-cyan-200/20 shadow-[0_0_80px_rgba(34,211,238,.12)]" />
            <div className="pointer-events-none absolute h-[430px] w-[430px] rounded-full border border-purple-200/10" />
            <button onClick={() => setPanelOpen(true)} className="group relative grid h-36 w-36 place-items-center rounded-full border border-cyan-200/50 bg-cyan-300/10 shadow-[0_0_85px_rgba(34,211,238,.38)] backdrop-blur-xl transition hover:scale-105">
              <span className="absolute inset-3 animate-pulse rounded-full bg-cyan-200/20 blur-xl" />
              <BrainCircuit className="relative h-14 w-14 text-cyan-100" />
              <span className="absolute -bottom-10 rounded-full border border-cyan-200/25 bg-black/55 px-4 py-2 text-xs uppercase tracking-[0.25em] text-cyan-100">Genesis Core</span>
            </button>
            {modules.map((m, index) => {
              const Icon = iconMap[m.icon];
              const spots = [
                { left: "12%", top: "24%" },
                { left: "72%", top: "22%" },
                { left: "16%", top: "70%" },
                { left: "72%", top: "69%" },
              ];
              return (
                <button key={m.id} data-module-id={m.id} onClick={() => { setActive(m); setPanelOpen(true); }} style={{ left: spots[index].left, top: spots[index].top }} className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-[1.4rem] border px-4 py-3 text-left backdrop-blur-xl transition hover:scale-105 ${active.id === m.id ? "border-cyan-200/70 bg-cyan-200/15" : "border-white/10 bg-black/45"}`}>
                  <span className="mb-2 flex items-center gap-2 text-sm font-bold" style={{ color: m.color }}><Icon className="h-4 w-4" /> {m.label}</span>
                  <span className="block text-[10px] text-slate-300">＋ 点击进入星系</span>
                </button>
              );
            })}
          </div>
          <div className="pointer-events-none absolute left-4 top-4 z-20 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-xs text-cyan-100 backdrop-blur-xl">
            GENESIS CORE ONLINE<br /><span className="text-slate-400">Click planets to explore</span>
          </div>
        </div>
      </section>

      <section id="galaxies" className="relative z-10 mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.32em] text-cyan-200">Learning Galaxies</p>
            <h2 className="text-4xl font-black md:text-6xl">四大 AI 学习星系</h2>
          </div>
          <p className="max-w-xl text-slate-300">每个星系都是一个完整能力模块，点击卡片会同步切换右侧中控台信息。</p>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {modules.map((m) => {
            const Icon = iconMap[m.icon];
            const selected = active.id === m.id;
            return (
              <button key={m.id} data-module-id={m.id} onClick={() => { setActive(m); setPanelOpen(true); }} className={`group rounded-[2rem] border p-5 text-left transition duration-300 hover:-translate-y-2 ${selected ? "border-cyan-200/60 bg-cyan-200/10 shadow-[0_0_45px_rgba(34,211,238,.18)]" : "border-white/10 bg-white/[.045] hover:border-white/30"}`}>
                <div className="mb-5 flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl" style={{ backgroundColor: `${m.color}22`, color: m.color }}><Icon /></div>
                  <MousePointer2 className="h-4 w-4 text-slate-500 transition group-hover:text-cyan-200" />
                </div>
                <h3 className="text-xl font-bold">{m.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{m.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <AnimatePresence>
        {panelOpen && (
          <motion.aside initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 40 }} className="fixed bottom-4 right-4 z-50 w-[calc(100%-2rem)] max-w-md rounded-[2rem] border border-white/15 bg-black/70 p-5 shadow-2xl shadow-cyan-950/40 backdrop-blur-2xl md:bottom-8 md:right-8">
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

      <section id="path" className="relative z-10 mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="rounded-[2.4rem] border border-cyan-200/15 bg-gradient-to-br from-white/[.08] to-cyan-300/[.035] p-6 backdrop-blur-xl md:p-10">
          <div className="mb-10 flex items-center gap-3"><GraduationCap className="text-cyan-200" /><h2 className="text-4xl font-black md:text-5xl">Genesis 学习路线图</h2></div>
          <div className="grid gap-4 md:grid-cols-4">
            {coursePath.map(([n, title, text]) => (
              <div key={n} className="relative rounded-[1.7rem] border border-white/10 bg-black/30 p-5">
                <p className="text-5xl font-black text-white/10">{n}</p>
                <h3 className="mt-3 text-xl font-bold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="join" className="relative z-10 px-4 py-24 md:px-6">
        <div className="mx-auto max-w-5xl rounded-[2.6rem] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,.28),transparent_35%),radial-gradient(circle_at_70%_30%,rgba(168,85,247,.24),transparent_38%),rgba(255,255,255,.055)] p-8 text-center shadow-[0_0_80px_rgba(34,211,238,.12)] backdrop-blur-xl md:p-14">
          <BrainCircuit className="mx-auto mb-5 h-12 w-12 text-cyan-200" />
          <h2 className="text-4xl font-black md:text-6xl">准备进入 Genesis AI Universe？</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">第一版目标是收集潜在学员与预约咨询。正式上线后，这里可以接 Google Form、Calendly、课程付款页，或你的自动化报名系统。</p>
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
