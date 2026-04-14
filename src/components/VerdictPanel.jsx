import React from "react";
import { getRisk, getVerdict } from "../constants";

export default function VerdictPanel({ score }) {
  const risk    = getRisk(score);
  const verdict = getVerdict(score);

  return (
    <div style={{
      background: "var(--bg-panel)",
      border: `1px solid ${risk.border}`,
      borderRadius: "var(--r-lg)",
      padding: "1.25rem",
      boxShadow: `0 0 28px ${risk.glow}`,
      transition: "all .4s ease",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
        <div style={{ fontSize:"10px", fontWeight:600, color:"var(--text-2)", letterSpacing:"0.1em", textTransform:"uppercase" }}>
          Verdict
        </div>
        <span style={{
          fontFamily:"var(--font-display)", fontSize:"11px", fontWeight:700,
          color: risk.colorHex,
          background: risk.bgHex,
          border:`1px solid ${risk.border}`,
          borderRadius:"var(--r-sm)", padding:"4px 14px",
          letterSpacing:"0.08em",
        }}>
          {verdict.action}
        </span>
      </div>

      <p style={{ fontSize:"12.5px", color:"var(--text-2)", lineHeight:1.7, marginBottom:"1rem" }}>
        {verdict.detail}
      </p>

      <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
        {verdict.steps.map((step, i) => (
          <div key={i} style={{
            display:"flex", alignItems:"flex-start", gap:"10px",
            padding:"9px 12px",
            background:"var(--bg-card)", borderRadius:"var(--r-sm)",
            border:"1px solid var(--border-1)",
          }}>
            <span style={{
              flexShrink:0, width:"20px", height:"20px",
              borderRadius:"50%",
              background: risk.bgHex,
              border: `1px solid ${risk.border}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"9px", fontWeight:700, color: risk.colorHex,
              fontFamily:"var(--font-mono)",
            }}>
              {i + 1}
            </span>
            <span style={{ fontSize:"12px", color:"var(--text-1)", lineHeight:1.55 }}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
