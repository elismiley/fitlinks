"use client";
import { useState } from "react";
import db from "../lib/db";

export default function Auth() {
const [email, setEmail] = useState("");
const [code, setCode] = useState("");
const [step, setStep] = useState("email"); // email → code → done
const [name, setName] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);

async function sendCode() {
if (!email) return;
setLoading(true);
setError("");
try {
await db.auth.sendMagicCode({ email });
setStep("code");
} catch (e) {
setError("Failed to send code. Try again.");
}
setLoading(false);
}

async function verifyCode() {
if (!code) return;
setLoading(true);
setError("");
try {
await db.auth.signInWithMagicCode({ email, code });
} catch (e) {
setError("Invalid code. Try again.");
}
setLoading(false);
}

const s = {
container: { minHeight: "100vh", background: "#0F0F0E", color: "#E8E0D0", fontFamily: "Georgia,serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" },
title: { fontSize: "2rem", fontWeight: 700, marginBottom: "0.25rem" },
subtitle: { fontSize: "0.65rem", letterSpacing: "0.2em", color: "#C4A05A", textTransform: "uppercase", marginBottom: "3rem" },
label: { fontSize: "0.6rem", letterSpacing: "0.15em", color: "#777", textTransform: "uppercase", marginBottom: "0.4rem" },
input: { width: "100%", padding: "0.85rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "4px", color: "#E8E0D0", fontSize: "1rem", fontFamily: "Georgia,serif", outline: "none", marginBottom: "1rem", boxSizing: "border-box" },
button: { width: "100%", padding: "1rem", background: "#C4A05A", border: "none", color: "#0F0F0E", fontSize: "0.85rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", borderRadius: "4px", cursor: "pointer", fontFamily: "Georgia,serif" },
error: { fontSize: "0.75rem", color: "#D47070", marginBottom: "1rem" },
hint: { fontSize: "0.7rem", color: "#555", marginTop: "1rem", textAlign: "center" },
};

return (
<div style={s.container}>
<div style={{ width: "100%", maxWidth: 400 }}>
<div style={s.subtitle}>Elite Calisthenics Tour</div>
<div style={s.title}>FitLinks</div>
<div style={{ fontSize: "0.8rem", color: "#555", marginBottom: "3rem" }}>Golf-style fitness scoring</div>

{step === "email" && (
<>
<div style={s.label}>Email Address</div>
<input style={s.input} type="email" placeholder="you@email.com" value={email}
onChange={e => setEmail(e.target.value)}
onKeyDown={e => e.key === "Enter" && sendCode()} />
{error && <div style={s.error}>{error}</div>}
<button style={s.button} onClick={sendCode} disabled={loading}>
{loading ? "Sending..." : "Continue →"}
</button>
<div style={s.hint}>We'll send you a magic code — no password needed</div>
</>
)}

{step === "code" && (
<>
<div style={s.label}>Enter your code</div>
<div style={{ fontSize: "0.75rem", color: "#666", marginBottom: "1rem" }}>Sent to {email}</div>
<input style={s.input} type="text" placeholder="6-digit code" value={code}
onChange={e => setCode(e.target.value)}
onKeyDown={e => e.key === "Enter" && verifyCode()} />
{error && <div style={s.error}>{error}</div>}
<button style={s.button} onClick={verifyCode} disabled={loading}>
{loading ? "Verifying..." : "Sign In →"}
</button>
<div style={s.hint} onClick={() => setStep("email")} style={{ ...s.hint, cursor: "pointer", color: "#C4A05A" }}>
← Use different email
</div>
</>
)}
</div>
</div>
);
}
