"use client";

import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
import { Stars, Html, Line } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { KernelSize, BlendFunction } from "postprocessing";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, BrainCircuit, Code2, ExternalLink, Megaphone, RefreshCcw, RotateCcw, Satellite, Sparkles, Workflow, Zap } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type AgentId = string;
type Agent = {
id: AgentId; name: string; short: string; role: string;
color: string; glow: string; icon: typeof Workflow;
orbitRadius: number; orbitSpeed: number; orbitAngle: number;
orbitTilt: [number, number, number]; galaxy: 0|1|2;
hud: { x: number; y: number }; url: string; description: string;
};
type NavPlanet = { id: string; label: string; sub: string; color: string; hud: { x: number; y: number }; url: string; };

const agents: Agent[] = [
{ id:"automation", name:"AI Automation", short:"AUTO", role:"自动化流程星系", color:"#22d3ee", glow:"rgba(34,211,238,.82)", icon:Workflow, orbitRadius:20, orbitSpeed:0.18, orbitAngle:0, orbitTilt:[0.28,0,0.18], galaxy:0, hud:{x:20,y:26}, url:"#ai-automation", description:"表格、API、社群、CRM 与 OpenClaw 工作流自动连接。" },
{ id:"sheets", name:"Sheets Engine", short:"SHEET", role:"资料同步行星", color:"#34d399", glow:"rgba(52,211,153,.8)", icon:Workflow, orbitRadius:20, orbitSpeed:0.18, orbitAngle:Math.PI/2, orbitTilt:[0.28,0,0.18], galaxy:0, hud:{x:80,y:27}, url:"#ai-sheets", description:"Google Sheets、资料清洗、订单状态与自动回写系统。" },
{ id:"crm", name:"CRM Brain", short:"CRM", role:"客户经营行星", color:"#38bdf8", glow:"rgba(56,189,248,.8)", icon:Bot, orbitRadius:20, orbitSpeed:0.18, orbitAngle:Math.PI, orbitTilt:[0.28,0,0.18], galaxy:0, hud:{x:48,y:81}, url:"#ai-crm", description:"客户分层、跟进提醒、复购路径与自动私讯辅助。" },
{ id:"ops", name:"Ops Control", short:"OPS", role:"营运中控行星", color:"#2dd4bf", glow:"rgba(45,212,191,.78)", icon:Satellite, orbitRadius:20, orbitSpeed:0.18, orbitAngle:Math.PI*1.5, orbitTilt:[0.28,0,0.18], galaxy:0, hud:{x:50,y:17}, url:"#ai-ops", description:"把流程、任务、通知、状态监控集中到一个自动化中控台。" },
{ id:"marketing", name:"AI Marketing", short:"MKT", role:"增长营销星系", color:"#f472b6", glow:"rgba(244,114,182,.82)", icon:Megaphone, orbitRadius:36, orbitSpeed:-0.12, orbitAngle:0, orbitTilt:[0.42,0.18,-0.12], galaxy:1, hud:{x:88,y:37}, url:"#ai-marketing", description:"爆款 Hook、广告图、内容矩阵、短影音脚本与营销漏斗。" },
{ id:"content", name:"Content Studio", short:"POST", role:"内容生产行星", color:"#fb7185", glow:"rgba(251,113,133,.82)", icon:Megaphone, orbitRadius:36, orbitSpeed:-0.12, orbitAngle:Math.PI*0.67, orbitTilt:[0.42,0.18,-0.12], galaxy:1, hud:{x:12,y:37}, url:"#ai-content", description:"把商品卖点转成社群贴文、广告脚本、短影音与图像创意。" },
{ id:"ads", name:"Ad Galaxy", short:"ADS", role:"广告素材行星", color:"#fbbf24", glow:"rgba(251,191,36,.82)", icon:Sparkles, orbitRadius:36, orbitSpeed:-0.12, orbitAngle:Math.PI*1.33, orbitTilt:[0.42,0.18,-0.12], galaxy:1, hud:{x:73,y:82}, url:"#ai-ads", description:"生成高点击广告图、标题、CTA 与多版本 A/B 测试素材。" },
{ id:"funnel", name:"Funnel Core", short:"FUNNEL", role:"销售漏斗行星", color:"#e879f9", glow:"rgba(232,121,249,.8)", icon:Zap, orbitRadius:36, orbitSpeed:-0.12, orbitAngle:Math.PI*2.0, orbitTilt:[0.42,0.18,-0.12], galaxy:1, hud:{x:27,y:82}, url:"#ai-funnel", description:"从曝光、点击、询问、成交到复购的完整转化路径。" },
{ id:"agent", name:"AI Agent", short:"AGENT", role:"智能代理星系", color:"#a78bfa", glow:"rgba(167,139,250,.82)", icon:Bot, orbitRadius:58, orbitSpeed:0.075, orbitAngle:0, orbitTilt:[-0.28,-0.25,0.22], galaxy:2, hud:{x:88,y:56}, url:"#ai-agent", description:"让 AI 会思考、调用工具、拆任务，并成为业务执行助手。" },
{ id:"coding", name:"AI Coding", short:"CODE", role:"产品构建星系", color:"#60a5fa", glow:"rgba(96,165,250,.82)", icon:Code2, orbitRadius:58, orbitSpeed:0.075, orbitAngle:Math.PI*0.5, orbitTilt:[-0.28,-0.25,0.22], galaxy:2, hud:{x:12,y:56}, url:"#ai-coding", description:"用 AI 建网站、工具、App、自动化系统，并部署上线。" },
{ id:"deploy", name:"Deploy Portal", short:"LIVE", role:"上线部署行星", color:"#c084fc", glow:"rgba(192,132,252,.82)", icon:ExternalLink, orbitRadius:58, orbitSpeed:0.075, orbitAngle:Math.PI, orbitTilt:[-0.28,-0.25,0.22], galaxy:2, hud:{x:70,y:16}, url:"#ai-deploy", description:"GitHub、Vercel、上线检查、版本回滚与产品发布流程。" },
{ id:"data", name:"Data Vault", short:"DATA", role:"知识资料行星", color:"#ffffff", glow:"rgba(255,255,255,.86)", icon:BrainCircuit, orbitRadius:58, orbitSpeed:0.075, orbitAngle:Math.PI*1.5, orbitTilt:[-0.28,-0.25,0.22], galaxy:2, hud:{x:30,y:16}, url:"#ai-data", description:"沉淀知识库、操作 SOP、训练资料与可复用自动化资产。" },
];

const navPlanets: NavPlanet[] = [
{ id:"academy", label:"Academy", sub:"课程入口", color:"#38bdf8", hud:{x:14,y:44}, url:"#academy" },
{ id:"projects", label:"Projects", sub:"实战作品", color:"#c084fc", hud:{x:86,y:44}, url:"#projects" },
{ id:"templates", label:"Templates", sub:"模板库", color:"#34d399", hud:{x:16,y:60}, url:"#templates" },
{ id:"community", label:"Community", sub:"学习社群", color:"#fb7185", hud:{x:84,y:60}, url:"#community" },
{ id:"roadmap", label:"Roadmap", sub:"路线图", color:"#60a5fa", hud:{x:38,y:14}, url:"#roadmap" },
{ id:"diagnosis", label:"Diagnosis", sub:"AI 诊断", color:"#f97316", hud:{x:62,y:14}, url:"#diagnosis" },
{ id:"vault", label:"Vault", sub:"资源库", color:"#2dd4bf", hud:{x:39,y:88}, url:"#vault" },
{ id:"launch", label:"Launch", sub:"上线部署", color:"#e879f9", hud:{x:61,y:88}, url:"#launch" },
];

// Global real-time world positions for each agent planet (updated every frame by AgentPlanet3D)
const planetWorldPositions = new Map<string, THREE.Vector3>();
// The currently tracked agent ID for zoom (read by CameraController)
let zoomedAgentId: string | null = null;

function Clock() {
const [time, setTime] = useState("");
useEffect(() => {
const tick = () => setTime(new Intl.DateTimeFormat("zh-CN",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(new Date()));
tick(); const id = setInterval(tick,1000); return ()=>clearInterval(id);
},[]);
return <span>{time}</span>;
}
// ─── Shockwave ───────────────────────────────────────────────────────────────
function Shockwave({ position, color, onDone }: { position: THREE.Vector3; color: string; onDone: ()=>void }) {
const mesh = useRef<THREE.Mesh>(null);
const mat = useRef<THREE.MeshBasicMaterial>(null);
const progress = useRef(0);
useFrame((_,delta)=>{
progress.current += delta * 1.1;
const p = Math.min(progress.current, 1);
if (mesh.current) mesh.current.scale.setScalar(1 + p * 5.5);
if (mat.current) mat.current.opacity = (1-p) * 0.9;
if (p >= 1) onDone();
});
return (
<mesh ref={mesh} position={position}>
<ringGeometry args={[0.8, 1.2, 64]} />
<meshBasicMaterial ref={mat} color={color} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
</mesh>
);
}

// ─── Camera Controller ────────────────────────────────────────────────────────
// When zooming=true, continuously reads the live planet world position from
// planetWorldPositions map and keeps the camera orbit around that moving planet.
function CameraController({ zooming, zoomAgentId }: { zooming: boolean; zoomAgentId: string | null }) {
const { camera } = useThree();
const currentPos = useRef(new THREE.Vector3(0, 1.2, 42));
const currentLook = useRef(new THREE.Vector3(0,0,0));
const orbitTheta = useRef(0.65);
const orbitPhi = useRef(0.18);
const orbitVel = useRef({ theta:0, phi:0 });
const zoomLevel = useRef(1);
const zoomVel = useRef(0);
const isDragging = useRef(false);
const lastMouse = useRef({ x:0, y:0 });
// For smooth zoom approach: track how close we are to the target
const zoomApproachT = useRef(0);

useEffect(()=>{
const onWheel = (e: WheelEvent) => { e.preventDefault(); if (!zooming) { zoomVel.current -= e.deltaY * 0.0003; orbitVel.current.theta -= e.deltaX * 0.0003; } };
const onDown = (e: MouseEvent) => { if ((e.target as HTMLElement)?.closest?.('button,a')) return; isDragging.current = true; lastMouse.current = { x: e.clientX, y: e.clientY }; };
const onMove = (e: MouseEvent) => { if (!isDragging.current || zooming) return; const dx=e.clientX-lastMouse.current.x; const dy=e.clientY-lastMouse.current.y; lastMouse.current={x:e.clientX,y:e.clientY}; orbitVel.current.theta-=dx*0.007; orbitVel.current.phi-=dy*0.005; };
const onUp = () => { isDragging.current = false; };
const onTouch = (e: TouchEvent) => {
if (e.touches.length===1) {
const t=e.touches[0]!;
if(e.type==='touchstart'){ isDragging.current=true; lastMouse.current={x:t.clientX,y:t.clientY}; }
if(e.type==='touchmove'&&!zooming){ e.preventDefault(); const dx=t.clientX-lastMouse.current.x; const dy=t.clientY-lastMouse.current.y; lastMouse.current={x:t.clientX,y:t.clientY}; orbitVel.current.theta-=dx*0.007; orbitVel.current.phi-=dy*0.005; }
if(e.type==='touchend') isDragging.current=false;
}
};
window.addEventListener('wheel',onWheel,{passive:false}); window.addEventListener('mousedown',onDown); window.addEventListener('mousemove',onMove); window.addEventListener('mouseup',onUp);
window.addEventListener('touchstart',onTouch,{passive:true}); window.addEventListener('touchmove',onTouch,{passive:false}); window.addEventListener('touchend',onTouch);
return ()=>{ window.removeEventListener('wheel',onWheel); window.removeEventListener('mousedown',onDown); window.removeEventListener('mousemove',onMove); window.removeEventListener('mouseup',onUp); window.removeEventListener('touchstart',onTouch); window.removeEventListener('touchmove',onTouch); window.removeEventListener('touchend',onTouch); };
},[zooming]);

useEffect(()=>{
if(zooming) { zoomApproachT.current = 0; }
else { zoomApproachT.current = 0; }
},[zooming, zoomAgentId]);

useFrame((_,delta)=>{
if (zooming && zoomAgentId) {
// Live-track the planet's current world position
const planetPos = planetWorldPositions.get(zoomAgentId);
if (planetPos && planetPos.length() > 0.01) {
zoomApproachT.current = Math.min(1, zoomApproachT.current + delta * 0.6);
// Compute a camera position behind-and-above the planet
const outward = planetPos.clone().normalize();
const upVec = new THREE.Vector3(0,1,0);
const side = outward.clone().cross(upVec).normalize();
// Distance from planet: start far (18), settle at 10
const dist = 18 - zoomApproachT.current * 8;
const desiredPos = planetPos.clone()
.add(outward.clone().multiplyScalar(dist * 0.7))
.add(new THREE.Vector3(0, dist * 0.35, 0))
.add(side.clone().multiplyScalar(dist * 0.2));
// Smoothly move camera toward that position and look at planet
const lerpSpeed = 0.055;
currentPos.current.lerp(desiredPos, lerpSpeed);
currentLook.current.lerp(planetPos, lerpSpeed);
camera.position.copy(currentPos.current);
camera.lookAt(currentLook.current);
}
} else {
// Free orbit mode
const speed = 0.08;
orbitTheta.current += orbitVel.current.theta;
orbitPhi.current = Math.max(-1.1, Math.min(1.1, orbitPhi.current + orbitVel.current.phi));
orbitVel.current.theta *= 0.88; orbitVel.current.phi *= 0.88;
zoomLevel.current = Math.max(0.06, Math.min(18, zoomLevel.current + zoomVel.current));
zoomVel.current *= 0.88;
orbitTheta.current += delta * 0.06;
const r = 42 / zoomLevel.current;
const desired = new THREE.Vector3(
Math.cos(orbitTheta.current)*Math.cos(orbitPhi.current)*r,
Math.sin(orbitPhi.current)*r,
Math.sin(orbitTheta.current)*Math.cos(orbitPhi.current)*r
);
currentPos.current.lerp(desired, speed);
currentLook.current.lerp(new THREE.Vector3(0,0,0), speed);
camera.position.copy(currentPos.current);
camera.lookAt(currentLook.current);
}
});
return null;
}
// ─── Brain Shader Material ───────────────────────────────────────────────────
const brainVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;
void main() {
vNormal = normalize(normalMatrix * normal);
vPosition = position;
vUv = uv;
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const brainFragmentShader = `
uniform float uTime;
uniform vec3 uColor;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec2 vUv;

float hexGrid(vec2 p, float scale) {
p *= scale;
vec2 r = vec2(1.0, 1.732);
vec2 h = r * 0.5;
vec2 a = mod(p, r) - h;
vec2 b = mod(p - h, r) - h;
vec2 gv = dot(a,a) < dot(b,b) ? a : b;
float d = length(gv);
return smoothstep(0.44, 0.46, d);
}

void main() {
float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.8);
vec2 sphereUv = vec2(
atan(vPosition.z, vPosition.x) / (2.0 * 3.14159) + 0.5,
asin(vPosition.y / length(vPosition)) / 3.14159 + 0.5
);
float hexLine = hexGrid(sphereUv + vec2(uTime * 0.02, 0.0), 8.0);
float hexLine2 = hexGrid(sphereUv * 1.618 + vec2(0.0, uTime * 0.015), 5.0);
float grid = max(hexLine, hexLine2 * 0.6);
float dist = length(vPosition) / 2.72;
float pulse = sin(dist * 6.28 - uTime * 2.0) * 0.5 + 0.5;
pulse *= 0.35;
vec3 baseColor = mix(uColor, vec3(1.0), 0.55);
vec3 rimColor = mix(vec3(0.4, 0.9, 1.0), baseColor, 0.5);
vec3 col = vec3(0.0);
col += baseColor * grid * (0.7 + pulse * 0.3);
col += rimColor * fresnel * 1.8;
col += vec3(0.6, 1.0, 1.0) * pulse * 0.25;
float alpha = max(grid * 0.92, fresnel * 0.85);
alpha = clamp(alpha, 0.0, 1.0);
gl_FragColor = vec4(col, alpha);
}
`;

// ─── Central Brain 3D ────────────────────────────────────────────────────────
function CentralBrain3D({ color }: { color: string }) {
const brain = useRef<THREE.Group>(null);
const shaderRef = useRef<THREE.ShaderMaterial>(null);
const orbitRefs = [useRef<THREE.Group>(null),useRef<THREE.Group>(null),useRef<THREE.Group>(null),useRef<THREE.Group>(null)];
const sparks = useRef<THREE.Group>(null);
const innerGlow = useRef<THREE.Mesh>(null);

useFrame(({clock})=>{
const t = clock.getElapsedTime();
if(brain.current){ brain.current.rotation.y=t*0.28; brain.current.rotation.x=Math.sin(t*0.38)*0.14; }
if(shaderRef.current){ shaderRef.current.uniforms.uTime.value=t; shaderRef.current.uniforms.uColor.value.set(color); }
if(innerGlow.current) innerGlow.current.scale.setScalar(1+Math.sin(t*3.2)*0.085);
if(orbitRefs[0].current) orbitRefs[0].current.rotation.z=t*0.95;
if(orbitRefs[1].current) orbitRefs[1].current.rotation.y=-t*0.74;
if(orbitRefs[2].current) orbitRefs[2].current.rotation.x=t*0.58;
if(orbitRefs[3].current) orbitRefs[3].current.rotation.z=-t*0.38;
if(sparks.current){ sparks.current.rotation.y=t*1.15; sparks.current.rotation.z=-t*0.52; }
});

const shaderMaterial = useMemo(()=> new THREE.ShaderMaterial({
vertexShader: brainVertexShader,
fragmentShader: brainFragmentShader,
uniforms: { uTime:{ value:0 }, uColor:{ value: new THREE.Color(color) } },
transparent: true,
blending: THREE.AdditiveBlending,
depthWrite: false,
side: THREE.FrontSide,
}), []);

return (
<group ref={brain}>
<mesh><sphereGeometry args={[6.8,64,64]}/><meshBasicMaterial color={color} transparent opacity={0.055} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
<mesh><sphereGeometry args={[5.2,64,64]}/><meshBasicMaterial color="#67e8f9" transparent opacity={0.07} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
<mesh><sphereGeometry args={[4.45,96,96]}/><meshBasicMaterial color={color} transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
<mesh><icosahedronGeometry args={[2.72, 5]} /><primitive object={shaderMaterial} ref={shaderRef} /></mesh>
<mesh ref={innerGlow}><sphereGeometry args={[2.08,128,128]}/><meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={14} roughness={0.01} metalness={0.18} transparent opacity={0.78}/></mesh>
<mesh><sphereGeometry args={[1.4,64,64]}/><meshBasicMaterial color="#ffffff" transparent opacity={0.92} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
<group ref={orbitRefs[0]} rotation={[0.66,0.08,0.15]}>
<mesh><torusGeometry args={[4.05,0.026,18,320]}/><meshBasicMaterial color="#67e8f9" transparent opacity={0.92} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
<mesh position={[4.05,0,0]}><sphereGeometry args={[0.095,22,22]}/><meshBasicMaterial color="#ffffff" transparent opacity={1} blending={THREE.AdditiveBlending}/></mesh>
</group>
<group ref={orbitRefs[1]} rotation={[1.15,0.5,0.8]}>
<mesh><torusGeometry args={[5.25,0.018,18,360]}/><meshBasicMaterial color="#c084fc" transparent opacity={0.72} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
<mesh position={[-5.25,0,0]}><sphereGeometry args={[0.07,18,18]}/><meshBasicMaterial color="#f0abfc" transparent opacity={0.95} blending={THREE.AdditiveBlending}/></mesh>
</group>
<group ref={orbitRefs[2]} rotation={[0.2,1.28,0.35]}>
<mesh><torusGeometry args={[6.35,0.014,18,380]}/><meshBasicMaterial color="#f472b6" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
<mesh position={[0,6.35,0]}><sphereGeometry args={[0.06,18,18]}/><meshBasicMaterial color="#ffffff" transparent opacity={0.9} blending={THREE.AdditiveBlending}/></mesh>
</group>
<group ref={orbitRefs[3]} rotation={[1.35,-0.55,0.1]}>
<mesh><torusGeometry args={[7.35,0.01,18,420]}/><meshBasicMaterial color="#ffffff" transparent opacity={0.33} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
</group>
<group ref={sparks}>
{Array.from({length:42},(_,i)=>{
const angle=(i/72)*Math.PI*2; const r=3.05+(i%7)*0.48;
return (<mesh key={i} position={[Math.cos(angle)*r,Math.sin(angle*1.4)*1.85,Math.sin(angle)*r*0.62]}>
<sphereGeometry args={[0.025+(i%4)*0.013,10,10]}/>
<meshBasicMaterial color={i%3===0?"#ffffff":i%3===1?"#67e8f9":color} transparent opacity={0.95} blending={THREE.AdditiveBlending}/>
</mesh>);
})}
</group>
<pointLight color="#ffffff" intensity={28} distance={26}/>
<pointLight color={color} intensity={24} distance={28}/>
<pointLight position={[0,0,4.5]} color="#67e8f9" intensity={14} distance={20}/>
<pointLight position={[0,0,-4.5]} color="#f0abfc" intensity={9} distance={18}/>
</group>
);
}

// ─── Connection Lines ─────────────────────────────────────────────────────────
function ConnectionLine({ to, color, active }: { to: THREE.Vector3; color: string; active: boolean }) {
const points = useMemo(()=>{
const mid = to.clone().multiplyScalar(0.45); mid.z+=0.5;
return [new THREE.Vector3(0,0,0), mid, to];
},[to]);
return (
<Line points={points} color={color} lineWidth={active ? 1.8 : 0.7}
transparent opacity={active ? 0.78 : 0.28}
dashed={!active} dashSize={0.8} gapSize={0.4}
/>
);
}

// ─── Agent Planet Label ──────────────────────────────────────────────────────
function PlanetLabel({ name, role, color, active }: { name: string; role: string; color: string; active: boolean }) {
return (
<div style={{ pointerEvents: 'none', textAlign: 'center', whiteSpace: 'nowrap', fontFamily: "'Geist', Arial, sans-serif" }}>
<div style={{ display: 'inline-block', position: 'relative', background: active ? 'linear-gradient(135deg, rgba(2,8,23,0.92), rgba(8,16,36,0.88))' : 'rgba(2,8,23,0.72)', border: `1px solid ${color}${active ? 'cc' : '55'}`, borderRadius: 10, padding: active ? '7px 12px' : '5px 9px', backdropFilter: 'blur(14px)', boxShadow: active ? `0 0 24px ${color}60, 0 0 48px ${color}28, inset 0 0 16px rgba(255,255,255,0.04)` : `0 0 14px ${color}30`, transition: 'all 0.3s ease' }}>
{active && <>
<div style={{ position:'absolute', top:2, left:2, width:6, height:6, borderTop:`1px solid ${color}`, borderLeft:`1px solid ${color}`, borderRadius:'2px 0 0 0' }}/>
<div style={{ position:'absolute', top:2, right:2, width:6, height:6, borderTop:`1px solid ${color}`, borderRight:`1px solid ${color}`, borderRadius:'0 2px 0 0' }}/>
<div style={{ position:'absolute', bottom:2, left:2, width:6, height:6, borderBottom:`1px solid ${color}`, borderLeft:`1px solid ${color}`, borderRadius:'0 0 0 2px' }}/>
<div style={{ position:'absolute', bottom:2, right:2, width:6, height:6, borderBottom:`1px solid ${color}`, borderRight:`1px solid ${color}`, borderRadius:'0 0 2px 0' }}/>
</>}
<div style={{ color: color, fontSize: active ? 11 : 10, fontWeight: 900, letterSpacing: '0.18em', textShadow: `0 0 12px ${color}, 0 0 24px ${color}80`, marginBottom: 2 }}>{name}</div>
<div style={{ color: 'rgba(186,230,253,0.72)', fontSize: 8, letterSpacing: '0.06em', marginTop: 1 }}>{role}</div>
{active && (
<div style={{ marginTop: 5, paddingTop: 4, borderTop: `1px solid ${color}40`, display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}>
<div style={{ width:5, height:5, borderRadius:'50%', background:color, boxShadow:`0 0 8px ${color}` }}/>
<span style={{ color:color, fontSize:8, fontWeight:800, letterSpacing:'0.2em' }}>ACTIVE</span>
</div>
)}
</div>
<div style={{ width:1, height: active ? 14 : 10, background:`linear-gradient(to bottom, ${color}80, transparent)`, margin:'0 auto' }}/>
</div>
);
}
// ─── Agent Planet 3D ─────────────────────────────────────────────────────────
// Registers world position into planetWorldPositions every frame
function AgentPlanet3D({ agent, active, onClick }: { agent: Agent; active: boolean; onClick: ()=>void }) {
const group = useRef<THREE.Group>(null);
const planet = useRef<THREE.Mesh>(null);
const moons = useRef<THREE.Group>(null);
const angleRef = useRef(agent.orbitAngle);
const _wp = useRef(new THREE.Vector3());

useFrame(({clock},delta)=>{
const t = clock.getElapsedTime();
angleRef.current += agent.orbitSpeed * delta;
const r = agent.orbitRadius;
const lx = Math.cos(angleRef.current)*r;
const lz = Math.sin(angleRef.current)*r;
const ly = Math.sin(angleRef.current*1.3)*r*0.18;
if(group.current){
group.current.position.set(lx,ly,lz);
group.current.rotation.y=t*0.22;
// Update global world position map
group.current.getWorldPosition(_wp.current);
planetWorldPositions.set(agent.id, _wp.current.clone());
}
if(planet.current) planet.current.rotation.y=t*0.78;
if(moons.current){ moons.current.rotation.y=t*(active?1.38:0.98); moons.current.rotation.z=Math.sin(t*0.42)*0.28; }
});

useEffect(()=>()=>{ planetWorldPositions.delete(agent.id); },[agent.id]);

const sz = active ? 0.88 : 0.64;
return (
<group ref={group} position={[agent.orbitRadius,0,0]}>
<mesh onClick={(e)=>{ e.stopPropagation(); onClick(); }} onPointerOver={()=>document.body.style.cursor='pointer'} onPointerOut={()=>document.body.style.cursor=''}>
<sphereGeometry args={[sz*2.6,32,32]}/><meshBasicMaterial color={agent.color} transparent opacity={0} depthWrite={false}/>
</mesh>
<mesh><sphereGeometry args={[sz*2.4,48,48]}/><meshBasicMaterial color={agent.color} transparent opacity={active?0.1:0.06} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
<mesh><sphereGeometry args={[sz*1.7,48,48]}/><meshBasicMaterial color={agent.color} transparent opacity={active?0.22:0.12} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
<mesh ref={planet}>
<sphereGeometry args={[sz,64,64]}/>
<meshStandardMaterial color={agent.color} emissive={agent.color} emissiveIntensity={active?8.5:4.8} metalness={0.55} roughness={0.12}/>
</mesh>
<mesh rotation={[Math.PI/2.1,0,0]}>
<torusGeometry args={[sz*1.72,0.016,18,180]}/>
<meshBasicMaterial color={agent.color} transparent opacity={active?0.98:0.52} blending={THREE.AdditiveBlending}/>
</mesh>
<mesh rotation={[0.7,0.35,0.2]}>
<torusGeometry args={[sz*2.4,0.008,18,190]}/>
<meshBasicMaterial color={agent.color} transparent opacity={active?0.62:0.24} blending={THREE.AdditiveBlending}/>
</mesh>
<group ref={moons} rotation={[0.45,0.15,0.2]}>
{Array.from({length:4},(_,i)=>{
const a=(i/4)*Math.PI*2; const mr=(active?sz*2.5:sz*2.0)+(i%2)*0.2;
return (
<group key={i} rotation={[i*0.32,a,i*0.18]}>
<mesh position={[Math.cos(a)*mr,Math.sin(a*1.6)*0.34,Math.sin(a)*mr]}>
<sphereGeometry args={[active?0.13:0.09,18,18]}/>
<meshBasicMaterial color={i%2===0?"#ffffff":agent.color} transparent opacity={0.92} blending={THREE.AdditiveBlending} depthWrite={false}/>
</mesh>
</group>
);
})}
</group>
<pointLight color={agent.color} intensity={active?14:7} distance={10}/>
<Html distanceFactor={20} center style={{ pointerEvents:'none', transform:'translateY(60px)' }}>
<PlanetLabel name={agent.name} role={agent.role} color={agent.color} active={active}/>
</Html>
</group>
);
}

// ─── Galaxy ───────────────────────────────────────────────────────────────────
function Galaxy({ galaxyIndex, agents: galaxyAgents, activeId, onPlanetClick }: { galaxyIndex: number; agents: Agent[]; activeId: string; onPlanetClick: (id:string)=>void }) {
const group = useRef<THREE.Group>(null);
const r = galaxyIndex===0?20:galaxyIndex===1?36:58;
const ringColor = galaxyIndex===0?"#67e8f9":galaxyIndex===1?"#f472b6":"#a78bfa";
const tilt = galaxyAgents[0]?.orbitTilt ?? [0,0,0];
const rotSpeed = galaxyIndex===0?0.022:galaxyIndex===1?-0.016:0.011;

useFrame(({clock})=>{ if(group.current) group.current.rotation.y=clock.getElapsedTime()*rotSpeed; });

return (
<group ref={group} rotation={tilt as [number,number,number]}>
<mesh rotation={[Math.PI/2,0,0]}>
<torusGeometry args={[r,0.032,16,280]}/>
<meshBasicMaterial color={ringColor} transparent opacity={0.32} blending={THREE.AdditiveBlending} depthWrite={false}/>
</mesh>
{galaxyAgents.map(agent=>(
<ConnectionLine key={`line-${agent.id}`} to={new THREE.Vector3(agent.orbitRadius,0,0)} color={agent.color} active={activeId===agent.id}/>
))}
{galaxyAgents.map(agent=>(
<AgentPlanet3D key={agent.id} agent={agent} active={activeId===agent.id}
onClick={()=>onPlanetClick(agent.id)}
/>
))}
</group>
);
}
// ─── Background Particles ─────────────────────────────────────────────────────
function BackgroundParticles() {
const group = useRef<THREE.Group>(null);
const geo1 = useMemo(()=>{ const g=new THREE.BufferGeometry(); const pos=new Float32Array(1200*3); for(let i=0;i<1200;i++){ const r=200+Math.random()*600; const th=Math.random()*Math.PI*2; const ph=(Math.random()-0.5)*Math.PI; pos[i*3]=Math.cos(th)*Math.cos(ph)*r; pos[i*3+1]=Math.sin(ph)*r; pos[i*3+2]=Math.sin(th)*Math.cos(ph)*r; } g.setAttribute('position',new THREE.BufferAttribute(pos,3)); return g; },[]);
const geo2 = useMemo(()=>{ const g=new THREE.BufferGeometry(); const pos=new Float32Array(800*3); for(let i=0;i<800;i++){ const r=400+Math.random()*400; const th=Math.random()*Math.PI*2; const ph=(Math.random()-0.5)*Math.PI; pos[i*3]=Math.cos(th)*Math.cos(ph)*r; pos[i*3+1]=Math.sin(ph)*r; pos[i*3+2]=Math.sin(th)*Math.cos(ph)*r; } g.setAttribute('position',new THREE.BufferAttribute(pos,3)); return g; },[]);
const geo3 = useMemo(()=>{ const g=new THREE.BufferGeometry(); const pos=new Float32Array(600*3); for(let i=0;i<600;i++){ const r=600+Math.random()*600; const th=Math.random()*Math.PI*2; const ph=(Math.random()-0.5)*Math.PI; pos[i*3]=Math.cos(th)*Math.cos(ph)*r; pos[i*3+1]=Math.sin(ph)*r; pos[i*3+2]=Math.sin(th)*Math.cos(ph)*r; } g.setAttribute('position',new THREE.BufferAttribute(pos,3)); return g; },[]);
useFrame(({clock})=>{ const t=clock.getElapsedTime(); if(group.current){ (group.current.children[0] as THREE.Points).rotation.y=t*0.012; (group.current.children[1] as THREE.Points).rotation.y=-t*0.008; (group.current.children[2] as THREE.Points).rotation.x=t*0.005; } });
return (<group ref={group}><points geometry={geo1}><pointsMaterial size={1.8} color="#ffffff" transparent opacity={0.65} sizeAttenuation/></points><points geometry={geo2}><pointsMaterial size={2.4} color="#67e8f9" transparent opacity={0.38} sizeAttenuation/></points><points geometry={geo3}><pointsMaterial size={1.6} color="#a78bfa" transparent opacity={0.28} sizeAttenuation/></points></group>);
}

// ─── Flying Orbs ─────────────────────────────────────────────────────────────
function FlyingGlowPlanets() {
const group = useRef<THREE.Group>(null);
const flyers = useMemo(()=>Array.from({length:28},(_,i)=>({ radius:0.045+(i%5)*0.018, speed:0.15+(i%6)*0.035, phase:i*1.71, y:-7.5+(i%4)*3.6+Math.sin(i)*0.65, z:-18-(i%7)*2.4, spread:30+(i%6)*4.5, color:i%4===0?"#67e8f9":i%4===1?"#a78bfa":i%4===2?"#f472b6":"#ffffff" })),[]);
useFrame(({clock})=>{ const t=clock.getElapsedTime(); if(group.current) group.current.children.forEach((child,i)=>{ const f=flyers[i]; if(!f) return; const travel=((t*f.speed+f.phase)%1)*2-1; child.position.set(travel*f.spread,f.y+Math.sin(t*0.8+f.phase)*0.35,f.z+Math.cos(t*0.45+f.phase)*0.8); }); });
return (<group ref={group}>{flyers.map((f,i)=>(<group key={i}><mesh><sphereGeometry args={[f.radius*5.2,18,18]}/><meshBasicMaterial color={f.color} transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh><mesh><sphereGeometry args={[f.radius,16,16]}/><meshBasicMaterial color={f.color} transparent opacity={0.82} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh></group>))}</group>);
}

// ─── Network Nodes ────────────────────────────────────────────────────────────
function NetworkNodes() {
const group = useRef<THREE.Group>(null);
const { nodes, linePositions } = useMemo(()=>{ const nodes=Array.from({length:160},(_,i)=>{ const angle=(i*2.399963)%(Math.PI*2); const r=18+((i*17)%100)/100*68; const y=Math.sin(i*1.37)*22; return {p:new THREE.Vector3(Math.cos(angle)*r,y,Math.sin(angle)*r*0.9-16),s:0.018+(i%5)*0.008,color:i%5===0?"#fb7185":i%5===1?"#fbbf24":i%5===2?"#a78bfa":"#67e8f9"}; }); const vals: number[]=[]; nodes.forEach((n,i)=>{ const nx=nodes[(i+13)%nodes.length]!; if(n.p.distanceTo(nx.p)<22||i%7===0) vals.push(n.p.x,n.p.y,n.p.z,nx.p.x,nx.p.y,nx.p.z); }); return {nodes,linePositions:new Float32Array(vals)}; },[]);
useFrame(({clock})=>{ if(group.current){ group.current.rotation.y=clock.getElapsedTime()*0.022; group.current.rotation.z=Math.sin(clock.getElapsedTime()*0.1)*0.06; } });
return (<group ref={group}><lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" args={[linePositions,3]}/></bufferGeometry><lineBasicMaterial color="#67e8f9" transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false}/></lineSegments>{nodes.map((n,i)=>(<mesh key={i} position={n.p}><sphereGeometry args={[n.s,8,8]}/><meshBasicMaterial color={n.color} transparent opacity={0.75} blending={THREE.AdditiveBlending}/></mesh>))}</group>);
}

// ─── Universe Scene ───────────────────────────────────────────────────────────
type ShockwaveData = { id:string; pos:THREE.Vector3; color:string };

function UniverseScene({ activeId, zooming, zoomAgentId, onPlanetClick }:{ activeId:string; zooming:boolean; zoomAgentId:string|null; onPlanetClick:(id:string)=>void }) {
const galaxyAgents = useMemo(()=>[0,1,2].map(g=>agents.filter(a=>a.galaxy===g)),[]);
const [shockwaves, setShockwaves] = useState<ShockwaveData[]>([]);
const activeAgent = agents.find(a=>a.id===activeId);

const handlePlanetClick = useCallback((id:string)=>{
const agent=agents.find(a=>a.id===id); if(!agent) return;
const worldPos = planetWorldPositions.get(id) ?? new THREE.Vector3(agent.orbitRadius,0,0);
setShockwaves(prev=>[...prev, {id:id+Date.now(), pos:worldPos.clone(), color:agent.color}]);
onPlanetClick(id);
},[onPlanetClick]);

return (
<>
<color attach="background" args={["#02030a"]}/>
<fog attach="fog" args={["#02030a",80,420]}/>
<ambientLight intensity={0.18}/>
<pointLight position={[0,3,5]} intensity={8} color="#eaffff"/>
<pointLight position={[-5,3,2]} intensity={4} color="#67e8f9"/>
<pointLight position={[5,-3,2]} intensity={4} color="#a78bfa"/>
<CameraController zooming={zooming} zoomAgentId={zoomAgentId}/>
<Stars radius={680} depth={360} count={6200} factor={8.2} saturation={0.8} fade speed={1.05}/>
<BackgroundParticles/>
<FlyingGlowPlanets/>
<NetworkNodes/>
<CentralBrain3D color={activeAgent?.color ?? "#22d3ee"}/>
{galaxyAgents.map((gAgents,gIdx)=>(
<Galaxy key={gIdx} galaxyIndex={gIdx} agents={gAgents} activeId={activeId} onPlanetClick={handlePlanetClick}/>
))}
{shockwaves.map(sw=>(
<Shockwave key={sw.id} position={sw.pos} color={sw.color} onDone={()=>setShockwaves(prev=>prev.filter(s=>s.id!==sw.id))}/>
))}
<EffectComposer>
<Bloom intensity={1.8} luminanceThreshold={0.15} luminanceSmoothing={0.85} kernelSize={KernelSize.LARGE} blendFunction={BlendFunction.ADD} mipmapBlur/>
<Vignette eskil={false} offset={0.22} darkness={0.55} blendFunction={BlendFunction.NORMAL}/>
</EffectComposer>
</>
);
}
// ─── Main Export ──────────────────────────────────────────────────────────────
export default function GenesisUniverse() {
const [activeId, setActiveId] = useState<AgentId>("automation");
const [mouse, setMouse] = useState({x:50,y:50});
const [touchGlow, setTouchGlow] = useState({x:50,y:50,active:false});
const [zooming, setZooming] = useState(false);
const [zoomAgentId, setZoomAgentId] = useState<string|null>(null);
const [burst, setBurst] = useState({id:"core",label:"Genesis Core"});
const [webglReady, setWebglReady] = useState(false);
const zoomTimeoutRef = useRef<ReturnType<typeof setTimeout>|null>(null);
const active = agents.find(a=>a.id===activeId) ?? agents[0]!;
const ActiveIcon = active.icon;

useEffect(()=>{
const move=(e:MouseEvent)=>setMouse({x:(e.clientX/window.innerWidth)*100,y:(e.clientY/window.innerHeight)*100});
window.addEventListener("mousemove",move); return()=>window.removeEventListener("mousemove",move);
},[]);

useEffect(()=>{
const onTouch=(e:TouchEvent)=>{ const t=e.touches[0]; if(!t) return; setTouchGlow({x:(t.clientX/window.innerWidth)*100,y:(t.clientY/window.innerHeight)*100,active:e.type==='touchstart'||e.type==='touchmove'}); };
window.addEventListener('touchstart',onTouch,{passive:true}); window.addEventListener('touchmove',onTouch,{passive:true}); window.addEventListener('touchend',()=>setTouchGlow(v=>({...v,active:false})));
return()=>{ window.removeEventListener('touchstart',onTouch); window.removeEventListener('touchmove',onTouch); };
},[]);

useEffect(()=>{
try{ const c=document.createElement('canvas'); const gl=c.getContext('webgl2')||c.getContext('webgl'); setWebglReady(!!gl); }catch{ setWebglReady(false); }
},[]);

// Zoom to agent: set zooming=true and pass the agent ID to CameraController
// CameraController will then live-track this planet's world position every frame
const zoomToAgent = useCallback((id:string)=>{
const agent=agents.find(a=>a.id===id); if(!agent) return;
setActiveId(id);
setBurst({id,label:agent.name});
setZoomAgentId(id);
setZooming(true);
// Keep zooming active so camera keeps tracking the moving planet
if(zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
zoomTimeoutRef.current=setTimeout(()=>setZooming(false),3500);
},[]);

const resetCamera = useCallback(()=>{
if(zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
setZooming(false); setZoomAgentId(null); setActiveId("automation"); setBurst({id:"core",label:"Genesis Core"});
},[]);

return (
<main className={`portal-shell ${webglReady?"webgl-ready":""}`} style={{ ["--mx" as string]:`${mouse.x}%`, ["--my" as string]:`${mouse.y}%`, ["--active" as string]:active.color }}>
<div className="portal-viewport">
<div className="portrait-guard">
<RotateCcw className="h-12 w-12 text-cyan-200"/>
<h1>请横屏进入 Genesis AI Universe</h1>
<p>这个界面是横屏游戏式星系传送门，旋转手机后可看到完整中心大脑、Agent 星球和导航行星。</p>
</div>

<div className="portal-bg"/>
<div className="flying-orbs" aria-hidden="true">{Array.from({length:16},(_,i)=><span key={i}/>)}</div>
<div className={`touch-glow ${touchGlow.active?"active":""}`} style={{ ["--touch-x" as string]:`${touchGlow.x}%`, ["--touch-y" as string]:`${touchGlow.y}%` }}/>

{webglReady && (
<Canvas className="portal-canvas"
camera={{position:[0,1.2,42],fov:52,near:0.05,far:1200}}
dpr={[1,1.8]}
gl={{antialias:true,alpha:false,powerPreference:"high-performance",toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.2}}
onCreated={({gl})=>{ gl.setPixelRatio(Math.min(window.devicePixelRatio,2)); }}>
<UniverseScene activeId={activeId} zooming={zooming} zoomAgentId={zoomAgentId} onPlanetClick={zoomToAgent}/>
</Canvas>
)}

<div className="core-overexpose" aria-hidden="true"/>
<svg className="portal-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
<defs><filter id="lineGlow"><feGaussianBlur stdDeviation="0.45" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
{agents.map(n=><line key={n.id} x1="50" y1="50" x2={n.hud.x} y2={n.hud.y} stroke={n.color} strokeWidth="0.13" opacity="0.56" filter="url(#lineGlow)"/>)}
</svg>

<header className="portal-briefing">
<span className="live-dot"/><strong>BRIEFING · LIVE</strong><span className="separator">|</span><Clock/><span className="separator">|</span>
<span>GENESIS AI UNIVERSE · 360° ORBIT + PINCH ZOOM</span>
</header>

<div className="scroll-brief">
<p>{activeId==="automation"?"SECTION 00 · 360° ORBIT CAMERA":`SECTION ${String(agents.findIndex(a=>a.id===activeId)+1).padStart(2,"00")} · DEEP SPACE GALAXY`}</p>
<h1>{burst.label}</h1>
<span>{active.description}</span>
</div>

<div className="progress-rail" aria-hidden="true">
{[{id:"core",label:"Genesis Core"},...agents].map(({id,label},idx)=>(
<button key={id} onClick={()=>id==="core"?resetCamera():zoomToAgent(id)} className={activeId===id||(id==="core"&&activeId==="automation")?"active":""}>
<i/><span>{String(idx).padStart(2,"0")}</span>
</button>
))}
</div>

<nav className="side-console" aria-label="Universe navigation">
<button onClick={resetCamera} className="console-btn reset"><RefreshCcw className="h-4 w-4"/>重置</button>
{agents.map(agent=>(
<button key={agent.id} onClick={()=>zoomToAgent(agent.id)} className={`console-btn ${activeId===agent.id?"active":""}`} style={{ ["--node" as string]:agent.color }}>
{agent.name.replace("AI ","")}
</button>
))}
<a className="console-btn portal-link" href="#academy">Academy</a>
<a className="console-btn portal-link" href="#diagnosis">诊断</a>
</nav>

<section className="galaxy-stage" aria-label="Genesis AI Universe portal">
{!webglReady && (
<><div className="orbit-ring orbit-ring-1"/><div className="orbit-ring orbit-ring-2"/><div className="orbit-ring orbit-ring-3"/>
<button className="central-brain" aria-label="Genesis central AI brain"><span className="brain-mesh"/><span className="brain-core-glow"/><BrainCircuit className="brain-icon"/><span className="brain-label">GENESIS<br/>CORE</span></button></>
)}
{agents.map(agent=>{ const Icon=agent.icon; const selected=activeId===agent.id;
return (<button key={agent.id} data-module-id={agent.id} onClick={()=>zoomToAgent(agent.id)} className={`agent-planet ${selected?"selected":""}`} style={{ left:`${agent.hud.x}%`,top:`${agent.hud.y}%`,["--node" as string]:agent.color,["--node-glow" as string]:agent.glow }}><span className="planet-orbit"/><span className="planet-body"><Icon className="h-7 w-7"/></span><span className="planet-label"><strong>{agent.name}</strong><em>{agent.role}</em></span></button>);
})}
{navPlanets.map((planet,idx)=>(
<a key={planet.id} className="nav-asteroid" href={planet.url} style={{ left:`${planet.hud.x}%`,top:`${planet.hud.y}%`,["--node" as string]:planet.color,animationDelay:`${idx*-0.4}s` }}>
<span className="asteroid-dot"/><span className="asteroid-card"><strong>{planet.label}</strong><em>{planet.sub}</em></span>
</a>
))}
<div className="data-block data-block-a">AI ROUTE<br/><span>LEARNING MAP</span></div>
<div className="data-block data-block-b">DEPLOY<br/><span>VERCEL / GITHUB</span></div>
<div className="data-block data-block-c">TOOLS<br/><span>AGENT OS</span></div>
<div className="light-beam beam-a"/><div className="light-beam beam-b"/>
</section>

<AnimatePresence mode="wait">
<motion.div key={burst.id} className="cinematic-burst"
initial={{opacity:0,scale:0.72,filter:"blur(18px)"}} animate={{opacity:[0,1,0.16],scale:[0.72,1.2,1],filter:["blur(18px)","blur(0px)","blur(2px)"]}}
exit={{opacity:0}} transition={{duration:1.1,ease:"easeOut"}}>{burst.label}
</motion.div>
</AnimatePresence>

<AnimatePresence mode="wait">
<motion.aside key={active.id} className="agent-dossier"
initial={{opacity:0,y:18,scale:0.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:10,scale:0.98}} transition={{duration:0.24}}>
<div className="dossier-icon" style={{color:active.color,background:`${active.color}22`}}><ActiveIcon/></div>
<div><p>SELECTED AGENT</p><h2>{active.name}</h2><span>{active.role}</span></div>
<p className="dossier-desc">{active.description}</p>
<a href={active.url} className="dossier-link">进入这个星球 <ExternalLink className="h-4 w-4"/></a>
</motion.aside>
</AnimatePresence>

<footer className="agent-dock" aria-label="Agent selector">
{agents.map(agent=>(<button key={agent.id} onClick={()=>zoomToAgent(agent.id)} className={activeId===agent.id?"active":""} style={{ ["--node" as string]:agent.color }}>{agent.name}</button>))}
</footer>

<div className="scanline"/>
<div className="corner-hud corner-a"><Sparkles className="h-4 w-4"/>SYSTEM ONLINE</div>
<div className="corner-hud corner-b"><Satellite className="h-4 w-4"/>3 GALAXIES · 12 PLANETS · 48 MOONS</div>
<div className="corner-hud corner-c"><Zap className="h-4 w-4"/>360° DRAG · ZOOM · CLICK TO ZOOM IN</div>
</div>

<div className="scroll-sectors" aria-hidden="true">
{[{id:"genesis-core",label:"Genesis Core"},...agents.map(a=>({id:`ai-${a.id}`,label:a.name}))].map(({id,label},idx)=>(
<section key={id} id={id} className="scroll-sector"><div><span>{String(idx).padStart(2,"0")}</span><strong>{label}</strong></div></section>
))}
</div>
</main>
);
}