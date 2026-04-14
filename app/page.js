"use client";
import { useState, useEffect, useRef } from "react";

const COURSES = {
riverside: {
name: "Riverside",
club: "Atlanta Athletic Club",
slope: 144,
holes: [
{ id: 1, name: "Push Up Shoulder Taps", reps: 20, category: "US", par: 60, type: "reps" },
{ id: 2, name: "Squat Reverse Lunges", reps: 15, category: "LS", par: 52.5, type: "reps" },
{ id: 3, name: "Sit Ups", reps: 30, category: "Core", par: 45, type: "reps" },
{ id: 4, name: "Reverse Grip Pull Ups", reps: 8, category: "US", par: 16, type: "reps" },
{ id: 5, name: "Jumping Lunges", reps: 20, category: "LS", par: 20, type: "reps" },
{ id: 6, name: ".25 Mile Run", reps: null, category: "Cardio", par: 110, type: "reps" },
{ id: 7, name: "Reverse Grip Pull Ups", reps: 8, category: "US", par: 16, type: "reps" },
{ id: 8, name: "Jumping Lunges", reps: 20, category: "LS", par: 20, type: "reps" },
{ id: 9, name: "Sit Ups", reps: 30, category: "Core", par: 45, type: "reps" },
{ id: 10, name: "Push Up Shoulder Taps", reps: 20, category: "US", par: 60, type: "reps" },
{ id: 11, name: "Squat Reverse Lunges", reps: 15, category: "LS", par: 52.5, type: "reps" },
{ id: 12, name: ".25 Mile Run", reps: null, category: "Cardio", par: 110, type: "reps" },
{ id: 13, name: "Push Up Shoulder Taps", reps: 20, category: "US", par: 60, type: "reps" },
{ id: 14, name: "Squat Reverse Lunges", reps: 15, category: "LS", par: 52.5, type: "reps" },
{ id: 15, name: "Plank Hold", reps: null, category: "Core", par: 120, type: "hold" },
{ id: 16, name: "Reverse Grip Pull Ups", reps: 8, category: "US", par: 16, type: "reps" },
{ id: 17, name: "Jumping Lunges", reps: 20, category: "LS", par: 20, type: "reps" },
{ id: 18, name: ".25 Mile Run", reps: null, category: "Cardio", par: 110, type: "reps" },
],
},
highlands: {
name: "Highlands",
club: "Atlanta Athletic Club",
slope: 152,
holes: [
{ id: 1, name: "Push Up Shoulder Taps", reps: 25, category: "US", par: 75, type: "reps" },
{ id: 2, name: "Squat Reverse Lunges", reps: 20, category: "LS", par: 70, type: "reps" },
{ id: 3, name: "Sit Ups", reps: 30, category: "Core", par: 45, type: "reps" },
{ id: 4, name: "Reverse Grip Pull Ups", reps: 10, category: "US", par: 20, type: "reps" },
{ id: 5, name: "Jumping Lunges", reps: 25, category: "LS", par: 25, type: "reps" },
{ id: 6, name: ".25 Mile Run", reps: null, category: "Cardio", par: 110, type: "reps" },
{ id: 7, name: "Reverse Grip Pull Ups", reps: 10, category: "US", par: 20, type: "reps" },
{ id: 8, name: "Jumping Lunges", reps: 25, category: "LS", par: 25, type: "reps" },
{ id: 9, name: "Sit Ups", reps: 30, category: "Core", par: 45, type: "reps" },
{ id: 10, name: "Push Up Shoulder Taps", reps: 25, category: "US", par: 75, type: "reps" },
{ id: 11, name: "Squat Reverse Lunges", reps: 20, category: "LS", par: 70, type: "reps" },
{ id: 12, name: ".25 Mile Run", reps: null, category: "Cardio", par: 110, type: "reps" },
{ id: 13, name: "Push Up Shoulder Taps", reps: 25, category: "US", par: 75, type: "reps" },
{ id: 14, name: "Squat Reverse Lunges", reps: 20, category: "LS", par: 70, type: "reps" },
{ id: 15, name: "Sit Ups", reps: 30, category: "Core", par: 45, type: "reps" },
{ id: 16, name: "Reverse Grip Pull Ups", reps: 10, category: "US", par: 20, type: "reps" },
{ id: 17, name: "Jumping Lunges", reps: 25, category: "LS", par: 25, type: "reps" },
{ id: 18, name: ".25 Mile Run", reps: null, category: "Cardio", par: 110, type: "reps" },
],
},
};

const CAT = {
US: { bg: "rgba(196,160,90,0.12)", border: "#C4A05A", text: "#C4A05A", label: "Upper Strength" },
LS: { bg: "rgba(74,111,74,0.15)", border: "#4A6F4A", text: "#6B9E6B", label: "Lower Strength" },
Core: { bg: "rgba(100,130,160,0.15)", border: "#6482A0", text: "#8AAAC8", label: "Core" },
Cardio: { bg: "rgba(180,80,80,0.15)", border: "#B45050", text: "#D47070", label: "Cardio" },
};

function calcScore(time, par, type) {
if (time == null) return null;
if (type === "hold") return ((par - time) / par) * 10;
return ((time - par) / par) * 10;
}

function fmtScore(v) {
if (v == null) return "—";
if (Math.abs(v) < 0.005) return "E";
return (v < 0 ? "" : "+") + v.toFixed(2);
}

function scoreColor(v) {
if (v == null) return "#555";
if (v < 0) return "#6B9E6B";
if (v === 0) return "#C4A05A";
return "#D47070";
}

function categoryAverages(holes, results) {
const cats = ["US","LS","Core","Cardio"];
const out = {};
cats.forEach(cat => {
const relevant = holes.map((h,i) => ({ h, r: results[i] })).filter(x => x.h.category === cat && x.r != null);
if (!relevant.length) { out[cat] = null; return; }
out[cat] = relevant.reduce((s,x) => s + calcScore(x.r, x.h.par, x.h.type), 0) / relevant.length;
});
return out;
}

function getFinalScore(avgs, restTime) {
const vals = Object.values(avgs).filter(v => v != null);
if (!vals.length) return null;
const mov = vals.reduce((s,v) => s+v, 0) / vals.length;
const mod = 1 + ((restTime - 90) / 90) * 0.2;
return { mov, mod, final: mov * mod };
}

function SelectScreen({ onStart }) {
const [sel, setSel] = useState("riverside");
const [rest, setRest] = useState(90);
const mod = 1 + ((rest - 90) / 90) * 0.2;

return (
<div style={{ padding:"1.5rem 1.25rem", maxWidth:500, margin:"0 auto" }}>
<div style={{ textAlign:"center", marginBottom:"2rem" }}>
<div style={{ fontSize:"0.65rem", letterSpacing:"0.2em", color:"#C4A05A", textTransform:"uppercase", marginBottom:"0.4rem" }}>Elite Calisthenics Tour</div>
<div style={{ fontSize:"2rem", fontWeight:700 }}>FitLinks</div>
<div style={{ fontSize:"0.8rem", color:"#555" }}>Golf-style fitness scoring</div>
</div>
{Object.entries(COURSES).map(([key, c]) => (
<div key={key} onClick={() => setSel(key)} style={{ padding:"1rem", marginBottom:"0.75rem", borderRadius:"4px", cursor:"pointer", border:`1px solid ${sel===key?"#C4A05A":"rgba(255,255,255,0.07)"}`, background: sel===key?"rgba(196,160,90,0.07)":"rgba(255,255,255,0.02)" }}>
<div style={{ display:"flex", justifyContent:"space-between" }}>
<div>
<div style={{ fontSize:"1.05rem", fontWeight:700, color: sel===key?"#E8E0D0":"#999" }}>{c.name}</div>
<div style={{ fontSize:"0.65rem", color:"#555" }}>{c.club}</div>
</div>
<div style={{ textAlign:"right" }}>
<div style={{ fontSize:"0.55rem", color:"#555", textTransform:"uppercase" }}>Slope</div>
<div style={{ fontSize:"1.3rem", fontWeight:700, color: sel===key?"#C4A05A":"#444" }}>{c.slope}</div>
</div>
</div>
</div>
))}
<div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:"4px", padding:"1rem", margin:"0.75rem 0 1.5rem" }}>
<div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.5rem" }}>
<div>
<div style={{ fontSize:"0.6rem", letterSpacing:"0.15em", color:"#777", textTransform:"uppercase" }}>Rest Between Stations</div>
<div style={{ fontSize:"0.6rem", color:"#444" }}>Par = 90 sec</div>
</div>
<div style={{ textAlign:"right" }}>
<span style={{ fontSize:"1.5rem", fontWeight:700, color: rest<90?"#6B9E6B":rest>90?"#D47070":"#C4A05A" }}>{rest}s</span>
<div style={{ fontSize:"0.6rem", color:"#444" }}>mod {mod.toFixed(2)}×</div>
</div>
</div>
<input type="range" min={30} max={180} step={10} value={rest} onChange={e => setRest(Number(e.target.value))} style={{ width:"100%", accentColor:"#C4A05A" }} />
</div>
<button onClick={() => onStart(sel, rest)} style={{ width:"100%", padding:"1rem", background:"#C4A05A", border:"none", color:"#0F0F0E", fontSize:"0.85rem", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", borderRadius:"4px", cursor:"pointer" }}>
Begin Round →
</button>
</div>
);
}

function CountdownScreen({ hole, onGo }) {
const [phase, setPhase] = useState(0);
useEffect(() => {
const t1 = setTimeout(() => setPhase(1), 1000);
const t2 = setTimeout(() => setPhase(2), 2000);
const t3 = setTimeout(onGo, 2700);
return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
}, []);
const words = ["Ready", "Set", "GO!"];
const colors = ["#C4A05A","#C4A05A","#6B9E6B"];
return (
<div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", textAlign:"center", padding:"2rem" }}>
<div style={{ fontSize:"0.6rem", letterSpacing:"0.2em", color:"#555", textTransform:"uppercase", marginBottom:"1.5rem" }}>Hole {hole.id} · {CAT[hole.category].label}</div>
<div style={{ fontSize:"1.5rem", fontWeight:700, color:"#E8E0D0", marginBottom:"0.5rem" }}>{hole.name}</div>
{hole.reps && <div style={{ fontSize:"0.85rem", color: CAT[hole.category].text, marginBottom:"3rem" }}>{hole.reps} reps</div>}
<div style={{ fontSize:"5.5rem", fontWeight:700, color: colors[phase], transition:"all 0.25s", transform: phase===2?"scale(1.15)":"scale(1)" }}>{words[phase]}</div>
</div>
);
}

function ActiveScreen({ hole, holeIndex, totalHoles, onComplete }) {
const [elapsed, setElapsed] = useState(0);
const ref = useRef(null);
useEffect(() => {
ref.current = setInterval(() => setElapsed(e => Math.round((e+0.1)*10)/10), 100);
return () => clearInterval(ref.current);
}, []);
function done() { clearInterval(ref.current); onComplete(elapsed); }
const pct = Math.min(elapsed / hole.par, 1);
const over = elapsed > hole.par;
const r = 82; const circ = 2 * Math.PI * r;
return (
<div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"1.5rem 1.25rem 2rem", minHeight:"100vh" }}>
<div style={{ width:"100%", maxWidth:420, marginBottom:"1.75rem" }}>
<div style={{ height:"2px", background:"rgba(255,255,255,0.06)", borderRadius:"1px" }}>
<div style={{ height:"100%", width:`${(holeIndex/totalHoles)*100}%`, background:"#C4A05A", borderRadius:"1px" }} />
</div>
</div>
<div style={{ fontSize:"0.6rem", letterSpacing:"0.12em", textTransform:"uppercase", color: CAT[hole.category].text, background: CAT[hole.category].bg, border:`1px solid ${CAT[hole.category].border}44`, padding:"0.25rem 0.65rem", borderRadius:"2px", marginBottom:"0.75rem" }}>{CAT[hole.category].label}</div>
<div style={{ fontSize:"1.5rem", fontWeight:700, textAlign:"center", marginBottom:"0.35rem" }}>{hole.name}</div>
<div style={{ fontSize:"0.8rem", color:"#666", marginBottom:"2rem" }}>{hole.reps ? `${hole.reps} reps` : hole.type==="hold"?"Hold as long as possible":"Complete the distance"}</div>
<div style={{ position:"relative", marginBottom:"1.5rem" }}>
<svg width={190} height={190} style={{ transform:"rotate(-90deg)" }}>
<circle cx={95} cy={95} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={7} />
<circle cx={95} cy={95} r={r} fill="none" stroke={over?"#D47070":"#C4A05A"} strokeWidth={7} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} style={{ transition:"stroke-dashoffset 0.08s linear, stroke 0.3s" }} />
</svg>
<div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
<div style={{ fontSize:"3.2rem", fontWeight:700, color: over?"#D47070":"#E8E0D0" }}>{elapsed.toFixed(1)}</div>
<div style={{ fontSize:"0.6rem", color:"#444" }}>PAR {hole.par}s</div>
</div>
</div>
<div style={{ fontSize:"0.75rem", marginBottom:"2rem", color: over?"#D47070":"#6B9E6B" }}>
{over ? `+${(elapsed-hole.par).toFixed(1)}s over par` : elapsed>0?`-${(hole.par-elapsed).toFixed(1)}s under par`:""}
</div>
<button onClick={done} style={{ width:"100%", maxWidth:380, padding:"1.1rem", background:"#C4A05A", border:"none", color:"#0F0F0E", fontSize:"1rem", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", borderRadius:"4px", cursor:"pointer" }}>Complete ✓</button>
</div>
);
}

function RestScreen({ restTime, nextHole, onDone }) {
const [rem, setRem] = useState(restTime);
useEffect(() => {
if (rem <= 0) { onDone(); return; }
const t = setTimeout(() => setRem(r => r-1), 1000);
return () => clearTimeout(t);
}, [rem]);
const r = 70; const circ = 2 * Math.PI * r;
return (
<div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"100vh", padding:"2rem", textAlign:"center" }}>
<div style={{ fontSize:"0.6rem", letterSpacing:"0.2em", color:"#555", textTransform:"uppercase", marginBottom:"2rem" }}>Rest Period</div>
<div style={{ position:"relative", marginBottom:"2rem" }}>
<svg width={160} height={160} style={{ transform:"rotate(-90deg)" }}>
<circle cx={80} cy={80} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={5} />
<circle cx={80} cy={80} r={r} fill="none" stroke="rgba(100,130,160,0.5)" strokeWidth={5} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ*(1-rem/restTime)} style={{ transition:"stroke-dashoffset 0.9s linear" }} />
</svg>
<div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
<div style={{ fontSize:"3rem", fontWeight:700, color:"#8AAAC8" }}>{rem}</div>
<div style={{ fontSize:"0.6rem", color:"#444" }}>seconds</div>
</div>
</div>
<div style={{ fontSize:"0.75rem", color:"#555", marginBottom:"0.4rem" }}>Next up</div>
<div style={{ fontSize:"1.15rem", fontWeight:700 }}>{nextHole.name}</div>
{nextHole.reps && <div style={{ fontSize:"0.75rem", color: CAT[nextHole.category].text, marginTop:"0.25rem" }}>{nextHole.reps} reps</div>}
<button onClick={onDone} style={{ marginTop:"2rem", padding:"0.7rem 2rem", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", color:"#666", fontSize:"0.75rem", letterSpacing:"0.1em", textTransform:"uppercase", borderRadius:"4px", cursor:"pointer" }}>Skip Rest</button>
</div>
);
}

function ScorecardScreen({ course, results, restTime, onRestart }) {
const avgs = categoryAverages(course.holes, results);
const scoreData = getFinalScore(avgs, restTime);
const final = scoreData?.final;
const mov = scoreData?.mov;
const mod = scoreData?.mod;
return (
<div style={{ padding:"1.25rem 1rem 5rem", maxWidth:500, margin:"0 auto" }}>
<div style={{ textAlign:"center", padding:"1.5rem", border:"1px solid rgba(196,160,90,0.3)", borderRadius:"4px", background:"rgba(196,160,90,0.04)", marginBottom:"1.25rem" }}>
<div style={{ fontSize:"0.55rem", letterSpacing:"0.2em", color:"#555", textTransform:"uppercase", marginBottom:"0.4rem" }}>{course.name} · Slope {course.slope}</div>
<div style={{ fontSize:"4rem", fontWeight:700, color: scoreColor(final) }}>{fmtScore(final)}</div>
<div style={{ fontSize:"0.65rem", color:"#444", marginTop:"0.4rem" }}>Movement {fmtScore(mov)} × Rest {mod?.toFixed(2)}×</div>
<div style={{ marginTop:"0.75rem", fontSize:"0.75rem", color: final<0?"#6B9E6B":final<1?"#C4A05A":"#D47070" }}>
{final<-1?"🔥 Exceptional":final<0?"✓ Under par":final<1?"Near scratch":"Keep grinding"}
</div>
</div>
<div style={{ marginBottom:"1.25rem" }}>
{["US","LS","Core","Cardio"].map(cat => (
<div key={cat} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"0.6rem 0.75rem", marginBottom:"0.35rem", background: CAT[cat].bg, borderLeft:`3px solid ${CAT[cat].border}`, borderRadius:"2px" }}>
<span style={{ fontSize:"0.78rem", color: CAT[cat].text }}>{CAT[cat].label}</span>
<span style={{ fontSize:"0.85rem", fontWeight:700, color: scoreColor(avgs[cat]) }}>{fmtScore(avgs[cat])}</span>
</div>
))}
</div>
<button onClick={onRestart} style={{ width:"100%", padding:"0.9rem", background:"transparent", border:"1px solid rgba(196,160,90,0.35)", color:"#C4A05A", fontSize:"0.8rem", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", borderRadius:"4px", cursor:"pointer" }}>Play Another Round</button>
</div>
);
}

export default function Home() {
const [screen, setScreen] = useState("select");
const [course, setCourse] = useState(null);
const [restTime, setRestTime] = useState(90);
const [holeIdx, setHoleIdx] = useState(0);
const [results, setResults] = useState([]);
const courseData = course ? COURSES[course] : null;
const hole = courseData?.holes[holeIdx];
const nextHole = courseData?.holes[holeIdx+1];
function start(c, r) { setCourse(c); setRestTime(r); setHoleIdx(0); setResults([]); setScreen("countdown"); }
function completeHole(time) {
const newRes = [...results, time];
setResults(newRes);
if (holeIdx+1 >= courseData.holes.length) { setScreen("scorecard"); }
else { setHoleIdx(holeIdx+1); setScreen("rest"); }
}
return (
<div style={{ minHeight:"100vh", background:"#0F0F0E", color:"#E8E0D0", fontFamily:"Georgia,serif" }}>
<div style={{ borderBottom:"1px solid rgba(196,160,90,0.2)", padding:"0.9rem 1.25rem", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, background:"#0F0F0E", zIndex:10 }}>
<div>
<div style={{ fontSize:"0.55rem", letterSpacing:"0.2em", color:"#C4A05A", textTransform:"uppercase" }}>Elite Calisthenics Tour</div>
<div style={{ fontSize:"1.2rem", fontWeight:700 }}>FitLinks</div>
</div>
</div>
{screen==="select" && <SelectScreen onStart={start} />}
{screen==="countdown" && hole && <CountdownScreen hole={hole} onGo={() => setScreen("active")} />}
{screen==="active" && hole && <ActiveScreen hole={hole} holeIndex={holeIdx} totalHoles={courseData.holes.length} onComplete={completeHole} />}
{screen==="rest" && nextHole && <RestScreen restTime={restTime} nextHole={nextHole} onDone={() => setScreen("countdown")} />}
{screen==="scorecard" && courseData && <ScorecardScreen course={courseData} results={results} restTime={restTime} onRestart={() => setScreen("select")} />}
</div>
);
}
