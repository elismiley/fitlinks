"use client";
import { useState, useEffect, useRef } from "react";
import db from "../lib/db";
import Auth from "./auth";

const COURSES = {
riverside: {
name: "Riverside", club: "Atlanta Athletic Club", slope: 144,
holes: [
{ id: 1, name: "Hand Release Push Ups", reps: 25, category: "US", par: 62.5, type: "reps" },
{ id: 2, name: "Squat Reverse Lunges", reps: 15, category: "LS", par: 52.5, type: "reps" },
{ id: 3, name: "Sit Ups", reps: 30, category: "Core", par: 45, type: "reps" },
{ id: 4, name: "Reverse Grip Pull Ups", reps: 14, category: "US", par: 28, type: "reps" },
{ id: 5, name: "Jumping Lunges", reps: 20, category: "LS", par: 20, type: "reps" },
{ id: 6, name: ".25 Mile Run", reps: null, category: "Cardio", par: 110, type: "reps" },
{ id: 7, name: "Reverse Grip Pull Ups", reps: 14, category: "US", par: 28, type: "reps" },
{ id: 8, name: "Jumping Lunges", reps: 20, category: "LS", par: 20, type: "reps" },
{ id: 9, name: "Sit Ups", reps: 30, category: "Core", par: 45, type: "reps" },
{ id: 10, name: "Hand Release Push Ups", reps: 25, category: "US", par: 62.5, type: "reps" },
{ id: 11, name: "Squat Reverse Lunges", reps: 15, category: "LS", par: 52.5, type: "reps" },
{ id: 12, name: ".25 Mile Run", reps: null, category: "Cardio", par: 110, type: "reps" },
{ id: 13, name: "Hand Release Push Ups", reps: 25, category: "US", par: 62.5, type: "reps" },
{ id: 14, name: "Squat Reverse Lunges", reps: 15, category: "LS", par: 52.5, type: "reps" },
{ id: 15, name: "Plank Hold", reps: null, category: "Core", par: 120, type: "hold" },
{ id: 16, name: "Reverse Grip Pull Ups", reps: 14, category: "US", par: 28, type: "reps" },
{ id: 17, name: "Jumping Lunges", reps: 20, category: "LS", par: 20, type: "reps" },
{ id: 18, name: ".25 Mile Run", reps: null, category: "Cardio", par: 110, type: "reps" },
],
},
highlands: {
name: "Highlands", club: "Atlanta Athletic Club", slope: 152,
holes: [
{ id: 1, name: "Hand Release Push Ups", reps: 30, category: "US", par: 75, type: "reps" },
{ id: 2, name: "Squat Reverse Lunges", reps: 20, category: "LS", par: 70, type: "reps" },
{ id: 3, name: "Sit Ups", reps: 30, category: "Core", par: 45, type: "reps" },
{ id: 4, name: "Reverse Grip Pull Ups", reps: 16, category: "US", par: 32, type: "reps" },
{ id: 5, name: "Jumping Lunges", reps: 25, category: "LS", par: 25, type: "reps" },
{ id: 6, name: ".25 Mile Run", reps: null, category: "Cardio", par: 110, type: "reps" },
{ id: 7, name: "Reverse Grip Pull Ups", reps: 16, category: "US", par: 32, type: "reps" },
{ id: 8, name: "Jumping Lunges", reps: 25, category: "LS", par: 25, type: "reps" },
{ id: 9, name: "Sit Ups", reps: 30, category: "Core", par: 45, type: "reps" },
{ id: 10, name: "Hand Release Push Ups", reps: 30, category: "US", par: 75, type: "reps" },
{ id: 11, name: "Squat Reverse Lunges", reps: 20, category: "LS", par: 70, type: "reps" },
{ id: 12, name: ".25 Mile Run", reps: null, category: "Cardio", par: 110, type: "reps" },
{ id: 13, name: "Hand Release Push Ups", reps: 30, category: "US", par: 75, type: "reps" },
{ id: 14, name: "Squat Reverse Lunges", reps: 20, category: "LS", par: 70, type: "reps" },
{ id: 15, name: "Sit Ups", reps: 30, category: "Core", par: 45, type: "reps" },
{ id: 16, name: "Reverse Grip Pull Ups", reps: 16, category: "US", par: 32, type: "reps" },
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
return v < 0 ? "#6B9E6B" : v === 0 ? "#C4A05A" : "#D47070";
}
function categoryAverages(holes, results) {
const out = {};
["US","LS","Core","Cardio"].forEach(cat => {
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

function SelectScreen({ onStart, user }) {
const [sel, setSel] = useState("riverside");
const [rest, setRest] = useState(75);
const mod = 1+((rest-75)/75)*0.2;
return (
<div style={{padding:"1.5rem 1.25rem",maxWidth:500,margin:"0 auto"}}>
<div style={{textAlign:"center",marginBottom:"2rem"}}>
<div style={{fontSize:"0.65rem",letterSpacing:"0.2em",color:"#C4A05A",textTransform:"uppercase",marginBottom:"0.4rem"}}>Elite Calisthenics Tour</div>
<div style={{fontSize:"2rem",fontWeight:700}}>FitLinks</div>
<div style={{fontSize:"0.8rem",color:"#555"}}>Welcome, {user?.email?.split("@")[0]}</div>
</div>
{Object.entries(COURSES).map(([key,c]) => (
<div key={key} onClick={()=>setSel(key)} style={{padding:"1rem",marginBottom:"0.75rem",borderRadius:"4px",cursor:"pointer",border:`1px solid ${sel===key?"#C4A05A":"rgba(255,255,255,0.07)"}`,background:sel===key?"rgba(196,160,90,0.07)":"rgba(255,255,255,0.02)"}}>
<div style={{display:"flex",justifyContent:"space-between"}}>
<div>
<div style={{fontSize:"1.05rem",fontWeight:700,color:sel===key?"#E8E0D0":"#999"}}>{c.name}</div>
<div style={{fontSize:"0.65rem",color:"#555"}}>{c.club}</div>
</div>
<div style={{textAlign:"right"}}>
<div style={{fontSize:"0.55rem",color:"#555",textTransform:"uppercase"}}>Slope</div>
<div style={{fontSize:"1.3rem",fontWeight:700,color:sel===key?"#C4A05A":"#444"}}>{c.slope}</div>
</div>
</div>
</div>
))}
<div style={{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:"4px",padding:"1rem",margin:"0.75rem 0 1.5rem"}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.5rem"}}>
<div>
<div style={{fontSize:"0.6rem",letterSpacing:"0.15em",color:"#777",textTransform:"uppercase"}}>Rest Between Stations</div>
<div style={{fontSize:"0.6rem",color:"#444"}}>Par = 75 sec</div>
</div>
<div style={{textAlign:"right"}}>
<span style={{fontSize:"1.5rem",fontWeight:700,color:rest<75?"#6B9E6B":rest>75?"#D47070":"#C4A05A"}}>{rest}s</span>
<div style={{fontSize:"0.6rem",color:"#444"}}>mod {mod.toFixed(2)}×</div>
</div>
</div>
<input type="range" min={30} max={150} step={5} value={rest} onChange={e=>setRest(Number(e.target.value))} style={{width:"100%",accentColor:"#C4A05A"}}/>
<div style={{display:"flex",justifyContent:"space-between",fontSize:"0.55rem",color:"#3A3A3A",marginTop:"0.2rem"}}>
<span>30s aggressive</span><span>75s par</span><span>150s easy</span>
</div>
</div>
<button onClick={()=>onStart(sel,rest)} style={{width:"100%",padding:"1rem",background:"#C4A05A",border:"none",color:"#0F0F0E",fontSize:"0.85rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",borderRadius:"4px",cursor:"pointer"}}>
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
const words=["Ready","Set","GO!"];
const colors=["#C4A05A","#C4A05A","#6B9E6B"];
return (
<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"80vh",textAlign:"center",padding:"2rem"}}>
<div style={{fontSize:"0.6rem",letterSpacing:"0.2em",color:"#555",textTransform:"uppercase",marginBottom:"1.5rem"}}>Hole {hole.id} · {CAT[hole.category].label}</div>
<div style={{fontSize:"1.5rem",fontWeight:700,color:"#E8E0D0",marginBottom:"0.5rem"}}>{hole.name}</div>
{hole.reps && <div style={{fontSize:"0.85rem",color:CAT[hole.category].text,marginBottom:"3rem"}}>{hole.reps} reps</div>}
<div style={{fontSize:"5.5rem",fontWeight:700,color:colors[phase],transition:"all 0.25s",transform:phase===2?"scale(1.15)":"scale(1)"}}>{words[phase]}</div>
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
const isHold=hole.type==="hold";
const r=82; const circ=2*Math.PI*r;
const ringColor=isHold?(over?"#6B9E6B":"#D47070"):(over?"#D47070":"#C4A05A");
const textColor=isHold?(over?"#6B9E6B":"#D47070"):(over?"#D47070":"#E8E0D0");
return (
<div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"1.5rem 1.25rem 2rem"}}>
<div style={{width:"100%",maxWidth:420,marginBottom:"1.75rem"}}>
<div style={{display:"flex",justifyContent:"space-between",fontSize:"0.6rem",color:"#444",marginBottom:"0.3rem"}}>
<span>Hole {hole.id} of {totalHoles}</span>
<span>{Math.round((holeIndex/totalHoles)*100)}%</span>
</div>
<div style={{height:"2px",background:"rgba(255,255,255,0.06)",borderRadius:"1px"}}>
<div style={{height:"100%",width:`${(holeIndex/totalHoles)*100}%`,background:"#C4A05A",borderRadius:"1px"}}/>
</div>
</div>
<div style={{fontSize:"0.6rem",letterSpacing:"0.12em",textTransform:"uppercase",color:CAT[hole.category].text,background:CAT[hole.category].bg,border:`1px solid ${CAT[hole.category].border}44`,padding:"0.25rem 0.65rem",borderRadius:"2px",marginBottom:"0.75rem"}}>{CAT[hole.category].label}</div>
<div style={{fontSize:"1.5rem",fontWeight:700,textAlign:"center",marginBottom:"0.35rem"}}>{hole.name}</div>
<div style={{fontSize:"0.8rem",color:"#666",marginBottom:"2rem"}}>{hole.reps?`${hole.reps} reps`:isHold?"Hold as long as possible":"Complete the distance"}</div>
<div style={{position:"relative",marginBottom:"1.5rem"}}>
<svg width={190} height={190} style={{transform:"rotate(-90deg)"}}>
<circle cx={95} cy={95} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={7}/>
<circle cx={95} cy={95} r={r} fill="none" stroke={ringColor} strokeWidth={7} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} style={{transition:"stroke-dashoffset 0.08s linear,stroke 0.3s"}}/>
</svg>
<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
<div style={{fontSize:"3.2rem",fontWeight:700,color:textColor}}>{elapsed.toFixed(1)}</div>
<div style={{fontSize:"0.6rem",color:"#444"}}>PAR {hole.par}s</div>
</div>
</div>
<div style={{fontSize:"0.75rem",marginBottom:"2rem",minHeight:"1.2rem",color:isHold?(over?"#6B9E6B":"#D47070"):(over?"#D47070":"#6B9E6B")}}>
{isHold
? over?`+${(elapsed-hole.par).toFixed(1)}s over par 💪`:elapsed>0?`${(hole.par-elapsed).toFixed(1)}s to go`:""
: over?`+${(elapsed-hole.par).toFixed(1)}s over par`:elapsed>0?`-${(hole.par-elapsed).toFixed(1)}s under par`:""}
</div>
<button onClick={done} style={{width:"100%",maxWidth:380,padding:"1.1rem",background:"#C4A05A",border:"none",color:"#0F0F0E",fontSize:"1rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",borderRadius:"4px",cursor:"pointer"}}>Complete ✓</button>
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
<div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"80vh",padding:"2rem",textAlign:"center"}}>
<div style={{fontSize:"0.6rem",letterSpacing:"0.2em",color:"#555",textTransform:"uppercase",marginBottom:"2rem"}}>Rest Period</div>
<div style={{position:"relative",marginBottom:"2rem"}}>
<svg width={160} height={160} style={{transform:"rotate(-90deg)"}}>
<circle cx={80} cy={80} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={5}/>
<circle cx={80} cy={80} r={r} fill="none" stroke="rgba(100,130,160,0.5)" strokeWidth={5} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ*(1-rem/restTime)} style={{transition:"stroke-dashoffset 0.9s linear"}}/>
</svg>
<div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
<div style={{fontSize:"3rem",fontWeight:700,color:"#8AAAC8"}}>{rem}</div>
<div style={{fontSize:"0.6rem",color:"#444"}}>seconds</div>
</div>
</div>
<div style={{fontSize:"0.75rem",color:"#555",marginBottom:"0.4rem"}}>Next up</div>
<div style={{fontSize:"1.15rem",fontWeight:700}}>{nextHole.name}</div>
{nextHole.reps && <div style={{fontSize:"0.75rem",color:CAT[nextHole.category].text,marginTop:"0.25rem"}}>{nextHole.reps} reps</div>}
<button onClick={onDone} style={{marginTop:"2rem",padding:"0.7rem 2rem",background:"transparent",border:"1px solid rgba(255,255,255,0.1)",color:"#666",fontSize:"0.75rem",letterSpacing:"0.1em",textTransform:"uppercase",borderRadius:"4px",cursor:"pointer"}}>Skip Rest</button>
</div>
);
}

function ScorecardScreen({ course, results, restTime, onRestart, onSave }) {
const avgs=categoryAverages(course.holes,results);
const sd=getFinalScore(avgs,restTime);
return (
<div style={{padding:"1.25rem 1rem 5rem",maxWidth:500,margin:"0 auto"}}>
<div style={{textAlign:"center",padding:"1.5rem",border:"1px solid rgba(196,160,90,0.3)",borderRadius:"4px",background:"rgba(196,160,90,0.04)",marginBottom:"1.25rem"}}>
<div style={{fontSize:"0.55rem",letterSpacing:"0.2em",color:"#555",textTransform:"uppercase",marginBottom:"0.4rem"}}>{course.name} · Slope {course.slope}</div>
<div style={{fontSize:"4rem",fontWeight:700,color:scoreColor(sd?.final)}}>{fmtScore(sd?.final)}</div>
<div style={{fontSize:"0.65rem",color:"#444",marginTop:"0.4rem"}}>Movement {fmtScore(sd?.mov)} × Rest {sd?.mod?.toFixed(2)}×</div>
<div style={{marginTop:"0.75rem",fontSize:"0.75rem",color:sd?.final<0?"#6B9E6B":sd?.final<1?"#C4A05A":"#D47070"}}>
{sd?.final<-1?"🔥 Exceptional":sd?.final<0?"✓ Under par":sd?.final<1?"Near scratch":"Keep grinding"}
</div>
</div>
<div style={{marginBottom:"1.25rem"}}>
{["US","LS","Core","Cardio"].map(cat=>(
<div key={cat} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.6rem 0.75rem",marginBottom:"0.35rem",background:CAT[cat].bg,borderLeft:`3px solid ${CAT[cat].border}`,borderRadius:"2px"}}>
<span style={{fontSize:"0.78rem",color:CAT[cat].text}}>{CAT[cat].label}</span>
<span style={{fontSize:"0.85rem",fontWeight:700,color:scoreColor(avgs[cat])}}>{fmtScore(avgs[cat])}</span>
</div>
))}
</div>
<div style={{marginBottom:"1.5rem"}}>
<div style={{fontSize:"0.58rem",letterSpacing:"0.18em",color:"#555",textTransform:"uppercase",marginBottom:"0.5rem"}}>Scorecard</div>
<div style={{display:"grid",gridTemplateColumns:"1.4rem 1fr 2.8rem 2.8rem 3rem",gap:"0.35rem",padding:"0.3rem 0.6rem",fontSize:"0.52rem",letterSpacing:"0.1em",color:"#3A3A3A",textTransform:"uppercase",borderBottom:"1px solid rgba(255,255,255,0.05)"}}>
<span>#</span><span>Movement</span><span style={{textAlign:"center"}}>Par</span><span style={{textAlign:"center"}}>Time</span><span style={{textAlign:"center"}}>Score</span>
</div>
{course.holes.map((hole,i)=>{
const s=calcScore(results[i],hole.par,hole.type);
return (
<div key={hole.id} style={{display:"grid",gridTemplateColumns:"1.4rem 1fr 2.8rem 2.8rem 3rem",gap:"0.35rem",padding:"0.5rem 0.6rem",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
<span style={{fontSize:"0.6rem",color:"#3A3A3A"}}>{hole.id}</span>
<div>
<div style={{fontSize:"0.72rem",color:"#C0B8A8"}}>{hole.name}</div>
<div style={{fontSize:"0.55rem",color:CAT[hole.category].text}}>{CAT[hole.category].label}</div>
</div>
<span style={{fontSize:"0.65rem",color:"#444",textAlign:"center"}}>{hole.par}s</span>
<span style={{fontSize:"0.65rem",color:"#AAA",textAlign:"center"}}>{results[i]!=null?`${results[i]}s`:"—"}</span>
<span style={{textAlign:"center"}}><span style={{fontSize:"0.72rem",fontWeight:700,color:scoreColor(s)}}>{fmtScore(s)}</span></span>
</div>
);
})}
</div>
<button onClick={onSave} style={{width:"100%",padding:"0.9rem",background:"#C4A05A",border:"none",color:"#0F0F0E",fontSize:"0.8rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",borderRadius:"4px",cursor:"pointer",marginBottom:"0.75rem"}}>Save Round</button>
<button onClick={onRestart} style={{width:"100%",padding:"0.9rem",background:"transparent",border:"1px solid rgba(196,160,90,0.35)",color:"#C4A05A",fontSize:"0.8rem",fontWeight:700,letterSpacing:"0.15em",textTransform:"uppercase",borderRadius:"4px",cursor:"pointer"}}>Play Another Round</button>
</div>
);
}

export default function Home() {
const { isLoading, user, error } = db.useAuth();
const [state, setState] = useState({
screen: "select",
courseKey: null,
restTime: 75,
holeIdx: 0,
restNextHole: null,
results: [],
});

const { screen, courseKey, restTime, holeIdx, restNextHole, results } = state;
const courseData = courseKey ? COURSES[courseKey] : null;
const hole = courseData?.holes[holeIdx];

if (isLoading) return (
<div style={{minHeight:"100vh",background:"#0F0F0E",display:"flex",alignItems:"center",justifyContent:"center",color:"#C4A05A",fontFamily:"Georgia,serif"}}>
Loading...
</div>
);

if (!user) return <Auth />;

function start(key, rest) {
setState({ screen:"countdown", courseKey:key, restTime:rest, holeIdx:0, restNextHole:null, results:[] });
}

function completeHole(time) {
const newResults = [...results, time];
const nextIdx = holeIdx + 1;
const isLast = nextIdx >= courseData.holes.length;
if (isLast) {
setState(s => ({...s, screen:"scorecard", results:newResults}));
} else {
setState(s => ({...s, screen:"rest", holeIdx:nextIdx, restNextHole:courseData.holes[nextIdx], results:newResults}));
}
}

async function saveRound() {
const avgs = categoryAverages(courseData.holes, results);
const sd = getFinalScore(avgs, restTime);
await db.transact(
db.tx.rounds[db.id()].update({
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
}

function restart() {
setState({ screen:"select", courseKey:null, restTime:75, holeIdx:0, restNextHole:null, results:[] });
}

return (
<div style={{minHeight:"100vh",background:"#0F0F0E",color:"#E8E0D0",fontFamily:"Georgia,serif"}}>
<div style={{borderBottom:"1px solid rgba(196,160,90,0.2)",padding:"0.9rem 1.25rem",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,background:"#0F0F0E",zIndex:10}}>
<div>
<div style={{fontSize:"0.55rem",letterSpacing:"0.2em",color:"#C4A05A",textTransform:"uppercase"}}>Elite Calisthenics Tour</div>
<div style={{fontSize:"1.2rem",fontWeight:700}}>FitLinks</div>
</div>
<div style={{display:"flex",alignItems:"center",gap:"1rem"}}>
{courseData && screen !== "select" && <div style={{fontSize:"0.65rem",color:"#555"}}>{courseData.name} · {courseData.slope}</div>}
<button onClick={()=>db.auth.signOut()} style={{fontSize:"0.6rem",color:"#555",background:"none",border:"none",cursor:"pointer",letterSpacing:"0.1em",textTransform:"uppercase"}}>Sign Out</button>
</div>
</div>
{screen==="select" && <SelectScreen onStart={start} user={user} />}
{screen==="countdown" && hole && <CountdownScreen hole={hole} onGo={()=>setState(s=>({...s,screen:"active"}))} />}
{screen==="active" && hole && <ActiveScreen hole={hole} holeIndex={holeIdx} totalHoles={courseData.holes.length} onComplete={completeHole} />}
{screen==="rest" && restNextHole && <RestScreen restTime={restTime} nextHole={restNextHole} onDone={()=>setState(s=>({...s,screen:"countdown"}))} />}
{screen==="scorecard" && courseData && <ScorecardScreen course={courseData} results={results} restTime={restTime} onRestart={restart} onSave={saveRound} />}
</div>
);
}

