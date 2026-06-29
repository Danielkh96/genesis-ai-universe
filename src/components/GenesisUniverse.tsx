"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, Html, Line } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { KernelSize, BlendFunction } from "postprocessing";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, BrainCircuit, Code2, ExternalLink, Megaphone, RefreshCcw, RotateCcw, Satellite, Sparkles, Workflow, Zap } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type AgentId = string;
type Agent = { id: AgentId; name: string; short: string; role: string; color: string; glow: string; icon: typeof Workflow; orbitRadius: number; orbitSpeed: number; orbitAngle: number; orbitTilt: [number, number, number]; galaxy: 0|1|2; hud: {x:number;y:number}; url: string; description: string; };
type NavPlanet = { id: string; label: string; sub: string; color: string; hud: {x:number;y:number}; url: string };

const agents: Agent[] = [
{ id:"automation",name:"AI Automation",short:"AUTO",role:"èªå¨åæµç¨æç³»",color:"#22d3ee",glow:"rgba(34,211,238,.82)",icon:Workflow,orbitRadius:20,orbitSpeed:0.18,orbitAngle:0,orbitTilt:[0.28,0,0.18],galaxy:0,hud:{x:20,y:26},url:"#ai-automation",description:"è¡¨æ ¼ãAPIãç¤¾ç¾¤ãCRM ä¸ OpenClaw å·¥ä½æµèªå¨è¿æ¥ã"},
{ id:"sheets",name:"Sheets Engine",short:"SHEET",role:"èµæåæ­¥è¡æ",color:"#34d399",glow:"rgba(52,211,153,.8)",icon:Workflow,orbitRadius:20,orbitSpeed:0.18,orbitAngle:Math.PI/2,orbitTilt:[0.28,0,0.18],galaxy:0,hud:{x:80,y:27},url:"#ai-sheets",description:"Google Sheetsãèµææ¸æ´ãè®¢åç¶æä¸èªå¨ååç³»ç»ã"},
{ id:"crm",name:"CRM Brain",short:"CRM",role:"å®¢æ·ç»è¥è¡æ",color:"#38bdf8",glow:"rgba(56,189,248,.8)",icon:Bot,orbitRadius:20,orbitSpeed:0.18,orbitAngle:Math.PI,orbitTilt:[0.28,0,0.18],galaxy:0,hud:{x:48,y:81},url:"#ai-crm",description:"å®¢æ·åå±ãè·è¿æéãå¤è´­è·¯å¾ä¸èªå¨ç§è®¯è¾å©ã"},
{ id:"ops",name:"Ops Control",short:"OPS",role:"è¥è¿ä¸­æ§è¡æ",color:"#2dd4bf",glow:"rgba(45,212,191,.78)",icon:Satellite,orbitRadius:20,orbitSpeed:0.18,orbitAngle:Math.PI*1.5,orbitTilt:[0.28,0,0.18],galaxy:0,hud:{x:50,y:17},url:"#ai-ops",description:"ææµç¨ãä»»å¡ãéç¥ãç¶æçæ§éä¸­å°ä¸ä¸ªèªå¨åä¸­æ§å°ã"},
{ id:"marketing",name:"AI Marketing",short:"MKT",role:"å¢é¿è¥éæç³»",color:"#f472b6",glow:"rgba(244,114,182,.82)",icon:Megaphone,orbitRadius:36,orbitSpeed:-0.12,orbitAngle:0,orbitTilt:[0.42,0.18,-0.12],galaxy:1,hud:{x:88,y:37},url:"#ai-marketing",description:"çæ¬¾ Hookãå¹¿åå¾ãåå®¹ç©éµãç­å½±é³èæ¬ä¸è¥éæ¼æã"},
{ id:"content",name:"Content Studio",short:"POST",role:"åå®¹çäº§è¡æ",color:"#fb7185",glow:"rgba(251,113,133,.82)",icon:Megaphone,orbitRadius:36,orbitSpeed:-0.12,orbitAngle:Math.PI*0.67,orbitTilt:[0.42,0.18,-0.12],galaxy:1,hud:{x:12,y:37},url:"#ai-content",description:"æåååç¹è½¬æç¤¾ç¾¤è´´æãå¹¿åèæ¬ãç­å½±é³ä¸å¾ååæã"},
{ id:"ads",name:"Ad Galaxy",short:"ADS",role:"å¹¿åç´ æè¡æ",color:"#fbbf24",glow:"rgba(251,191,36,.82)",icon:Sparkles,orbitRadius:36,orbitSpeed:-0.12,orbitAngle:Math.PI*1.33,orbitTilt:[0.42,0.18,-0.12],galaxy:1,hud:{x:73,y:82},url:"#ai-ads",description:"çæé«ç¹å»å¹¿åå¾ãæ é¢ãCTA ä¸å¤çæ¬ A/B æµè¯ç´ æã"},
{ id:"funnel",name:"Funnel Core",short:"FUNNEL",role:"éå®æ¼æè¡æ",color:"#e879f9",glow:"rgba(232,121,249,.8)",icon:Zap,orbitRadius:36,orbitSpeed:-0.12,orbitAngle:Math.PI*2.0,orbitTilt:[0.42,0.18,-0.12],galaxy:1,hud:{x:27,y:82},url:"#ai-funnel",description:"ä»æåãç¹å»ãè¯¢é®ãæäº¤å°å¤è´­çå®æ´è½¬åè·¯å¾ã"},
{ id:"agent",name:"AI Agent",short:"AGENT",role:"æºè½ä»£çæç³»",color:"#a78bfa",glow:"rgba(167,139,250,.82)",icon:Bot,orbitRadius:58,orbitSpeed:0.075,orbitAngle:0,orbitTilt:[-0.28,-0.25,0.22],galaxy:2,hud:{x:88,y:56},url:"#ai-agent",description:"è®© AI ä¼æèãè°ç¨å·¥å·ãæä»»å¡ï¼å¹¶æä¸ºä¸å¡æ§è¡å©æã"},
{ id:"coding",name:"AI Coding",short:"CODE",role:"äº§åæå»ºæç³»",color:"#60a5fa",glow:"rgba(96,165,250,.82)",icon:Code2,orbitRadius:58,orbitSpeed:0.075,orbitAngle:Math.PI*0.5,orbitTilt:[-0.28,-0.25,0.22],galaxy:2,hud:{x:12,y:56},url:"#ai-coding",description:"ç¨ AI å»ºç½ç«ãå·¥å·ãAppãèªå¨åç³»ç»ï¼å¹¶é¨ç½²ä¸çº¿ã"},
{ id:"deploy",name:"Deploy Portal",short:"LIVE",role:"ä¸çº¿é¨ç½²è¡æ",color:"#c084fc",glow:"rgba(192,132,252,.82)",icon:ExternalLink,orbitRadius:58,orbitSpeed:0.075,orbitAngle:Math.PI,orbitTilt:[-0.28,-0.25,0.22],galaxy:2,hud:{x:70,y:16},url:"#ai-deploy",description:"GitHubãVercelãä¸çº¿æ£æ¥ãçæ¬åæ»ä¸äº§ååå¸æµç¨ã"},
{ id:"data",name:"Data Vault",short:"DATA",role:"ç¥è¯èµæè¡æ",color:"#ffffff",glow:"rgba(255,255,255,.86)",icon:BrainCircuit,orbitRadius:58,orbitSpeed:0.075,orbitAngle:Math.PI*1.5,orbitTilt:[-0.28,-0.25,0.22],galaxy:2,hud:{x:30,y:16},url:"#ai-data",description:"æ²æ·ç¥è¯åºãæä½ SOPãè®­ç»èµæä¸å¯å¤ç¨èªå¨åèµäº§ã"},
];

const navPlanets: NavPlanet[] = [
{ id:"academy",label:"Academy",sub:"è¯¾ç¨å¥å£",color:"#38bdf8",hud:{x:14,y:44},url:"#academy"},
{ id:"projects",label:"Projects",sub:"å®æä½å",color:"#c084fc",hud:{x:86,y:44},url:"#projects"},
{ id:"templates",label:"Templates",sub:"æ¨¡æ¿åº",color:"#34d399",hud:{x:16,y:60},url:"#templates"},
{ id:"community",label:"Community",sub:"å­¦ä¹ ç¤¾ç¾¤",color:"#fb7185",hud:{x:84,y:60},url:"#community"},
{ id:"roadmap",label:"Roadmap",sub:"è·¯çº¿å¾",color:"#60a5fa",hud:{x:38,y:14},url:"#roadmap"},
{ id:"diagnosis",label:"Diagnosis",sub:"AI è¯æ­",color:"#f97316",hud:{x:62,y:14},url:"#diagnosis"},
{ id:"vault",label:"Vault",sub:"èµæºåº",color:"#2dd4bf",hud:{x:39,y:88},url:"#vault"},
{ id:"launch",label:"Launch",sub:"ä¸çº¿é¨ç½²",color:"#e879f9",hud:{x:61,y:88},url:"#launch"},
];

const planetWorldPositions = new Map<string, THREE.Vector3>();

function Clock() {
const [time, setTime] = useState("00:00:00");
useEffect(() => {
const tick = () => setTime(new Intl.DateTimeFormat("zh-CN",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false}).format(new Date()));
tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
}, []);
return <span suppressHydrationWarning>{time}</span>;
}

function Shockwave({ position, color, onDone }: { position: THREE.Vector3; color: string; onDone: () => void }) {
const mesh = useRef<THREE.Mesh>(null); const mat = useRef<THREE.MeshBasicMaterial>(null); const t = useRef(0);
useFrame((_, delta) => {
t.current = Math.min(t.current + delta*1.1, 1);
if (mesh.current) mesh.current.scale.setScalar(1 + t.current*5.5);
if (mat.current) mat.current.opacity = (1-t.current)*0.9;
if (t.current >= 1) onDone();
});
return (<mesh ref={mesh} position={position}><ringGeometry args={[0.8,1.2,64]}/><meshBasicMaterial ref={mat} color={color} transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide}/></mesh>);
}

// ââ CameraController ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function CameraController({ zoomAgentId }: { zoomAgentId: string | null }) {
const { camera } = useThree();
const pos = useRef(new THREE.Vector3(0, 1.2, 42));
const look = useRef(new THREE.Vector3(0, 0, 0));
const theta = useRef(0.65);
const phi = useRef(0.18);
const velTheta = useRef(0);
const velPhi = useRef(0);
const zoomLevel = useRef(1);
const velZoom = useRef(0);
const dragging = useRef(false);
const lastMouse = useRef({ x: 0, y: 0 });
const prevZoomId = useRef<string | null>(null);
const fovRef = useRef(52);

useEffect(() => {
const onWheel = (e: WheelEvent) => {
e.preventDefault();
if (!zoomAgentId) { velZoom.current -= e.deltaY * 0.0003; velTheta.current -= e.deltaX * 0.0003; }
};
const onDown = (e: MouseEvent) => {
if ((e.target as HTMLElement)?.closest?.("button,a")) return;
dragging.current = true; lastMouse.current = { x: e.clientX, y: e.clientY };
};
const onMove = (e: MouseEvent) => {
if (!dragging.current || zoomAgentId) return;
const dx = e.clientX - lastMouse.current.x; const dy = e.clientY - lastMouse.current.y;
lastMouse.current = { x: e.clientX, y: e.clientY };
velTheta.current -= dx * 0.007; velPhi.current -= dy * 0.005;
};
const onUp = () => { dragging.current = false; };
const onTouch = (e: TouchEvent) => {
if (e.touches.length !== 1) return;
const t = e.touches[0]!;
if (e.type === "touchstart") { dragging.current = true; lastMouse.current = { x: t.clientX, y: t.clientY }; }
if (e.type === "touchmove" && !zoomAgentId) {
e.preventDefault();
const dx = t.clientX - lastMouse.current.x; const dy = t.clientY - lastMouse.current.y;
lastMouse.current = { x: t.clientX, y: t.clientY };
velTheta.current -= dx * 0.007; velPhi.current -= dy * 0.005;
}
if (e.type === "touchend") dragging.current = false;
};
window.addEventListener("wheel", onWheel, { passive: false });
window.addEventListener("mousedown", onDown);
window.addEventListener("mousemove", onMove);
window.addEventListener("mouseup", onUp);
window.addEventListener("touchstart", onTouch, { passive: true });
window.addEventListener("touchmove", onTouch, { passive: false });
window.addEventListener("touchend", onTouch);
return () => {
window.removeEventListener("wheel", onWheel);
window.removeEventListener("mousedown", onDown);
window.removeEventListener("mousemove", onMove);
window.removeEventListener("mouseup", onUp);
window.removeEventListener("touchstart", onTouch);
window.removeEventListener("touchmove", onTouch);
window.removeEventListener("touchend", onTouch);
};
}, [zoomAgentId]);

useFrame((state, delta) => {
const cam = state.camera as THREE.PerspectiveCamera;
if (zoomAgentId) {
const p = planetWorldPositions.get(zoomAgentId);
if (p && p.lengthSq() > 0.01) {
const outward = p.clone().normalize();
const upPerp = new THREE.Vector3(0,1,0);
upPerp.sub(outward.clone().multiplyScalar(upPerp.dot(outward))).normalize();
// Camera sits 5 units beyond planet from origin + slight elevation
const desired = p.clone().sub(outward.clone().multiplyScalar(5)).add(upPerp.multiplyScalar(1.2));
const isNewTarget = prevZoomId.current !== zoomAgentId;
if (isNewTarget) {
prevZoomId.current = zoomAgentId;
pos.current.copy(desired);
fovRef.current = 52;
} else {
pos.current.lerp(desired, Math.min(1, delta * 15));
}
cam.position.copy(pos.current);
// lookAt the planet - must updateMatrixWorld for R3F to use it
cam.lookAt(p.x, p.y, p.z);
cam.updateMatrixWorld(true);
// Narrow FOV telephoto effect
fovRef.current += (12 - fovRef.current) * Math.min(1, delta * 5);
cam.fov = fovRef.current;
cam.updateProjectionMatrix();
}
} else {
prevZoomId.current = null;
fovRef.current += (52 - fovRef.current) * Math.min(1, delta * 5);
cam.fov = fovRef.current;
cam.updateProjectionMatrix();
theta.current += velTheta.current + delta * 0.06;
phi.current = Math.max(-1.1, Math.min(1.1, phi.current + velPhi.current));
velTheta.current *= 0.88; velPhi.current *= 0.88;
zoomLevel.current = Math.max(0.06, Math.min(18, zoomLevel.current + velZoom.current));
velZoom.current *= 0.88;
const r = 42 / zoomLevel.current;
const desired = new THREE.Vector3(
Math.cos(theta.current) * Math.cos(phi.current) * r,
Math.sin(phi.current) * r,
Math.sin(theta.current) * Math.cos(phi.current) * r
);
pos.current.lerp(desired, 0.08);
look.current.lerp(new THREE.Vector3(0,0,0), 0.08);
cam.position.copy(pos.current);
cam.lookAt(look.current);
cam.updateMatrixWorld(true);
}
});
return null;
}

const brainVert=`varying vec3 vNormal;varying vec3 vPosition;varying vec2 vUv;void main(){vNormal=normalize(normalMatrix*normal);vPosition=position;vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
const brainFrag=`uniform float uTime;uniform vec3 uColor;varying vec3 vNormal;varying vec3 vPosition;varying vec2 vUv;float hexGrid(vec2 p,float scale){p*=scale;vec2 r=vec2(1.0,1.732);vec2 h=r*0.5;vec2 a=mod(p,r)-h;vec2 b=mod(p-h,r)-h;vec2 gv=dot(a,a)<dot(b,b)?a:b;return smoothstep(0.44,0.46,length(gv));}void main(){float fresnel=pow(1.0-abs(dot(vNormal,vec3(0.0,0.0,1.0))),2.8);vec2 suv=vec2(atan(vPosition.z,vPosition.x)/(2.0*3.14159)+0.5,asin(vPosition.y/length(vPosition))/3.14159+0.5);float grid=max(hexGrid(suv+vec2(uTime*0.02,0.0),8.0),hexGrid(suv*1.618+vec2(0.0,uTime*0.015),5.0)*0.6);float pulse=sin(length(vPosition)/2.72*6.28-uTime*2.0)*0.175+0.175;vec3 base=mix(uColor,vec3(1.0),0.55);vec3 rim=mix(vec3(0.4,0.9,1.0),base,0.5);vec3 col=base*grid*(0.7+pulse*0.3)+rim*fresnel*1.8+vec3(0.6,1.0,1.0)*pulse*0.25;gl_FragColor=vec4(col,clamp(max(grid*0.92,fresnel*0.85),0.0,1.0));}`;

function CentralBrain3D({color}:{color:string}){
const brain=useRef<THREE.Group>(null);const shader=useRef<THREE.ShaderMaterial>(null);
const o0=useRef<THREE.Group>(null);const o1=useRef<THREE.Group>(null);const o2=useRef<THREE.Group>(null);const o3=useRef<THREE.Group>(null);
const sparks=useRef<THREE.Group>(null);const innerGlow=useRef<THREE.Mesh>(null);
const mat=useMemo(()=>new THREE.ShaderMaterial({vertexShader:brainVert,fragmentShader:brainFrag,uniforms:{uTime:{value:0},uColor:{value:new THREE.Color(color)}},transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.FrontSide}),[]);
useFrame(({clock})=>{
const t=clock.getElapsedTime();
if(brain.current){brain.current.rotation.y=t*0.28;brain.current.rotation.x=Math.sin(t*0.38)*0.14;}
if(shader.current){shader.current.uniforms.uTime.value=t;shader.current.uniforms.uColor.value.set(color);}
if(innerGlow.current)innerGlow.current.scale.setScalar(1+Math.sin(t*3.2)*0.085);
if(o0.current)o0.current.rotation.z=t*0.95;if(o1.current)o1.current.rotation.y=-t*0.74;
if(o2.current)o2.current.rotation.x=t*0.58;if(o3.current)o3.current.rotation.z=-t*0.38;
if(sparks.current){sparks.current.rotation.y=t*1.15;sparks.current.rotation.z=-t*0.52;}
});
return(<group ref={brain}>
<mesh><sphereGeometry args={[6.8,64,64]}/><meshBasicMaterial color={color} transparent opacity={0.055} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
<mesh><sphereGeometry args={[5.2,64,64]}/><meshBasicMaterial color="#67e8f9" transparent opacity={0.07} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
<mesh><sphereGeometry args={[4.45,96,96]}/><meshBasicMaterial color={color} transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
<mesh><icosahedronGeometry args={[2.72,5]}/><primitive object={mat} ref={shader}/></mesh>
<mesh ref={innerGlow}><sphereGeometry args={[2.08,128,128]}/><meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={14} roughness={0.01} metalness={0.18} transparent opacity={0.78}/></mesh>
<mesh><sphereGeometry args={[1.4,64,64]}/><meshBasicMaterial color="#fff" transparent opacity={0.92} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
<group ref={o0} rotation={[0.66,0.08,0.15]}><mesh><torusGeometry args={[4.05,0.026,18,320]}/><meshBasicMaterial color="#67e8f9" transparent opacity={0.92} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh><mesh position={[4.05,0,0]}><sphereGeometry args={[0.095,22,22]}/><meshBasicMaterial color="#fff" transparent opacity={1} blending={THREE.AdditiveBlending}/></mesh></group>
<group ref={o1} rotation={[1.15,0.5,0.8]}><mesh><torusGeometry args={[5.25,0.018,18,360]}/><meshBasicMaterial color="#c084fc" transparent opacity={0.72} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh><mesh position={[-5.25,0,0]}><sphereGeometry args={[0.07,18,18]}/><meshBasicMaterial color="#f0abfc" transparent opacity={0.95} blending={THREE.AdditiveBlending}/></mesh></group>
<group ref={o2} rotation={[0.2,1.28,0.35]}><mesh><torusGeometry args={[6.35,0.014,18,380]}/><meshBasicMaterial color="#f472b6" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh><mesh position={[0,6.35,0]}><sphereGeometry args={[0.06,18,18]}/><meshBasicMaterial color="#fff" transparent opacity={0.9} blending={THREE.AdditiveBlending}/></mesh></group>
<group ref={o3} rotation={[1.35,-0.55,0.1]}><mesh><torusGeometry args={[7.35,0.01,18,420]}/><meshBasicMaterial color="#fff" transparent opacity={0.33} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh></group>
<group ref={sparks}>{Array.from({length:42},(_,i)=>{const a=(i/72)*Math.PI*2;const r=3.05+(i%7)*0.48;return(<mesh key={i} position={[Math.cos(a)*r,Math.sin(a*1.4)*1.85,Math.sin(a)*r*0.62]}><sphereGeometry args={[0.025+(i%4)*0.013,10,10]}/><meshBasicMaterial color={i%3===0?"#fff":i%3===1?"#67e8f9":color} transparent opacity={0.95} blending={THREE.AdditiveBlending}/></mesh>);})}</group>
<pointLight color="#fff" intensity={28} distance={26}/><pointLight color={color} intensity={24} distance={28}/>
<pointLight position={[0,0,4.5]} color="#67e8f9" intensity={14} distance={20}/><pointLight position={[0,0,-4.5]} color="#f0abfc" intensity={9} distance={18}/>
</group>);
}
function ConnectionLine({to,color,active}:{to:THREE.Vector3;color:string;active:boolean}){
const pts=useMemo(()=>{const m=to.clone().multiplyScalar(0.45);m.z+=0.5;return[new THREE.Vector3(0,0,0),m,to];},[to]);
return<Line points={pts} color={color} lineWidth={active?1.8:0.7} transparent opacity={active?0.78:0.28} dashed={!active} dashSize={0.8} gapSize={0.4}/>;
}
function PlanetLabel({name,role,color,active}:{name:string;role:string;color:string;active:boolean}){
return(<div style={{pointerEvents:"none",textAlign:"center",whiteSpace:"nowrap",fontFamily:"'Geist',Arial,sans-serif"}}>
<div style={{display:"inline-block",position:"relative",background:active?"linear-gradient(135deg,rgba(2,8,23,.92),rgba(8,16,36,.88))":"rgba(2,8,23,.72)",border:`1px solid ${color}${active?"cc":"55"}`,borderRadius:10,padding:active?"7px 12px":"5px 9px",backdropFilter:"blur(14px)",boxShadow:active?`0 0 24px ${color}60,0 0 48px ${color}28`:`0 0 14px ${color}30`,transition:"all .3s"}}>
{active&&(<><div style={{position:"absolute",top:2,left:2,width:6,height:6,borderTop:`1px solid ${color}`,borderLeft:`1px solid ${color}`,borderRadius:"2px 0 0 0"}}/><div style={{position:"absolute",top:2,right:2,width:6,height:6,borderTop:`1px solid ${color}`,borderRight:`1px solid ${color}`,borderRadius:"0 2px 0 0"}}/><div style={{position:"absolute",bottom:2,left:2,width:6,height:6,borderBottom:`1px solid ${color}`,borderLeft:`1px solid ${color}`,borderRadius:"0 0 0 2px"}}/><div style={{position:"absolute",bottom:2,right:2,width:6,height:6,borderBottom:`1px solid ${color}`,borderRight:`1px solid ${color}`,borderRadius:"0 0 2px 0"}}/></>)}
<div style={{color,fontSize:active?11:10,fontWeight:900,letterSpacing:".18em",textShadow:`0 0 12px ${color},0 0 24px ${color}80`,marginBottom:2}}>{name}</div>
<div style={{color:"rgba(186,230,253,.72)",fontSize:8,letterSpacing:".06em"}}>{role}</div>
{active&&(<div style={{marginTop:5,paddingTop:4,borderTop:`1px solid ${color}40`,display:"flex",alignItems:"center",gap:5,justifyContent:"center"}}><div style={{width:5,height:5,borderRadius:"50%",background:color,boxShadow:`0 0 8px ${color}`}}/><span style={{color,fontSize:8,fontWeight:800,letterSpacing:".2em"}}>ACTIVE</span></div>)}
</div>
<div style={{width:1,height:active?14:10,background:`linear-gradient(to bottom,${color}80,transparent)`,margin:"0 auto"}}/>
</div>);
}
function AgentPlanet3D({agent,active,onClick}:{agent:Agent;active:boolean;onClick:()=>void}){
const group=useRef<THREE.Group>(null);const planet=useRef<THREE.Mesh>(null);
const moons=useRef<THREE.Group>(null);const angle=useRef(agent.orbitAngle);const wp=useRef(new THREE.Vector3());
useFrame(({clock},delta)=>{
const t=clock.getElapsedTime();
angle.current+=agent.orbitSpeed*delta;
const r=agent.orbitRadius;
if(group.current){group.current.position.set(Math.cos(angle.current)*r,Math.sin(angle.current*1.3)*r*0.18,Math.sin(angle.current)*r);group.current.rotation.y=t*0.22;group.current.getWorldPosition(wp.current);planetWorldPositions.set(agent.id,wp.current.clone());}
if(planet.current)planet.current.rotation.y=t*0.78;
if(moons.current){moons.current.rotation.y=t*(active?1.38:0.98);moons.current.rotation.z=Math.sin(t*0.42)*0.28;}
});
useEffect(()=>()=>{planetWorldPositions.delete(agent.id);},[agent.id]);
const sz=active?0.88:0.64;
return(<group ref={group}>
<mesh onClick={e=>{e.stopPropagation();onClick();}} onPointerOver={()=>{document.body.style.cursor="pointer";}} onPointerOut={()=>{document.body.style.cursor="";}}><sphereGeometry args={[sz*2.6,32,32]}/><meshBasicMaterial color={agent.color} transparent opacity={0} depthWrite={false}/></mesh>
<mesh><sphereGeometry args={[sz*2.4,48,48]}/><meshBasicMaterial color={agent.color} transparent opacity={active?0.1:0.06} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
<mesh><sphereGeometry args={[sz*1.7,48,48]}/><meshBasicMaterial color={agent.color} transparent opacity={active?0.22:0.12} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
<mesh ref={planet}><sphereGeometry args={[sz,64,64]}/><meshStandardMaterial color={agent.color} emissive={agent.color} emissiveIntensity={active?8.5:4.8} metalness={0.55} roughness={0.12}/></mesh>
<mesh rotation={[Math.PI/2.1,0,0]}><torusGeometry args={[sz*1.72,0.016,18,180]}/><meshBasicMaterial color={agent.color} transparent opacity={active?0.98:0.52} blending={THREE.AdditiveBlending}/></mesh>
<mesh rotation={[0.7,0.35,0.2]}><torusGeometry args={[sz*2.4,0.008,18,190]}/><meshBasicMaterial color={agent.color} transparent opacity={active?0.62:0.24} blending={THREE.AdditiveBlending}/></mesh>
<group ref={moons} rotation={[0.45,0.15,0.2]}>{Array.from({length:4},(_,i)=>{const a=(i/4)*Math.PI*2;const mr=(active?sz*2.5:sz*2.0)+(i%2)*0.2;return(<group key={i} rotation={[i*0.32,a,i*0.18]}><mesh position={[Math.cos(a)*mr,Math.sin(a*1.6)*0.34,Math.sin(a)*mr]}><sphereGeometry args={[active?0.13:0.09,18,18]}/><meshBasicMaterial color={i%2===0?"#fff":agent.color} transparent opacity={0.92} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh></group>);})}</group>
<pointLight color={agent.color} intensity={active?14:7} distance={10}/>
<Html distanceFactor={20} center style={{pointerEvents:"none",transform:"translateY(60px)"}}><PlanetLabel name={agent.name} role={agent.role} color={agent.color} active={active}/></Html>
</group>);
}
function Galaxy({galaxyIndex,agents:ga,activeId,onPlanetClick}:{galaxyIndex:number;agents:Agent[];activeId:string;onPlanetClick:(id:string)=>void}){
const group=useRef<THREE.Group>(null);
const r=galaxyIndex===0?20:galaxyIndex===1?36:58;const ringColor=galaxyIndex===0?"#67e8f9":galaxyIndex===1?"#f472b6":"#a78bfa";
const tilt=ga[0]?.orbitTilt??[0,0,0];const rotSpeed=galaxyIndex===0?0.022:galaxyIndex===1?-0.016:0.011;
useFrame(({clock})=>{if(group.current)group.current.rotation.y=clock.getElapsedTime()*rotSpeed;});
return(<group ref={group} rotation={tilt as [number,number,number]}>
<mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[r,0.032,16,280]}/><meshBasicMaterial color={ringColor} transparent opacity={0.32} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh>
{ga.map(a=><ConnectionLine key={"l"+a.id} to={new THREE.Vector3(a.orbitRadius,0,0)} color={a.color} active={activeId===a.id}/>)}
{ga.map(a=><AgentPlanet3D key={a.id} agent={a} active={activeId===a.id} onClick={()=>onPlanetClick(a.id)}/>)}
</group>);
}
function BackgroundParticles(){
const g=useRef<THREE.Group>(null);
const mk=(n:number,rMin:number,rMax:number)=>{const geo=new THREE.BufferGeometry();const pos=new Float32Array(n*3);for(let i=0;i<n;i++){const r=rMin+Math.random()*(rMax-rMin),th=Math.random()*Math.PI*2,ph=(Math.random()-0.5)*Math.PI;pos[i*3]=Math.cos(th)*Math.cos(ph)*r;pos[i*3+1]=Math.sin(ph)*r;pos[i*3+2]=Math.sin(th)*Math.cos(ph)*r;}geo.setAttribute("position",new THREE.BufferAttribute(pos,3));return geo;};
const geo1=useMemo(()=>mk(1200,200,800),[]);const geo2=useMemo(()=>mk(800,400,800),[]);const geo3=useMemo(()=>mk(600,600,1200),[]);
useFrame(({clock})=>{const t=clock.getElapsedTime();if(g.current){(g.current.children[0] as THREE.Points).rotation.y=t*0.012;(g.current.children[1] as THREE.Points).rotation.y=-t*0.008;(g.current.children[2] as THREE.Points).rotation.x=t*0.005;}});
return(<group ref={g}><points geometry={geo1}><pointsMaterial size={1.8} color="#fff" transparent opacity={0.65} sizeAttenuation/></points><points geometry={geo2}><pointsMaterial size={2.4} color="#67e8f9" transparent opacity={0.38} sizeAttenuation/></points><points geometry={geo3}><pointsMaterial size={1.6} color="#a78bfa" transparent opacity={0.28} sizeAttenuation/></points></group>);
}
function FlyingGlowPlanets(){
const g=useRef<THREE.Group>(null);
const fl=useMemo(()=>Array.from({length:28},(_,i)=>({radius:0.045+(i%5)*0.018,speed:0.15+(i%6)*0.035,phase:i*1.71,y:-7.5+(i%4)*3.6+Math.sin(i)*0.65,z:-18-(i%7)*2.4,spread:30+(i%6)*4.5,color:i%4===0?"#67e8f9":i%4===1?"#a78bfa":i%4===2?"#f472b6":"#fff"})),[]);
useFrame(({clock})=>{const t=clock.getElapsedTime();if(g.current)g.current.children.forEach((c,i)=>{const f=fl[i];if(!f)return;const tr=((t*f.speed+f.phase)%1)*2-1;c.position.set(tr*f.spread,f.y+Math.sin(t*0.8+f.phase)*0.35,f.z+Math.cos(t*0.45+f.phase)*0.8);});});
return(<group ref={g}>{fl.map((f,i)=>(<group key={i}><mesh><sphereGeometry args={[f.radius*5.2,18,18]}/><meshBasicMaterial color={f.color} transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh><mesh><sphereGeometry args={[f.radius,16,16]}/><meshBasicMaterial color={f.color} transparent opacity={0.82} blending={THREE.AdditiveBlending} depthWrite={false}/></mesh></group>))}</group>);
}
function NetworkNodes(){
const g=useRef<THREE.Group>(null);
const{nodes,lp}=useMemo(()=>{const nodes=Array.from({length:160},(_,i)=>{const a=(i*2.399963)%(Math.PI*2),r=18+((i*17)%100)/100*68,y=Math.sin(i*1.37)*22;return{p:new THREE.Vector3(Math.cos(a)*r,y,Math.sin(a)*r*0.9-16),s:0.018+(i%5)*0.008,color:i%5===0?"#fb7185":i%5===1?"#fbbf24":i%5===2?"#a78bfa":"#67e8f9"};});const v:number[]=[];nodes.forEach((n,i)=>{const nx=nodes[(i+13)%nodes.length]!;if(n.p.distanceTo(nx.p)<22||i%7===0)v.push(n.p.x,n.p.y,n.p.z,nx.p.x,nx.p.y,nx.p.z);});return{nodes,lp:new Float32Array(v)};},[]);
useFrame(({clock})=>{if(g.current){g.current.rotation.y=clock.getElapsedTime()*0.022;g.current.rotation.z=Math.sin(clock.getElapsedTime()*0.1)*0.06;}});
return(<group ref={g}><lineSegments><bufferGeometry><bufferAttribute attach="attributes-position" args={[lp,3]}/></bufferGeometry><lineBasicMaterial color="#67e8f9" transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false}/></lineSegments>{nodes.map((n,i)=>(<mesh key={i} position={n.p}><sphereGeometry args={[n.s,8,8]}/><meshBasicMaterial color={n.color} transparent opacity={0.75} blending={THREE.AdditiveBlending}/></mesh>))}</group>);
}

type SW={id:string;pos:THREE.Vector3;color:string};
function UniverseScene({activeId,zoomAgentId,onPlanetClick}:{activeId:string;zoomAgentId:string|null;onPlanetClick:(id:string)=>void}){
const galaxyAgents=useMemo(()=>[0,1,2].map(g=>agents.filter(a=>a.galaxy===g)),[]);
const[shockwaves,setShockwaves]=useState<SW[]>([]);
const activeAgent=agents.find(a=>a.id===activeId);
const handleClick=useCallback((id:string)=>{
const agent=agents.find(a=>a.id===id);if(!agent)return;
const worldPos=planetWorldPositions.get(id)??new THREE.Vector3(agent.orbitRadius,0,0);
setShockwaves(prev=>[...prev,{id:id+Date.now(),pos:worldPos.clone(),color:agent.color}]);
onPlanetClick(id);
},[onPlanetClick]);
return(<>
<color attach="background" args={["#02030a"]}/><fog attach="fog" args={["#02030a",80,420]}/>
<ambientLight intensity={0.18}/><pointLight position={[0,3,5]} intensity={8} color="#eaffff"/>
<pointLight position={[-5,3,2]} intensity={4} color="#67e8f9"/><pointLight position={[5,-3,2]} intensity={4} color="#a78bfa"/>
<CameraController zoomAgentId={zoomAgentId}/>
<Stars radius={680} depth={360} count={6200} factor={8.2} saturation={0.8} fade speed={1.05}/>
<BackgroundParticles/><FlyingGlowPlanets/><NetworkNodes/>
<CentralBrain3D color={activeAgent?.color??"#22d3ee"}/>
{galaxyAgents.map((ga,gi)=><Galaxy key={gi} galaxyIndex={gi} agents={ga} activeId={activeId} onPlanetClick={handleClick}/>)}
{shockwaves.map(sw=><Shockwave key={sw.id} position={sw.pos} color={sw.color} onDone={()=>setShockwaves(p=>p.filter(s=>s.id!==sw.id))}/>)}
<EffectComposer><Bloom intensity={1.8} luminanceThreshold={0.15} luminanceSmoothing={0.85} kernelSize={KernelSize.LARGE} blendFunction={BlendFunction.ADD} mipmapBlur/><Vignette eskil={false} offset={0.22} darkness={0.55} blendFunction={BlendFunction.NORMAL}/></EffectComposer>
</>);
}
export default function GenesisUniverse(){
const[activeId,setActiveId]=useState<AgentId>("automation");
const[zoomAgentId,setZoomAgentId]=useState<string|null>(null);
const[mouse,setMouse]=useState({x:50,y:50});
const[touchGlow,setTouchGlow]=useState({x:50,y:50,active:false});
const[burst,setBurst]=useState({id:"core",label:"Genesis Core"});
const[webglReady,setWebglReady]=useState(false);
const active=agents.find(a=>a.id===activeId)??agents[0]!;
const ActiveIcon=active.icon;
useEffect(()=>{const fn=(e:MouseEvent)=>setMouse({x:(e.clientX/window.innerWidth)*100,y:(e.clientY/window.innerHeight)*100});window.addEventListener("mousemove",fn);return()=>window.removeEventListener("mousemove",fn);},[]);
useEffect(()=>{const fn=(e:TouchEvent)=>{const t=e.touches[0];if(!t)return;setTouchGlow({x:(t.clientX/window.innerWidth)*100,y:(t.clientY/window.innerHeight)*100,active:e.type!=="touchend"});};window.addEventListener("touchstart",fn,{passive:true});window.addEventListener("touchmove",fn,{passive:true});window.addEventListener("touchend",fn);return()=>{window.removeEventListener("touchstart",fn);window.removeEventListener("touchmove",fn);window.removeEventListener("touchend",fn);};},[]);
useEffect(()=>{try{const c=document.createElement("canvas");setWebglReady(!!(c.getContext("webgl2")||c.getContext("webgl")));}catch{setWebglReady(false);}},[]);
const zoomToAgent=useCallback((id:string)=>{const agent=agents.find(a=>a.id===id);if(!agent)return;setActiveId(id);setZoomAgentId(id);setBurst({id,label:agent.name});},[]);
const resetCamera=useCallback(()=>{setZoomAgentId(null);setActiveId("automation");setBurst({id:"core",label:"Genesis Core"});},[]);
return(
<main className={`portal-shell ${webglReady?"webgl-ready":""}`} style={{["--mx" as string]:`${mouse.x}%`,["--my" as string]:`${mouse.y}%`,["--active" as string]:active.color}}>
<div className="portal-viewport">
<div className="portrait-guard"><RotateCcw className="h-12 w-12 text-cyan-200"/><h1>è¯·æ¨ªå±è¿å¥ Genesis AI Universe</h1><p>è¿ä¸ªçé¢æ¯æ¨ªå±æ¸¸æå¼æç³»ä¼ éé¨ï¼æè½¬ææºåå¯çå°å®æ´ä¸­å¿å¤§èãAgent æçåå¯¼èªè¡æã</p></div>
<div className="portal-bg"/>
<div className="flying-orbs" aria-hidden="true">{Array.from({length:16},(_,i)=><span key={i}/>)}</div>
<div className={`touch-glow ${touchGlow.active?"active":""}`} style={{["--touch-x" as string]:`${touchGlow.x}%`,["--touch-y" as string]:`${touchGlow.y}%`}}/>
{webglReady&&(<Canvas className="portal-canvas" camera={{position:[0,1.2,42],fov:52,near:0.05,far:1200}} dpr={[1,1.8]}
gl={{antialias:true,alpha:false,powerPreference:"high-performance",toneMapping:THREE.ACESFilmicToneMapping,toneMappingExposure:1.2}}
onCreated={({gl})=>{gl.setPixelRatio(Math.min(window.devicePixelRatio,2));}}><UniverseScene activeId={activeId} zoomAgentId={zoomAgentId} onPlanetClick={zoomToAgent}/></Canvas>)}
<div className="core-overexpose" aria-hidden="true"/>
<svg className="portal-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
<defs><filter id="lineGlow"><feGaussianBlur stdDeviation="0.45" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
{agents.map(n=><line key={n.id} x1="50" y1="50" x2={n.hud.x} y2={n.hud.y} stroke={n.color} strokeWidth="0.13" opacity="0.56" filter="url(#lineGlow)"/>)}
</svg>
<header className="portal-briefing"><span className="live-dot"/><strong>BRIEFING Â· LIVE</strong><span className="separator">|</span><Clock/><span className="separator">|</span><span>GENESIS AI UNIVERSE Â· 360Â° ORBIT + PINCH ZOOM</span></header>
<div className="scroll-brief">
<p>{zoomAgentId===null?"SECTION 00 Â· 360Â° ORBIT CAMERA":`SECTION ${String(agents.findIndex(a=>a.id===activeId)+1).padStart(2,"0")} Â· DEEP SPACE GALAXY`}</p>
<h1>{burst.label}</h1><span>{active.description}</span>
</div>
<div className="progress-rail" aria-hidden="true">
{[{id:"core",label:"Genesis Core"},...agents].map(({id,label},idx)=>(
<button key={id} onClick={()=>id==="core"?resetCamera():zoomToAgent(id)} className={activeId===id||(id==="core"&&zoomAgentId===null)?"active":""}><i/><span>{String(idx).padStart(2,"0")}</span></button>
))}
</div>
<nav className="side-console" aria-label="Universe navigation">
<button onClick={resetCamera} className="console-btn reset"><RefreshCcw className="h-4 w-4"/>éç½®</button>
{agents.map(agent=>(<button key={agent.id} onClick={()=>zoomToAgent(agent.id)} className={`console-btn ${activeId===agent.id?"active":""}`} style={{["--node" as string]:agent.color}}>{agent.name.replace("AI ","")}</button>))}
<a className="console-btn portal-link" href="#academy">Academy</a><a className="console-btn portal-link" href="#diagnosis">è¯æ­</a>
</nav>
<section className="galaxy-stage" aria-label="Genesis AI Universe portal">
{!webglReady&&(<><div className="orbit-ring orbit-ring-1"/><div className="orbit-ring orbit-ring-2"/><div className="orbit-ring orbit-ring-3"/>
<button className="central-brain" aria-label="Genesis central AI brain"><span className="brain-mesh"/><span className="brain-core-glow"/><BrainCircuit className="brain-icon"/><span className="brain-label">GENESIS<br/>CORE</span></button></>)}
{agents.map(agent=>{const Icon=agent.icon;const sel=activeId===agent.id;return(
<button key={agent.id} data-module-id={agent.id} onClick={()=>zoomToAgent(agent.id)} className={`agent-planet ${sel?"selected":""}`} style={{left:`${agent.hud.x}%`,top:`${agent.hud.y}%`,["--node" as string]:agent.color,["--node-glow" as string]:agent.glow}}>
<span className="planet-orbit"/><span className="planet-body"><Icon className="h-7 w-7"/></span><span className="planet-label"><strong>{agent.name}</strong><em>{agent.role}</em></span>
</button>);})}
{navPlanets.map((planet,idx)=>(<a key={planet.id} className="nav-asteroid" href={planet.url} style={{left:`${planet.hud.x}%`,top:`${planet.hud.y}%`,["--node" as string]:planet.color,animationDelay:`${idx*-0.4}s`}}><span className="asteroid-dot"/><span className="asteroid-card"><strong>{planet.label}</strong><em>{planet.sub}</em></span></a>))}
<div className="data-block data-block-a">AI ROUTE<br/><span>LEARNING MAP</span></div>
<div className="data-block data-block-b">DEPLOY<br/><span>VERCEL / GITHUB</span></div>
<div className="data-block data-block-c">TOOLS<br/><span>AGENT OS</span></div>
<div className="light-beam beam-a"/><div className="light-beam beam-b"/>
</section>
<AnimatePresence mode="wait"><motion.div key={burst.id} className="cinematic-burst" initial={{opacity:0,scale:0.72,filter:"blur(18px)"}} animate={{opacity:[0,1,0.16],scale:[0.72,1.2,1],filter:["blur(18px)","blur(0px)","blur(2px)"]}} exit={{opacity:0}} transition={{duration:1.1,ease:"easeOut"}}>{burst.label}</motion.div></AnimatePresence>
<AnimatePresence mode="wait"><motion.aside key={active.id} className="agent-dossier" initial={{opacity:0,y:18,scale:0.96}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:10,scale:0.98}} transition={{duration:0.24}}>
<div className="dossier-icon" style={{color:active.color,background:`${active.color}22`}}><ActiveIcon/></div>
<div><p>SELECTED AGENT</p><h2>{active.name}</h2><span>{active.role}</span></div>
<p className="dossier-desc">{active.description}</p>
<a href={active.url} className="dossier-link">è¿å¥è¿ä¸ªæç <ExternalLink className="h-4 w-4"/></a>
</motion.aside></AnimatePresence>
<footer className="agent-dock" aria-label="Agent selector">
{agents.map(agent=>(<button key={agent.id} onClick={()=>zoomToAgent(agent.id)} className={activeId===agent.id?"active":""} style={{["--node" as string]:agent.color}}>{agent.name}</button>))}
</footer>
<div className="scanline"/>
<div className="corner-hud corner-a"><Sparkles className="h-4 w-4"/>SYSTEM ONLINE</div>
<div className="corner-hud corner-b"><Satellite className="h-4 w-4"/>3 GALAXIES Â· 12 PLANETS Â· 48 MOONS</div>
<div className="corner-hud corner-c"><Zap className="h-4 w-4"/>360Â° DRAG Â· ZOOM Â· CLICK TO ZOOM IN</div>
</div>
<div className="scroll-sectors" aria-hidden="true">
{[{id:"genesis-core",label:"Genesis Core"},...agents.map(a=>({id:`ai-${a.id}`,label:a.name}))].map(({id,label},idx)=>(
<section key={id} id={id} className="scroll-sector"><div><span>{String(idx).padStart(2,"0")}</span><strong>{label}</strong></div></section>
))}
</div>
</main>
);
}
