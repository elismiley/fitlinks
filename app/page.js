“use client”;
import { useState, useEffect, useRef } from “react”;
import db from “../lib/db”;
import Auth from “./auth”;

// ── Courses ────────────────────────────────────────────────────────────────
const COURSES = {
riverside: {
name: “Riverside”, club: “Atlanta Athletic Club”, slope: 144,
holes: [
{ id: 1, name: “Hand Release Push Ups”, reps: 25, category: “US”, par: 62.5, type: “reps” },
{ id: 2, name: “Squat Reverse Lunges”, reps: 15, category: “LS”, par: 52.5, type: “reps” },
{ id: 3, name: “Sit Ups”, reps: 30, category: “Core”, par: 45, type: “reps” },
{ id: 4, name: “Reverse Grip Pull Ups”, reps: 14, category: “US”, par: 28, type: “reps” },
{ id: 5, name: “Jumping Lunges”, reps: 20, category: “LS”, par: 20, type: “reps” },
{ id: 6, name: “.25 Mile Run”, reps: null, category: “Cardio”, par: 110, type: “reps” },
{ id: 7, name: “Reverse Grip Pull Ups”, reps: 14, category: “US”, par: 28, type: “reps” },
{ id: 8, name: “Jumping Lunges”, reps: 20, category: “LS”, par: 20, type: “reps” },
{ id: 9, name: “Sit Ups”, reps: 30, category: “Core”, par: 45, type: “reps” },
{ id: 10, name: “Hand Release Push Ups”, reps: 25, category: “US”, par: 62.5, type: “reps” },
{ id: 11, name: “Squat Reverse Lunges”, reps: 15, category: “LS”, par: 52.5, type: “reps” },
{ id: 12, name: “.25 Mile Run”, reps: null, category: “Cardio”, par: 110, type: “reps” },
{ id: 13, name: “Hand Release Push Ups”, reps: 25, category: “US”, par: 62.5, type: “reps” },
{ id: 14, name: “Squat Reverse Lunges”, reps: 15, category: “LS”, par: 52.5, type: “reps” },
{ id: 15, name: “Plank Hold”, reps: null, category: “Core”, par: 120, type: “hold” },
{ id: 16, name: “Reverse Grip Pull Ups”, reps: 14, category: “US”, par: 28, type: “reps” },
{ id: 17, name: “Jumping Lunges”, reps: 20, category: “LS”, par: 20, type: “reps” },
{ id: 18, name: “.25 Mile Run”, reps: null, category: “Cardio”, par: 110, type: “reps” },
],
},
highlands: {
name: “Highlands”, club: “Atlanta Athletic Club”, slope: 152,
holes: [
{ id: 1, name: “Hand Release Push Ups”, reps: 30, category: “US”, par: 75, type: “reps” },
{ id: 2, name: “Squat Reverse Lunges”, reps: 20, category: “LS”, par: 70, type: “reps” },
{ id: 3, name: “Sit Ups”, reps: 30, category: “Core”, par: 45, type: “reps” },
{ id: 4, name: “Reverse Grip Pull Ups”, reps: 16, category: “US”, par: 32, type: “reps” },
{ id: 5, name: “Jumping Lunges”, reps: 25, category: “LS”, par: 25, type: “reps” },
{ id: 6, name: “.25 Mile Run”, reps: null, category: “Cardio”, par: 110, type: “reps” },
{ id: 7, name: “Reverse Grip Pull Ups”, reps: 16, category: “US”, par: 32, type: “reps” },
{ id: 8, name: “Jumping Lunges”, reps: 25, category: “LS”, par: 25, type: “reps” },
{ id: 9, name: “Sit Ups”, reps: 30, category: “Core”, par: 45, type: “reps” },
{ id: 10, name: “Hand Release Push Ups”, reps: 30, category: “US”, par: 75, type: “reps” },
{ id: 11, name: “Squat Reverse Lunges”, reps: 20, category: “LS”, par: 70, type: “reps” },
{ id: 12, name: “.25 Mile Run”, reps: null, category: “Cardio”, par: 110, type: “reps” },
{ id: 13, name: “Hand Release Push Ups”, reps: 30, category: “US”, par: 75, type: “reps” },
{ id: 14, name: “Squat Reverse Lunges”, reps: 20, category: “LS”, par: 70, type: “reps” },
{ id: 15, name: “Sit Ups”, reps: 30, category: “Core”, par: 45, type: “reps” },
{ id: 16, name: “Reverse Grip Pull Ups”, reps: 16, category: “US”, par: 32, type: “reps” },
{ id: 17, name: “Jumping Lunges”, reps: 25, category: “LS”, par: 25, type: “reps” },
{ id: 18, name: “.25 Mile Run”, reps: null, category: “Cardio”, par: 110, type: “reps” },
],
},
};

// ── Constants ──────────────────────────────────────────────────────────────
const CAT = {
US: { bg: “rgba(196,160,90,0.12)”, border: “#C4A05A”, text: “#C4A05A”, label: “Upper Strength” },
LS: { bg: “rgba(74,111,74,0.15)”, border: “#4A6F4A”, text: “#6B9E6B”, label: “Lower Strength” },
Core: { bg: “rgba(100,130,160,0.15)”, border: “#6482A0”, text: “#8AAAC8”, label: “Core” },
Cardio: { bg: “rgba(180,80,80,0.15)”, border: “#B45050”, text: “#D47070”, label: “Cardio” },
};

const CAT_KEYS = {
upperStrength: { label: “Upper Strength”, color: “#C4A05A”, bg: “rgba(196,160,90,0.12)”, border: “#C4A05A” },
lowerStrength: { label: “Lower Strength”, color: “#6B9E6B”, bg: “rgba(74,111,74,0.15)”, border: “#4A6F4A” },
core: { label: “Core”, color: “#8AAAC8”, bg: “rgba(100,130,160,0.15)”, border: “#6482A0” },
cardio: { label: “Cardio”, color: “#D47070”, bg: “rgba(180,80,80,0.15)”, border: “#B45050” },
};

// ── Helpers ────────────────────────────────────────────────────────────────
function calcScore(time, par, type) {
if (time == null) return null;
if (type === “hold”) return ((par - time) / par) * 10;
return ((time - par) / par) * 10;
}
function fmtScore(v) {
if (v == null) return “—”;
if (Math.abs(v) < 0.005) return “E”;
return (v < 0 ? “” : “+”) + v.toFixed(2);
}
function scoreColor(v) {
if (v == null) return “#555”;
return v < 0 ? “#6B9E6B” : v === 0 ? “#C4A05A” : “#D47070”;
}
function categoryAverages(holes, results) {
const out = {};
[“US”,“LS”,“Core”,“Cardio”].forEach(cat => {
const rel = holes.map((h,i) => ({h,r:results[i]})).filter(x => x.h.category===cat && x.r!=null);
out[cat] = rel.length ? rel.reduce((s,x) => s+calcScore(x.r,x.h.par,x.h.type),0)/rel.length : null;
});
return out;
}
function getFinalScore(avgs, restTime) {
const vals = Object.values(avgs).filter(v => v!=null);
if (!vals.length) return null;
const mov = vals.reduce((s,v)=>s+v,0)/vals.length;
const mod = 1+((restTime-75)/75)*0.2;
return {mov, mod, final: mov*mod};
}
function calcIndex(rounds) {
if (!rounds?.length) return null;
const recent = […rounds].sort((a,b) => b.playedAt - a.playedAt).slice(0,10);
return recent.reduce((s,r) => s + r.movementAvg, 0) / recent.length;
}
function fmtDate(ts) {
return new Date(ts).toLocaleDateString(“en-US”, { month:“short”, day:“numeric” });
}
function fmtAgo(ts) {
const d = Math.floor((Date.now()-ts)/86400000);
if (d===0) return “Today”;
if (d===1) return “Yesterday”;
return `${d}d ago`;
}

// ── Avatar ─────────────────────────────────────────────────────────────────
function Avatar({ name, size=36, isYou=false }) {
const initials = name?.split(” “).map(n=>n[0]).join(””).slice(0,2).toUpperCase() || “?”;
return (
<div style={{
width:size, height:size, borderRadius:“50%”,
background: isYou?“rgba(196,160,90,0.2)”:“rgba(255,255,255,0.05)”,
border:`1.5px solid ${isYou?"#C4A05A":"rgba(255,255,255,0.1)"}`,
display:“flex”, alignItems:“center”, justifyContent:“center”,
fontSize:size*0.33, fontWeight:700, color:isYou?”#C4A05A”:”#888”,
flexShrink:0,
}}>{initials}</div>
);
}

// ── Sparkline ──────────────────────────────────────────────────────────────
function Sparkline({ rounds }) {
if (!rounds || rounds.length < 2) return null;
const sorted = […rounds].sort((a,b)=>a.playedAt-b.playedAt);
const scores = sorted.map(r=>r.finalScore);
const min = Math.min(…scores)-0.5;
const max = Math.max(…scores)+0.5;
const range = max-min||1;
const w=120; const h=40;
const pts = scores.map((s,i) => `${(i/(scores.length-1))*w},${h-((s-min)/range)*h}`).join(” “);
const trend = scores[scores.length-1] < scores[0];
return (
<svg width={w} height={h} style={{overflow:“visible”}}>
<polyline points={pts} fill=“none” stroke={trend?”#6B9E6B”:”#D47070”} strokeWidth={1.5} strokeLinejoin=“round”/>
{scores.map((s,i)=>{
const x=(i/(scores.length-1))*w;
const y=h-((s-min)/range)*h;
return <circle key={i} cx={x} cy={y} r={i===scores.length-1?3:2} fill={i===scores.length-1?(trend?”#6B9E6B”:”#D47070”):“rgba(255,255,255,0.3)”}/>;
})}
</svg>
);
}

// ══════════════════════════════════════════════════════════════════════════
// PLAY PAGE
// ══════════════════════════════════════════════════════════════════════════
function SelectScreen({ onStart, user, rounds }) {
const [sel, setSel] = useState(“riverside”);
const [rest, setRest] = useState(75);
const mod = 1+((rest-75)/75)*0.2;
const index = calcIndex(rounds);
return (
<div style={{padding:“1.5rem 1.25rem”,maxWidth:500,margin:“0 auto”}}>
<div style={{textAlign:“center”,marginBottom:“2rem”}}>
<div style={{fontSize:“0.65rem”,letterSpacing:“0.2em”,color:”#C4A05A”,textTransform:“uppercase”,marginBottom:“0.4rem”}}>Elite Calisthenics Tour</div>
<div style={{fontSize:“2rem”,fontWeight:700}}>FitLinks</div>
<div style={{fontSize:“0.8rem”,color:”#555”}}>
Welcome, {user?.email?.split(”@”)[0]}
{index !== null && <span style={{color:scoreColor(index),marginLeft:“0.5rem”}}>· Index {fmtScore(index)}</span>}
</div>
</div>
{Object.entries(COURSES).map(([key,c]) => (
<div key={key} onClick={()=>setSel(key)} style={{padding:“1rem”,marginBottom:“0.75rem”,borderRadius:“4px”,cursor:“pointer”,border:`1px solid ${sel===key?"#C4A05A":"rgba(255,255,255,0.07)"}`,background:sel===key?“rgba(196,160,90,0.07)”:“rgba(255,255,255,0.02)”}}>
<div style={{display:“flex”,justifyContent:“space-between”}}>
<div>
<div style={{fontSize:“1.05rem”,fontWeight:700,color:sel===key?”#E8E0D0”:”#999”}}>{c.name}</div>
<div style={{fontSize:“0.65rem”,color:”#555”}}>{c.club}</div>
</div>
<div style={{textAlign:“right”}}>
<div style={{fontSize:“0.55rem”,color:”#555”,textTransform:“uppercase”}}>Slope</div>
<div style={{fontSize:“1.3rem”,fontWeight:700,color:sel===key?”#C4A05A”:”#444”}}>{c.slope}</div>
</div>
</div>
</div>
))}
<div style={{background:“rgba(255,255,255,0.02)”,border:“1px solid rgba(255,255,255,0.07)”,borderRadius:“4px”,padding:“1rem”,margin:“0.75rem 0 1.5rem”}}>
<div style={{display:“flex”,justifyContent:“space-between”,marginBottom:“0.5rem”}}>
<div>
<div style={{fontSize:“0.6rem”,letterSpacing:“0.15em”,color:”#777”,textTransform:“uppercase”}}>Rest Between Stations</div>
<div style={{fontSize:“0.6rem”,color:”#444”}}>Par = 75 sec</div>
</div>
<div style={{textAlign:“right”}}>
<span style={{fontSize:“1.5rem”,fontWeight:700,color:rest<75?”#6B9E6B”:rest>75?”#D47070”:”#C4A05A”}}>{rest}s</span>
<div style={{fontSize:“0.6rem”,color:”#444”}}>mod {mod.toFixed(2)}×</div>
</div>
</div>
<input type=“range” min={30} max={150} step={5} value={rest} onChange={e=>setRest(Number(e.target.value))} style={{width:“100%”,accentColor:”#C4A05A”}}/>
<div style={{display:“flex”,justifyContent:“space-between”,fontSize:“0.55rem”,color:”#3A3A3A”,marginTop:“0.2rem”}}>
<span>30s aggressive</span><span>75s par</span><span>150s easy</span>
</div>
</div>
<button onClick={()=>onStart(sel,rest)} style={{width:“100%”,padding:“1rem”,background:”#C4A05A”,border:“none”,color:”#0F0F0E”,fontSize:“0.85rem”,fontWeight:700,letterSpacing:“0.15em”,textTransform:“uppercase”,borderRadius:“4px”,cursor:“pointer”}}>
Begin Round →
</button>
</div>
);
}

function CountdownScreen({ hole, onGo }) {
const [phase, setPhase] = useState(0);
useEffect(()=>{
const t1=setTimeout(()=>setPhase(1),1000);
const t2=setTimeout(()=>setPhase(2),2000);
const t3=setTimeout(onGo,2700);
return ()=>{clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);};
},[]);
const words=[“Ready”,“Set”,“GO!”];
const colors=[”#C4A05A”,”#C4A05A”,”#6B9E6B”];
return (
<div style={{display:“flex”,flexDirection:“column”,alignItems:“center”,justifyContent:“center”,minHeight:“80vh”,textAlign:“center”,padding:“2rem”}}>
<div style={{fontSize:“0.6rem”,letterSpacing:“0.2em”,color:”#555”,textTransform:“uppercase”,marginBottom:“1.5rem”}}>Hole {hole.id} · {CAT[hole.category].label}</div>
<div style={{fontSize:“1.5rem”,fontWeight:700,color:”#E8E0D0”,marginBottom:“0.5rem”}}>{hole.name}</div>
{hole.reps && <div style={{fontSize:“0.85rem”,color:CAT[hole.category].text,marginBottom:“3rem”}}>{hole.reps} reps</div>}
<div style={{fontSize:“5.5rem”,fontWeight:700,color:colors[phase],transition:“all 0.25s”,transform:phase===2?“scale(1.15)”:“scale(1)”}}>{words[phase]}</div>
</div>
);
}

function ActiveScreen({ hole, holeIndex, totalHoles, onComplete }) {
const [elapsed, setElapsed] = useState(0);
const ref = useRef(null);
useEffect(()=>{
ref.current=setInterval(()=>setElapsed(e=>Math.round((e+0.1)*10)/10),100);
return ()=>clearInterval(ref.current);
},[]);
function done(){clearInterval(ref.current);onComplete(elapsed);}
const pct=Math.min(elapsed/hole.par,1);
const over=elapsed>hole.par;
const isHold=hole.type===“hold”;
const r=82; const circ=2*Math.PI*r;
const ringColor=isHold?(over?”#6B9E6B”:”#D47070”):(over?”#D47070”:”#C4A05A”);
const textColor=isHold?(over?”#6B9E6B”:”#D47070”):(over?”#D47070”:”#E8E0D0”);
return (
<div style={{display:“flex”,flexDirection:“column”,alignItems:“center”,padding:“1.5rem 1.25rem 2rem”}}>
<div style={{width:“100%”,maxWidth:420,marginBottom:“1.75rem”}}>
<div style={{display:“flex”,justifyContent:“space-between”,fontSize:“0.6rem”,color:”#444”,marginBottom:“0.3rem”}}>
<span>Hole {hole.id} of {totalHoles}</span>
<span>{Math.round((holeIndex/totalHoles)*100)}%</span>
</div>
<div style={{height:“2px”,background:“rgba(255,255,255,0.06)”,borderRadius:“1px”}}>
<div style={{height:“100%”,width:`${(holeIndex/totalHoles)*100}%`,background:”#C4A05A”,borderRadius:“1px”}}/>
</div>
</div>
<div style={{fontSize:“0.6rem”,letterSpacing:“0.12em”,textTransform:“uppercase”,color:CAT[hole.category].text,background:CAT[hole.category].bg,border:`1px solid ${CAT[hole.category].border}44`,padding:“0.25rem 0.65rem”,borderRadius:“2px”,marginBottom:“0.75rem”}}>{CAT[hole.category].label}</div>
<div style={{fontSize:“1.5rem”,fontWeight:700,textAlign:“center”,marginBottom:“0.35rem”}}>{hole.name}</div>
<div style={{fontSize:“0.8rem”,color:”#666”,marginBottom:“2rem”}}>{hole.reps?`${hole.reps} reps`:isHold?“Hold as long as possible”:“Complete the distance”}</div>
<div style={{position:“relative”,marginBottom:“1.5rem”}}>
<svg width={190} height={190} style={{transform:“rotate(-90deg)”}}>
<circle cx={95} cy={95} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={7}/>
<circle cx={95} cy={95} r={r} fill=“none” stroke={ringColor} strokeWidth={7} strokeLinecap=“round” strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} style={{transition:“stroke-dashoffset 0.08s linear,stroke 0.3s”}}/>
</svg>
<div style={{position:“absolute”,inset:0,display:“flex”,flexDirection:“column”,alignItems:“center”,justifyContent:“center”}}>
<div style={{fontSize:“3.2rem”,fontWeight:700,color:textColor}}>{elapsed.toFixed(1)}</div>
<div style={{fontSize:“0.6rem”,color:”#444”}}>PAR {hole.par}s</div>
</div>
</div>
<div style={{fontSize:“0.75rem”,marginBottom:“2rem”,minHeight:“1.2rem”,color:isHold?(over?”#6B9E6B”:”#D47070”):(over?”#D47070”:”#6B9E6B”)}}>
{isHold
? over?`+${(elapsed-hole.par).toFixed(1)}s over par 💪`:elapsed>0?`${(hole.par-elapsed).toFixed(1)}s to go`:””
: over?`+${(elapsed-hole.par).toFixed(1)}s over par`:elapsed>0?`-${(hole.par-elapsed).toFixed(1)}s under par`:””}
</div>
<button onClick={done} style={{width:“100%”,maxWidth:380,padding:“1.1rem”,background:”#C4A05A”,border:“none”,color:”#0F0F0E”,fontSize:“1rem”,fontWeight:700,letterSpacing:“0.15em”,textTransform:“uppercase”,borderRadius:“4px”,cursor:“pointer”}}>Complete ✓</button>
</div>
);
}

function RestScreen({ restTime, nextHole, onDone }) {
const [rem, setRem] = useState(restTime);
useEffect(()=>{
if(rem<=0){onDone();return;}
const t=setTimeout(()=>setRem(r=>r-1),1000);
return ()=>clearTimeout(t);
},[rem]);
const r=70; const circ=2*Math.PI*r;
return (
<div style={{display:“flex”,flexDirection:“column”,alignItems:“center”,justifyContent:“center”,minHeight:“80vh”,padding:“2rem”,textAlign:“center”}}>
<div style={{fontSize:“0.6rem”,letterSpacing:“0.2em”,color:”#555”,textTransform:“uppercase”,marginBottom:“2rem”}}>Rest Period</div>
<div style={{position:“relative”,marginBottom:“2rem”}}>
<svg width={160} height={160} style={{transform:“rotate(-90deg)”}}>
<circle cx={80} cy={80} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={5}/>
<circle cx={80} cy={80} r={r} fill=“none” stroke=“rgba(100,130,160,0.5)” strokeWidth={5} strokeLinecap=“round” strokeDasharray={circ} strokeDashoffset={circ*(1-rem/restTime)} style={{transition:“stroke-dashoffset 0.9s linear”}}/>
</svg>
<div style={{position:“absolute”,inset:0,display:“flex”,flexDirection:“column”,alignItems:“center”,justifyContent:“center”}}>
<div style={{fontSize:“3rem”,fontWeight:700,color:”#8AAAC8”}}>{rem}</div>
<div style={{fontSize:“0.6rem”,color:”#444”}}>seconds</div>
</div>
</div>
<div style={{fontSize:“0.75rem”,color:”#555”,marginBottom:“0.4rem”}}>Next up</div>
<div style={{fontSize:“1.15rem”,fontWeight:700}}>{nextHole.name}</div>
{nextHole.reps && <div style={{fontSize:“0.75rem”,color:CAT[nextHole.category].text,marginTop:“0.25rem”}}>{nextHole.reps} reps</div>}
<button onClick={onDone} style={{marginTop:“2rem”,padding:“0.7rem 2rem”,background:“transparent”,border:“1px solid rgba(255,255,255,0.1)”,color:”#666”,fontSize:“0.75rem”,letterSpacing:“0.1em”,textTransform:“uppercase”,borderRadius:“4px”,cursor:“pointer”}}>Skip Rest</button>
</div>
);
}

function ScorecardScreen({ course, results, restTime, onRestart, onSave, saving }) {
const avgs=categoryAverages(course.holes,results);
const sd=getFinalScore(avgs,restTime);
return (
<div style={{padding:“1.25rem 1rem 5rem”,maxWidth:500,margin:“0 auto”}}>
<div style={{textAlign:“center”,padding:“1.5rem”,border:“1px solid rgba(196,160,90,0.3)”,borderRadius:“4px”,background:“rgba(196,160,90,0.04)”,marginBottom:“1.25rem”}}>
<div style={{fontSize:“0.55rem”,letterSpacing:“0.2em”,color:”#555”,textTransform:“uppercase”,marginBottom:“0.4rem”}}>{course.name} · Slope {course.slope}</div>
<div style={{fontSize:“4rem”,fontWeight:700,color:scoreColor(sd?.final)}}>{fmtScore(sd?.final)}</div>
<div style={{fontSize:“0.65rem”,color:”#444”,marginTop:“0.4rem”}}>Movement {fmtScore(sd?.mov)} × Rest {sd?.mod?.toFixed(2)}×</div>
<div style={{marginTop:“0.75rem”,fontSize:“0.75rem”,color:sd?.final<0?”#6B9E6B”:sd?.final<1?”#C4A05A”:”#D47070”}}>
{sd?.final<-1?“🔥 Exceptional”:sd?.final<0?“✓ Under par”:sd?.final<1?“Near scratch”:“Keep grinding”}
</div>
</div>
<div style={{marginBottom:“1.25rem”}}>
{[“US”,“LS”,“Core”,“Cardio”].map(cat=>(
<div key={cat} style={{display:“flex”,justifyContent:“space-between”,alignItems:“center”,padding:“0.6rem 0.75rem”,marginBottom:“0.35rem”,background:CAT[cat].bg,borderLeft:`3px solid ${CAT[cat].border}`,borderRadius:“2px”}}>
<span style={{fontSize:“0.78rem”,color:CAT[cat].text}}>{CAT[cat].label}</span>
<span style={{fontSize:“0.85rem”,fontWeight:700,color:scoreColor(avgs[cat])}}>{fmtScore(avgs[cat])}</span>
</div>
))}
</div>
<div style={{marginBottom:“1.5rem”}}>
<div style={{fontSize:“0.58rem”,letterSpacing:“0.18em”,color:”#555”,textTransform:“uppercase”,marginBottom:“0.5rem”}}>Scorecard</div>
<div style={{display:“grid”,gridTemplateColumns:“1.4rem 1fr 2.8rem 2.8rem 3rem”,gap:“0.35rem”,padding:“0.3rem 0.6rem”,fontSize:“0.52rem”,letterSpacing:“0.1em”,color:”#3A3A3A”,textTransform:“uppercase”,borderBottom:“1px solid rgba(255,255,255,0.05)”}}>
<span>#</span><span>Movement</span><span style={{textAlign:“center”}}>Par</span><span style={{textAlign:“center”}}>Time</span><span style={{textAlign:“center”}}>Score</span>
</div>
{course.holes.map((hole,i)=>{
const s=calcScore(results[i],hole.par,hole.type);
return (
<div key={hole.id} style={{display:“grid”,gridTemplateColumns:“1.4rem 1fr 2.8rem 2.8rem 3rem”,gap:“0.35rem”,padding:“0.5rem 0.6rem”,borderBottom:“1px solid rgba(255,255,255,0.03)”}}>
<span style={{fontSize:“0.6rem”,color:”#3A3A3A”}}>{hole.id}</span>
<div>
<div style={{fontSize:“0.72rem”,color:”#C0B8A8”}}>{hole.name}</div>
<div style={{fontSize:“0.55rem”,color:CAT[hole.category].text}}>{CAT[hole.category].label}</div>
</div>
<span style={{fontSize:“0.65rem”,color:”#444”,textAlign:“center”}}>{hole.par}s</span>
<span style={{fontSize:“0.65rem”,color:”#AAA”,textAlign:“center”}}>{results[i]!=null?`${results[i]}s`:”—”}</span>
<span style={{textAlign:“center”}}><span style={{fontSize:“0.72rem”,fontWeight:700,color:scoreColor(s)}}>{fmtScore(s)}</span></span>
</div>
);
})}
</div>
<button onClick={onSave} disabled={saving} style={{width:“100%”,padding:“0.9rem”,background:”#C4A05A”,border:“none”,color:”#0F0F0E”,fontSize:“0.8rem”,fontWeight:700,letterSpacing:“0.15em”,textTransform:“uppercase”,borderRadius:“4px”,cursor:“pointer”,marginBottom:“0.75rem”,opacity:saving?0.7:1}}>
{saving ? “Saving…” : “Save Round”}
</button>
<button onClick={onRestart} style={{width:“100%”,padding:“0.9rem”,background:“transparent”,border:“1px solid rgba(196,160,90,0.35)”,color:”#C4A05A”,fontSize:“0.8rem”,fontWeight:700,letterSpacing:“0.15em”,textTransform:“uppercase”,borderRadius:“4px”,cursor:“pointer”}}>Play Another Round</button>
</div>
);
}

// ══════════════════════════════════════════════════════════════════════════
// STATS PAGE
// ══════════════════════════════════════════════════════════════════════════
function StatsPage({ rounds }) {
const [activeTab, setActiveTab] = useState(“overview”);
const sorted = […(rounds||[])].sort((a,b)=>b.playedAt-a.playedAt);
const index = calcIndex(rounds);
const totalRounds = rounds?.length || 0;
const underPar = rounds?.filter(r=>r.finalScore<0).length || 0;
const best = rounds?.reduce((b,r)=>r.finalScore<(b?.finalScore??Infinity)?r:b, null);
const catAvgs = totalRounds ? {
upperStrength: rounds.reduce((s,r)=>s+r.upperStrength,0)/totalRounds,
lowerStrength: rounds.reduce((s,r)=>s+r.lowerStrength,0)/totalRounds,
core: rounds.reduce((s,r)=>s+r.core,0)/totalRounds,
cardio: rounds.reduce((s,r)=>s+r.cardio,0)/totalRounds,
} : {};

const last3avg = sorted.slice(0,3).length ? sorted.slice(0,3).reduce((s,r)=>s+r.finalScore,0)/sorted.slice(0,3).length : null;
const prev3avg = sorted.slice(3,6).length ? sorted.slice(3,6).reduce((s,r)=>s+r.finalScore,0)/sorted.slice(3,6).length : null;
const trending = last3avg!==null && prev3avg!==null ? last3avg < prev3avg : null;

if (!totalRounds) return (
<div style={{display:“flex”,flexDirection:“column”,alignItems:“center”,justifyContent:“center”,minHeight:“60vh”,padding:“2rem”,textAlign:“center”}}>
<div style={{fontSize:“2rem”,marginBottom:“1rem”}}>⛳</div>
<div style={{fontSize:“1rem”,fontWeight:700,marginBottom:“0.5rem”}}>No rounds yet</div>
<div style={{fontSize:“0.75rem”,color:”#555”}}>Play your first round to see your stats</div>
</div>
);

return (
<div style={{padding:“1.25rem 1rem 6rem”,maxWidth:500,margin:“0 auto”}}>
{/* Index Hero */}
<div style={{background:“linear-gradient(135deg,rgba(196,160,90,0.08) 0%,rgba(15,15,14,0) 60%)”,border:“1px solid rgba(196,160,90,0.25)”,borderRadius:“6px”,padding:“1.5rem”,marginBottom:“1.25rem”,position:“relative”,overflow:“hidden”}}>
<div style={{position:“absolute”,top:“1rem”,right:“1rem”}}><Sparkline rounds={sorted}/></div>
<div style={{fontSize:“0.6rem”,letterSpacing:“0.2em”,color:”#888”,textTransform:“uppercase”,marginBottom:“0.25rem”}}>Fitness Index</div>
<div style={{fontSize:“4rem”,fontWeight:700,color:scoreColor(index),lineHeight:1,marginBottom:“0.25rem”}}>{fmtScore(index)}</div>
<div style={{fontSize:“0.7rem”,color:”#555”,marginBottom:“1rem”}}>Rolling avg · last {Math.min(totalRounds,10)} rounds</div>
<div style={{display:“flex”,gap:“1.5rem”,flexWrap:“wrap”}}>
{[
{label:“Rounds”,value:totalRounds,color:”#E8E0D0”},
{label:“Under Par”,value:`${underPar}/${totalRounds}`,color:”#6B9E6B”},
{label:“Best”,value:fmtScore(best?.finalScore),color:”#6B9E6B”},
trending!==null?{label:“Trend”,value:trending?“↓ Improving”:“↑ Declining”,color:trending?”#6B9E6B”:”#D47070”}:null,
].filter(Boolean).map(stat=>(
<div key={stat.label}>
<div style={{fontSize:“0.55rem”,color:”#555”,textTransform:“uppercase”,letterSpacing:“0.08em”}}>{stat.label}</div>
<div style={{fontSize:“1rem”,fontWeight:700,color:stat.color}}>{stat.value}</div>
</div>
))}
</div>
</div>

```
{/* Tabs */}
<div style={{display:"flex",marginBottom:"1.25rem",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
{["overview","history","categories"].map(tab=>(
<button key={tab} onClick={()=>setActiveTab(tab)} style={{flex:1,padding:"0.6rem 0",background:"none",border:"none",borderBottom:`2px solid ${activeTab===tab?"#C4A05A":"transparent"}`,color:activeTab===tab?"#C4A05A":"#555",fontSize:"0.65rem",letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",fontFamily:"Georgia,serif",transition:"all 0.2s"}}>
{tab}
</button>
))}
</div>

{activeTab==="overview" && (
<div>
<div style={{fontSize:"0.58rem",letterSpacing:"0.18em",color:"#555",textTransform:"uppercase",marginBottom:"0.75rem"}}>Category Averages</div>
{Object.entries(CAT_KEYS).map(([key,cat])=>(
<div key={key} style={{padding:"0.75rem",marginBottom:"0.4rem",background:cat.bg,borderLeft:`3px solid ${cat.border}`,borderRadius:"2px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.4rem"}}>
<span style={{fontSize:"0.75rem",color:cat.color}}>{cat.label}</span>
<span style={{fontSize:"0.6rem",color:catAvgs[key]<0?"#6B9E6B":"#D47070"}}>{catAvgs[key]<0?"Strength":"Needs work"}</span>
</div>
<div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
<div style={{flex:1,height:"4px",background:"rgba(255,255,255,0.06)",borderRadius:"2px",overflow:"hidden"}}>
<div style={{height:"100%",width:`${Math.min(Math.abs(catAvgs[key]||0)/3,1)*100}%`,background:catAvgs[key]<0?"#6B9E6B":"#D47070",borderRadius:"2px"}}/>
</div>
<span style={{fontSize:"0.75rem",fontWeight:700,color:scoreColor(catAvgs[key]),minWidth:"3rem",textAlign:"right"}}>{fmtScore(catAvgs[key])}</span>
</div>
</div>
))}
<div style={{fontSize:"0.58rem",letterSpacing:"0.18em",color:"#555",textTransform:"uppercase",margin:"1.25rem 0 0.75rem"}}>By Course</div>
{Object.entries(COURSES).map(([courseKey,c])=>{
const cr=rounds.filter(r=>r.courseKey===courseKey);
if(!cr.length) return null;
const avg=cr.reduce((s,r)=>s+r.finalScore,0)/cr.length;
const b=cr.reduce((bst,r)=>r.finalScore<(bst?.finalScore??Infinity)?r:bst,null);
return (
<div key={courseKey} style={{padding:"0.85rem 0.75rem",marginBottom:"0.4rem",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"4px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.5rem"}}>
<div>
<div style={{fontSize:"0.85rem",fontWeight:700}}>{c.name}</div>
<div style={{fontSize:"0.6rem",color:"#555"}}>Slope {c.slope} · {cr.length} rounds</div>
</div>
<div style={{textAlign:"right"}}>
<div style={{fontSize:"0.55rem",color:"#555",textTransform:"uppercase",letterSpacing:"0.08em"}}>Avg</div>
<div style={{fontSize:"1.1rem",fontWeight:700,color:scoreColor(avg)}}>{fmtScore(avg)}</div>
</div>
</div>
<div style={{display:"flex",gap:"1.5rem"}}>
<div><div style={{fontSize:"0.55rem",color:"#555"}}>Best</div><div style={{fontSize:"0.8rem",color:"#6B9E6B",fontWeight:700}}>{fmtScore(b?.finalScore)}</div></div>
<div><div style={{fontSize:"0.55rem",color:"#555"}}>Last played</div><div style={{fontSize:"0.8rem",color:"#888"}}>{fmtAgo(Math.max(...cr.map(r=>r.playedAt)))}</div></div>
</div>
</div>
);
})}
</div>
)}

{activeTab==="history" && (
<div>
<div style={{fontSize:"0.58rem",letterSpacing:"0.18em",color:"#555",textTransform:"uppercase",marginBottom:"0.75rem"}}>Round History</div>
{sorted.map(round=>(
<div key={round.id} style={{padding:"0.85rem 0.75rem",marginBottom:"0.4rem",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"4px",borderLeft:`3px solid ${scoreColor(round.finalScore)}`}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div>
<div style={{fontSize:"0.85rem",fontWeight:700}}>{round.courseName}</div>
<div style={{fontSize:"0.6rem",color:"#555",marginTop:"0.15rem"}}>{fmtDate(round.playedAt)} · {fmtAgo(round.playedAt)}</div>
<div style={{display:"flex",gap:"0.75rem",marginTop:"0.5rem"}}>
{[{k:"upperStrength",l:"US"},{k:"lowerStrength",l:"LS"},{k:"core",l:"Core"},{k:"cardio",l:"Cardio"}].map(({k,l})=>(
<div key={k}>
<div style={{fontSize:"0.5rem",color:"#444"}}>{l}</div>
<div style={{fontSize:"0.65rem",fontWeight:700,color:scoreColor(round[k])}}>{fmtScore(round[k])}</div>
</div>
))}
</div>
</div>
<div style={{textAlign:"right"}}>
<div style={{fontSize:"2rem",fontWeight:700,color:scoreColor(round.finalScore),lineHeight:1}}>{fmtScore(round.finalScore)}</div>
<div style={{fontSize:"0.6rem",color:"#444",marginTop:"0.25rem"}}>{round.finalScore<-1?"🔥 Exceptional":round.finalScore<0?"✓ Under par":round.finalScore<1?"Near scratch":"Over par"}</div>
</div>
</div>
</div>
))}
</div>
)}

{activeTab==="categories" && (
<div>
{Object.entries(CAT_KEYS).map(([key,cat])=>{
const avg=catAvgs[key];
const roundScores=sorted.map(r=>({score:r[key],date:r.playedAt,course:r.courseName}));
const b=roundScores.reduce((bst,r)=>r.score<(bst?.score??Infinity)?r:bst,null);
const trend=roundScores.length>=2?roundScores[0].score<roundScores[roundScores.length-1].score:null;
return (
<div key={key} style={{marginBottom:"1.25rem"}}>
<div style={{padding:"1rem 0.75rem",background:cat.bg,border:`1px solid ${cat.border}22`,borderLeft:`3px solid ${cat.border}`,borderRadius:"4px"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"0.75rem"}}>
<div>
<div style={{fontSize:"0.9rem",fontWeight:700,color:cat.color}}>{cat.label}</div>
<div style={{fontSize:"0.6rem",color:"#555"}}>{avg<-1?"Dominant":avg<0?"Under par":avg<1?"Near scratch":"Needs work"}</div>
</div>
<div style={{textAlign:"right"}}>
<div style={{fontSize:"2rem",fontWeight:700,color:scoreColor(avg),lineHeight:1}}>{fmtScore(avg)}</div>
<div style={{fontSize:"0.6rem",color:"#444"}}>avg</div>
</div>
</div>
<div style={{display:"flex",gap:"1.5rem"}}>
<div><div style={{fontSize:"0.55rem",color:"#555"}}>Best</div><div style={{fontSize:"0.8rem",fontWeight:700,color:"#6B9E6B"}}>{fmtScore(b?.score)}</div></div>
<div><div style={{fontSize:"0.55rem",color:"#555"}}>Rounds</div><div style={{fontSize:"0.8rem",color:"#888"}}>{roundScores.length}</div></div>
{trend!==null&&<div><div style={{fontSize:"0.55rem",color:"#555"}}>Trend</div><div style={{fontSize:"0.8rem",fontWeight:700,color:trend?"#6B9E6B":"#D47070"}}>{trend?"↓ Improving":"↑ Declining"}</div></div>}
</div>
</div>
<div style={{marginTop:"0.4rem"}}>
{roundScores.map((r,i)=>(
<div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.4rem 0.75rem",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
<div style={{fontSize:"0.65rem",color:"#555"}}>{r.course} · {fmtDate(r.date)}</div>
<span style={{fontSize:"0.72rem",fontWeight:700,color:scoreColor(r.score)}}>{fmtScore(r.score)}</span>
</div>
))}
</div>
</div>
);
})}
</div>
)}
</div>
```

);
}

// ══════════════════════════════════════════════════════════════════════════
// CLUBHOUSE PAGE
// ══════════════════════════════════════════════════════════════════════════
function ClubhousePage({ user }) {
const [activeTab, setActiveTab] = useState(“leaderboard”);

const CLUB = { name:“The Peach State”, founded:“2026”, homeCourse:“Riverside”, collectiveIndex:-0.42, rank:3, totalClubs:47 };
const MEMBERS = [
{ id:“1”, name:user?.email?.split(”@”)[0]||“You”, index:-1.09, trend:“down”, roundsPlayed:5, lastPlayed:1, active:true, isYou:true },
{ id:“2”, name:“Ryan H.”, index:-0.55, trend:“down”, roundsPlayed:3, lastPlayed:2, active:true },
{ id:“3”, name:“Jake M.”, index:0.32, trend:“up”, roundsPlayed:4, lastPlayed:3, active:true },
{ id:“4”, name:“Chris T.”, index:0.65, trend:“down”, roundsPlayed:2, lastPlayed:5, active:true },
{ id:“5”, name:“Will B.”, index:1.20, trend:“up”, roundsPlayed:1, lastPlayed:8, active:false },
{ id:“6”, name:“Invite…”, index:null, roundsPlayed:0, active:false, pending:true },
];
const CHALLENGES = [
{ id:“1”, course:“Riverside”, slope:144, status:“active”, deadline:Date.now()+172800000, issuedBy:“You”,
scores:[
{id:“1”,name:user?.email?.split(”@”)[0]||“You”,score:-1.09,playedAt:Date.now()-86400000,isYou:true},
{id:“2”,name:“Ryan H.”,score:-0.55,playedAt:Date.now()-172800000},
{id:“3”,name:“Jake M.”,score:0.32,playedAt:Date.now()-259200000},
{id:“4”,name:“Chris T.”,score:null},
{id:“5”,name:“Will B.”,score:null},
]},
{ id:“2”, course:“Highlands”, slope:152, status:“completed”, deadline:Date.now()-259200000, issuedBy:“Ryan H.”,
scores:[
{id:“2”,name:“Ryan H.”,score:0.88,playedAt:Date.now()-518400000},
{id:“1”,name:user?.email?.split(”@”)[0]||“You”,score:1.20,playedAt:Date.now()-432000000,isYou:true},
{id:“3”,name:“Jake M.”,score:1.85,playedAt:Date.now()-345600000},
]},
];

return (
<div style={{padding:“1.25rem 1rem 6rem”,maxWidth:500,margin:“0 auto”}}>
{/* Club Card */}
<div style={{background:“linear-gradient(135deg,rgba(196,160,90,0.1) 0%,rgba(15,15,14,0) 70%)”,border:“1px solid rgba(196,160,90,0.25)”,borderRadius:“6px”,padding:“1.25rem”,marginBottom:“1.25rem”}}>
<div style={{display:“flex”,justifyContent:“space-between”,alignItems:“flex-start”}}>
<div>
<div style={{fontSize:“0.6rem”,letterSpacing:“0.15em”,color:”#C4A05A”,textTransform:“uppercase”,marginBottom:“0.25rem”}}>Your Club</div>
<div style={{fontSize:“1.4rem”,fontWeight:700}}>{CLUB.name}</div>
<div style={{fontSize:“0.65rem”,color:”#555”,marginTop:“0.1rem”}}>Founded {CLUB.founded} · Home: {CLUB.homeCourse}</div>
</div>
<div style={{textAlign:“right”}}>
<div style={{fontSize:“0.55rem”,color:”#555”,textTransform:“uppercase”,letterSpacing:“0.1em”}}>Club Rank</div>
<div style={{fontSize:“1.8rem”,fontWeight:700,color:”#C4A05A”,lineHeight:1}}>#{CLUB.rank}</div>
<div style={{fontSize:“0.6rem”,color:”#555”}}>of {CLUB.totalClubs} clubs</div>
</div>
</div>
<div style={{display:“flex”,gap:“1.5rem”,marginTop:“1rem”,paddingTop:“0.75rem”,borderTop:“1px solid rgba(255,255,255,0.05)”}}>
<div><div style={{fontSize:“0.55rem”,color:”#555”,textTransform:“uppercase”,letterSpacing:“0.08em”}}>Club Index</div><div style={{fontSize:“1.1rem”,fontWeight:700,color:scoreColor(CLUB.collectiveIndex)}}>{fmtScore(CLUB.collectiveIndex)}</div></div>
<div><div style={{fontSize:“0.55rem”,color:”#555”,textTransform:“uppercase”,letterSpacing:“0.08em”}}>Members</div><div style={{fontSize:“1.1rem”,fontWeight:700}}>{MEMBERS.length}/10</div></div>
<div><div style={{fontSize:“0.55rem”,color:”#555”,textTransform:“uppercase”,letterSpacing:“0.08em”}}>Challenges</div><div style={{fontSize:“1.1rem”,fontWeight:700,color:”#C4A05A”}}>{CHALLENGES.filter(c=>c.status===“active”).length}</div></div>
</div>
</div>

```
{/* Tabs */}
<div style={{display:"flex",marginBottom:"1.25rem",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
{["leaderboard","challenges","club"].map(tab=>(
<button key={tab} onClick={()=>setActiveTab(tab)} style={{flex:1,padding:"0.6rem 0",background:"none",border:"none",borderBottom:`2px solid ${activeTab===tab?"#C4A05A":"transparent"}`,color:activeTab===tab?"#C4A05A":"#555",fontSize:"0.65rem",letterSpacing:"0.15em",textTransform:"uppercase",cursor:"pointer",fontFamily:"Georgia,serif",transition:"all 0.2s"}}>
{tab}
</button>
))}
</div>

{activeTab==="leaderboard" && (
<div>
<div style={{fontSize:"0.58rem",letterSpacing:"0.18em",color:"#555",textTransform:"uppercase",marginBottom:"0.75rem"}}>Member Rankings</div>
{MEMBERS.map((member,i)=>(
<div key={member.id} style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.75rem",marginBottom:"0.35rem",background:member.isYou?"rgba(196,160,90,0.06)":"rgba(255,255,255,0.02)",border:`1px solid ${member.isYou?"rgba(196,160,90,0.25)":"rgba(255,255,255,0.05)"}`,borderRadius:"4px"}}>
<div style={{fontSize:"0.7rem",color:"#444",width:"1.2rem",textAlign:"center",flexShrink:0}}>{member.pending?"—":i+1}</div>
<Avatar name={member.name} isYou={member.isYou}/>
<div style={{flex:1,minWidth:0}}>
<div style={{display:"flex",alignItems:"center",gap:"0.4rem"}}>
<span style={{fontSize:"0.85rem",fontWeight:member.isYou?700:400}}>{member.name}</span>
{member.isYou&&<span style={{fontSize:"0.5rem",color:"#C4A05A",background:"rgba(196,160,90,0.15)",padding:"0.1rem 0.35rem",borderRadius:"2px",letterSpacing:"0.1em"}}>YOU</span>}
{member.pending&&<span style={{fontSize:"0.5rem",color:"#888",background:"rgba(255,255,255,0.05)",padding:"0.1rem 0.35rem",borderRadius:"2px",letterSpacing:"0.1em"}}>OPEN</span>}
</div>
<div style={{fontSize:"0.6rem",color:"#444",marginTop:"0.1rem"}}>{member.pending?"Spot available":member.roundsPlayed===0?"No rounds yet":`${member.roundsPlayed} rounds`}</div>
</div>
<div style={{textAlign:"right",flexShrink:0}}>
{member.index!==null?(
<>
<div style={{fontSize:"1.1rem",fontWeight:700,color:scoreColor(member.index),lineHeight:1}}>{fmtScore(member.index)}</div>
{member.trend&&<div style={{fontSize:"0.6rem",color:member.trend==="down"?"#6B9E6B":"#D47070",marginTop:"0.15rem"}}>{member.trend==="down"?"↓":"↑"}</div>}
</>
):<div style={{fontSize:"0.7rem",color:"#444"}}>—</div>}
</div>
</div>
))}
<button style={{width:"100%",padding:"0.85rem",marginTop:"0.75rem",background:"transparent",border:"1px dashed rgba(196,160,90,0.3)",color:"#C4A05A",fontSize:"0.75rem",letterSpacing:"0.15em",textTransform:"uppercase",borderRadius:"4px",cursor:"pointer",fontFamily:"Georgia,serif"}}>
+ Invite Member ({10-MEMBERS.length} spots left)
</button>
</div>
)}

{activeTab==="challenges" && (
<div>
{CHALLENGES.filter(c=>c.status==="active").map(challenge=>(
<div key={challenge.id} style={{border:"1px solid rgba(196,160,90,0.25)",borderRadius:"6px",overflow:"hidden",marginBottom:"1rem"}}>
<div style={{padding:"0.85rem 0.75rem",background:"rgba(196,160,90,0.06)",borderBottom:"1px solid rgba(196,160,90,0.15)"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div>
<div style={{fontSize:"0.9rem",fontWeight:700}}>{challenge.course}</div>
<div style={{fontSize:"0.6rem",color:"#555",marginTop:"0.1rem"}}>Slope {challenge.slope} · Issued by {challenge.issuedBy}</div>
</div>
<div style={{textAlign:"right"}}>
<div style={{fontSize:"0.6rem",color:"#C4A05A",background:"rgba(196,160,90,0.1)",padding:"0.2rem 0.5rem",borderRadius:"2px",letterSpacing:"0.08em"}}>ACTIVE</div>
<div style={{fontSize:"0.6rem",color:"#555",marginTop:"0.25rem"}}>{Math.ceil((challenge.deadline-Date.now())/86400000)}d left</div>
</div>
</div>
</div>
{challenge.scores.sort((a,b)=>(a.score??999)-(b.score??999)).map((s,i)=>(
<div key={s.id} style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.6rem 0.75rem",borderBottom:"1px solid rgba(255,255,255,0.04)",background:i===0&&s.score!==null?"rgba(107,158,107,0.05)":"transparent"}}>
<div style={{fontSize:"0.65rem",color:"#444",width:"1rem",textAlign:"center"}}>{s.score!==null?i+1:"—"}</div>
<Avatar name={s.name} size={28} isYou={s.isYou}/>
<div style={{flex:1}}>
<div style={{fontSize:"0.78rem"}}>{s.name}</div>
{s.playedAt&&<div style={{fontSize:"0.55rem",color:"#444"}}>{fmtAgo(s.playedAt)}</div>}
</div>
{s.score!==null?<div style={{fontSize:"1rem",fontWeight:700,color:scoreColor(s.score)}}>{fmtScore(s.score)}</div>:<div style={{fontSize:"0.65rem",color:"#444"}}>Not played</div>}
</div>
))}
<div style={{padding:"0.6rem 0.75rem",borderTop:"1px solid rgba(255,255,255,0.04)"}}>
<button style={{width:"100%",padding:"0.7rem",background:"#C4A05A",border:"none",color:"#0F0F0E",fontSize:"0.75rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",borderRadius:"3px",cursor:"pointer",fontFamily:"Georgia,serif"}}>
Play This Course →
</button>
</div>
</div>
))}
<button style={{width:"100%",padding:"0.85rem",marginBottom:"1.25rem",background:"transparent",border:"1px solid rgba(196,160,90,0.3)",color:"#C4A05A",fontSize:"0.75rem",letterSpacing:"0.15em",textTransform:"uppercase",borderRadius:"4px",cursor:"pointer",fontFamily:"Georgia,serif"}}>
+ Issue New Challenge
</button>
{CHALLENGES.filter(c=>c.status==="completed").map(challenge=>{
const winner=challenge.scores.reduce((b,s)=>s.score!==null&&s.score<(b?.score??Infinity)?s:b,null);
return (
<div key={challenge.id} style={{border:"1px solid rgba(255,255,255,0.06)",borderRadius:"6px",overflow:"hidden",marginBottom:"0.75rem"}}>
<div style={{padding:"0.75rem",background:"rgba(255,255,255,0.02)",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
<div style={{display:"flex",justifyContent:"space-between"}}>
<div><div style={{fontSize:"0.85rem",fontWeight:700}}>{challenge.course}</div><div style={{fontSize:"0.6rem",color:"#555"}}>Slope {challenge.slope}</div></div>
<div style={{textAlign:"right"}}>
<div style={{fontSize:"0.6rem",color:"#555",background:"rgba(255,255,255,0.04)",padding:"0.2rem 0.5rem",borderRadius:"2px"}}>ENDED</div>
{winner&&<div style={{fontSize:"0.6rem",color:"#6B9E6B",marginTop:"0.25rem"}}>🏆 {winner.name}</div>}
</div>
</div>
</div>
{challenge.scores.sort((a,b)=>(a.score??999)-(b.score??999)).map((s,i)=>(
<div key={s.id} style={{display:"flex",alignItems:"center",gap:"0.75rem",padding:"0.5rem 0.75rem",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
<div style={{fontSize:"0.6rem",color:i===0?"#C4A05A":"#444",width:"1rem",textAlign:"center"}}>{i===0?"🏆":i+1}</div>
<Avatar name={s.name} size={26} isYou={s.isYou}/>
<div style={{flex:1,fontSize:"0.75rem"}}>{s.name}</div>
<div style={{fontSize:"0.9rem",fontWeight:700,color:scoreColor(s.score)}}>{fmtScore(s.score)}</div>
</div>
))}
</div>
);
})}
</div>
)}

{activeTab==="club" && (
<div>
<div style={{fontSize:"0.58rem",letterSpacing:"0.18em",color:"#555",textTransform:"uppercase",marginBottom:"0.75rem"}}>Club Details</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"1.25rem"}}>
{[
{label:"Club Index",value:fmtScore(CLUB.collectiveIndex),color:scoreColor(CLUB.collectiveIndex)},
{label:"Global Rank",value:`#${CLUB.rank}`,color:"#C4A05A"},
{label:"Total Rounds",value:MEMBERS.reduce((s,m)=>s+m.roundsPlayed,0),color:"#E8E0D0"},
{label:"Active Members",value:MEMBERS.filter(m=>m.active).length,color:"#E8E0D0"},
].map(stat=>(
<div key={stat.label} style={{padding:"0.85rem",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:"4px"}}>
<div style={{fontSize:"0.55rem",color:"#555",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.3rem"}}>{stat.label}</div>
<div style={{fontSize:"1.3rem",fontWeight:700,color:stat.color}}>{stat.value}</div>
</div>
))}
</div>
<div style={{fontSize:"0.58rem",letterSpacing:"0.18em",color:"#555",textTransform:"uppercase",marginBottom:"0.75rem"}}>Course Records</div>
{[{course:"Riverside",slope:144,record:-1.09,holder:"Eli S."},{course:"Highlands",slope:152,record:0.88,holder:"Ryan H."}].map(rec=>(
<div key={rec.course} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.75rem",marginBottom:"0.35rem",background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)",borderRadius:"4px"}}>
<div><div style={{fontSize:"0.82rem",fontWeight:700}}>{rec.course}</div><div style={{fontSize:"0.6rem",color:"#555"}}>Slope {rec.slope} · {rec.holder}</div></div>
<div style={{fontSize:"1.1rem",fontWeight:700,color:scoreColor(rec.record)}}>{fmtScore(rec.record)}</div>
</div>
))}
<div style={{marginTop:"2rem",paddingTop:"1rem",borderTop:"1px solid rgba(255,255,255,0.05)"}}>
<button style={{width:"100%",padding:"0.75rem",background:"transparent",border:"1px solid rgba(255,255,255,0.08)",color:"#666",fontSize:"0.75rem",letterSpacing:"0.1em",textTransform:"uppercase",borderRadius:"4px",cursor:"pointer",fontFamily:"Georgia,serif",marginBottom:"0.5rem"}}>Edit Club Name</button>
<button style={{width:"100%",padding:"0.75rem",background:"transparent",border:"1px solid rgba(180,80,80,0.2)",color:"#D47070",fontSize:"0.75rem",letterSpacing:"0.1em",textTransform:"uppercase",borderRadius:"4px",cursor:"pointer",fontFamily:"Georgia,serif"}}>Leave Club</button>
</div>
</div>
)}
</div>
```

);
}

// ══════════════════════════════════════════════════════════════════════════
// BOTTOM NAV
// ══════════════════════════════════════════════════════════════════════════
function BottomNav({ activePage, onNavigate }) {
const items = [
{ id:“play”, label:“Play”, icon:“⛳” },
{ id:“stats”, label:“Stats”, icon:“📊” },
{ id:“club”, label:“Club”, icon:“🏛️” },
];
return (
<div style={{position:“fixed”,bottom:0,left:0,right:0,background:”#0F0F0E”,borderTop:“1px solid rgba(196,160,90,0.15)”,display:“flex”,padding:“0.75rem 0 1rem”,zIndex:20}}>
{items.map(item=>(
<div key={item.id} onClick={()=>onNavigate(item.id)} style={{flex:1,display:“flex”,flexDirection:“column”,alignItems:“center”,gap:“0.2rem”,cursor:“pointer”}}>
<div style={{fontSize:“1.1rem”}}>{item.icon}</div>
<div style={{fontSize:“0.55rem”,letterSpacing:“0.1em”,textTransform:“uppercase”,color:activePage===item.id?”#C4A05A”:”#444”,transition:“color 0.2s”}}>{item.label}</div>
</div>
))}
</div>
);
}

// ══════════════════════════════════════════════════════════════════════════
// ROOT
// ══════════════════════════════════════════════════════════════════════════
export default function Home() {
const { isLoading, user } = db.useAuth();
const [page, setPage] = useState(“play”);
const [gameState, setGameState] = useState({
screen: “select”, courseKey: null, restTime: 75,
holeIdx: 0, restNextHole: null, results: [], saving: false,
});

// Query user’s rounds from InstantDB
const { data } = db.useQuery(user ? { rounds: {} } : null);
const allRounds = data?.rounds || [];
const myRounds = allRounds.filter(r => r.userId === user?.id)
.sort((a,b) => b.playedAt - a.playedAt);

const { screen, courseKey, restTime, holeIdx, restNextHole, results, saving } = gameState;
const courseData = courseKey ? COURSES[courseKey] : null;
const hole = courseData?.holes[holeIdx];

if (isLoading) return (
<div style={{minHeight:“100vh”,background:”#0F0F0E”,display:“flex”,alignItems:“center”,justifyContent:“center”,color:”#C4A05A”,fontFamily:“Georgia,serif”,fontSize:“0.8rem”,letterSpacing:“0.2em”,textTransform:“uppercase”}}>
Loading…
</div>
);
if (!user) return <Auth />;

function start(key, rest) {
setGameState({ screen:“countdown”, courseKey:key, restTime:rest, holeIdx:0, restNextHole:null, results:[], saving:false });
setPage(“play”);
}

function completeHole(time) {
const newResults = […results, time];
const nextIdx = holeIdx + 1;
const isLast = nextIdx >= courseData.holes.length;
if (isLast) {
setGameState(s => ({…s, screen:“scorecard”, results:newResults}));
} else {
setGameState(s => ({…s, screen:“rest”, holeIdx:nextIdx, restNextHole:courseData.holes[nextIdx], results:newResults}));
}
}

async function saveRound() {
try {
setGameState(s => ({…s, saving:true}));
const avgs = categoryAverages(courseData.holes, results);
const sd = getFinalScore(avgs, restTime);
await db.transact(
db.tx.rounds[crypto.randomUUID()].update({
userId: user.id,
courseKey,
courseName: courseData.name,
finalScore: sd.final,
movementAvg: sd.mov,
restTime,
restModifier: sd.mod,
upperStrength: avgs.US ?? 0,
lowerStrength: avgs.LS ?? 0,
core: avgs.Core ?? 0,
cardio: avgs.Cardio ?? 0,
holeTimes: results,
playedAt: Date.now(),
})
);
restart();
setPage(“stats”);
} catch (e) {
alert(“Error saving: “ + e.message);
setGameState(s => ({…s, saving:false}));
}
}

function restart() {
setGameState({ screen:“select”, courseKey:null, restTime:75, holeIdx:0, restNextHole:null, results:[], saving:false });
}

const isInRound = screen !== “select” && screen !== “scorecard”;

return (
<div style={{minHeight:“100vh”,background:”#0F0F0E”,color:”#E8E0D0”,fontFamily:“Georgia,serif”}}>
{/* Header */}
<div style={{borderBottom:“1px solid rgba(196,160,90,0.2)”,padding:“0.9rem 1.25rem”,display:“flex”,alignItems:“center”,justifyContent:“space-between”,position:“sticky”,top:0,background:”#0F0F0E”,zIndex:10}}>
<div>
<div style={{fontSize:“0.55rem”,letterSpacing:“0.2em”,color:”#C4A05A”,textTransform:“uppercase”}}>Elite Calisthenics Tour</div>
<div style={{fontSize:“1.2rem”,fontWeight:700}}>FitLinks</div>
</div>
<div style={{display:“flex”,alignItems:“center”,gap:“1rem”}}>
{courseData && isInRound && <div style={{fontSize:“0.65rem”,color:”#555”}}>{courseData.name} · {courseData.slope}</div>}
<button onClick={()=>db.auth.signOut()} style={{fontSize:“0.6rem”,color:”#555”,background:“none”,border:“none”,cursor:“pointer”,letterSpacing:“0.1em”,textTransform:“uppercase”}}>Out</button>
</div>
</div>

```
{/* Pages */}
{page==="play" && (
<>
{screen==="select" && <SelectScreen onStart={start} user={user} rounds={myRounds}/>}
{screen==="countdown" && hole && <CountdownScreen hole={hole} onGo={()=>setGameState(s=>({...s,screen:"active"}))}/>}
{screen==="active" && hole && <ActiveScreen hole={hole} holeIndex={holeIdx} totalHoles={courseData.holes.length} onComplete={completeHole}/>}
{screen==="rest" && restNextHole && <RestScreen restTime={restTime} nextHole={restNextHole} onDone={()=>setGameState(s=>({...s,screen:"countdown"}))}/>}
{screen==="scorecard" && courseData && <ScorecardScreen course={courseData} results={results} restTime={restTime} onRestart={restart} onSave={saveRound} saving={saving}/>}
</>
)}
{page==="stats" && <StatsPage rounds={myRounds}/>}
{page==="club" && <ClubhousePage user={user}/>}

{/* Bottom Nav — hide during active workout */}
{!isInRound && <BottomNav activePage={page} onNavigate={setPage}/>}
</div>
```

);
}