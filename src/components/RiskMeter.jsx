import React, { useEffect, useRef } from "react";
import { getRisk } from "../constants";

export default function RiskMeter({ score, verified }) {
  const canvasRef = useRef(null);
  const risk = getRisk(score);
  const pct  = Math.round(score * 100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W   = canvas.width, H = canvas.height;
    const cx  = W / 2, cy = H / 2 + 14;
    const r   = 88;
    const startA = Math.PI * 0.75;
    const totalA = Math.PI * 1.5;
    const endA   = startA + totalA * score;

    ctx.clearRect(0, 0, W, H);

    // Outer ring glow (if high risk)
    if (score > 0.55) {
      ctx.beginPath();
      ctx.arc(cx, cy, r + 12, startA, startA + totalA);
      ctx.strokeStyle = `${risk.colorHex}22`;
      ctx.lineWidth   = 22;
      ctx.lineCap     = "round";
      ctx.stroke();
    }

    // Track
    ctx.beginPath();
    ctx.arc(cx, cy, r, startA, startA + totalA);
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth   = 10;
    ctx.lineCap     = "round";
    ctx.stroke();

    // Zone ticks
    [0.25, 0.60].forEach((t) => {
      const a  = startA + totalA * t;
      const x1 = cx + (r - 14) * Math.cos(a);
      const y1 = cy + (r - 14) * Math.sin(a);
      const x2 = cx + (r + 6)  * Math.cos(a);
      const y2 = cy + (r + 6)  * Math.sin(a);
      ctx.beginPath();
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.lineWidth   = 1.5;
      ctx.stroke();
    });

    // Filled arc gradient
    if (score > 0.002) {
      const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
      grad.addColorStop(0,    "#2dd4bf");
      grad.addColorStop(0.42, "#f59e0b");
      grad.addColorStop(1,    "#f43f5e");
      ctx.beginPath();
      ctx.arc(cx, cy, r, startA, endA);
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 10;
      ctx.lineCap     = "round";
      ctx.stroke();

      // Glowing tip
      const tipX = cx + r * Math.cos(endA);
      const tipY = cy + r * Math.sin(endA);
      const tipGlow = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 14);
      tipGlow.addColorStop(0, risk.colorHex + "99");
      tipGlow.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(tipX, tipY, 14, 0, Math.PI * 2);
      ctx.fillStyle = tipGlow;
      ctx.fill();
    }

    // Zone labels
    const lbls = [
      { t: 0.1,  label: "LOW",  col: "#2dd4bf" },
      { t: 0.42, label: "MED",  col: "#f59e0b" },
      { t: 0.78, label: "HIGH", col: "#f43f5e" },
    ];
    lbls.forEach(({ t, label, col }) => {
      const a = startA + totalA * t;
      const x = cx + (r + 20) * Math.cos(a);
      const y = cy + (r + 20) * Math.sin(a);
      ctx.font = "bold 9px 'JetBrains Mono', monospace";
      ctx.fillStyle    = col;
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, x, y);
    });
  }, [score, risk.colorHex]);

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"1.5rem 1rem 0.5rem" }}>
      {/* Canvas */}
      <div style={{ position:"relative" }}>
        <canvas ref={canvasRef} width={230} height={150} style={{ display:"block" }} />
        {/* Centre readout */}
        <div style={{
          position:"absolute", bottom:"22px", left:"50%",
          transform:"translateX(-50%)", textAlign:"center", pointerEvents:"none",
          minWidth:"100px",
        }}>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize:   "48px",
            fontWeight: 800,
            lineHeight: 1,
            color:      risk.colorHex,
            textShadow: `0 0 28px ${risk.colorHex}55`,
            transition: "color .4s ease, text-shadow .4s ease",
          }}>
            {pct}<span style={{ fontSize:"20px" }}>%</span>
          </div>
        </div>
      </div>

      {/* Risk badge */}
      <div style={{
        display:"flex", alignItems:"center", gap:"8px",
        padding:"8px 22px", borderRadius:"99px",
        background: risk.bgHex,
        border:     `1.5px solid ${risk.border}`,
        boxShadow:  `0 0 20px ${risk.glow}`,
        marginTop:  "-4px",
        transition: "all .4s ease",
      }}>
        <span style={{ fontSize:"16px", color:risk.colorHex }}>{risk.icon}</span>
        <div>
          <div style={{ fontFamily:"var(--font-display)", fontSize:"12px", fontWeight:700, color:risk.colorHex, letterSpacing:"0.1em" }}>
            {risk.label}
          </div>
          <div style={{ fontSize:"10px", color:risk.colorHex, opacity:0.7 }}>{risk.sublabel}</div>
        </div>
      </div>

      {verified && (
        <div style={{
          marginTop:"10px", padding:"5px 16px",
          borderRadius:"var(--r-sm)",
          background:"var(--purple-bg)", border:"1px solid var(--purple-border)",
          fontFamily:"var(--font-mono)", fontSize:"11px", color:"var(--purple-pale)",
        }}>
          ⬡ on-chain verified
        </div>
      )}
    </div>
  );
}
