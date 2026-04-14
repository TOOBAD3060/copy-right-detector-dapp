import React from "react";
import { FEATURES, W, B } from "../constants";

export default function InfluenceChart({ values }) {
  const norm      = FEATURES.map((f) => Math.max(0, Math.min(1, (values[f.id] - f.min) / (f.max - f.min))));
  const contribs  = norm.map((v, i) => Math.abs(v * W[i]));
  const total     = contribs.reduce((a, b) => a + b, 0) || 1;

  return (
    <div style={{ background:"var(--bg-panel)", border:"1px solid var(--border-1)", borderRadius:"var(--r-lg)", padding:"1.25rem" }}>
      <div style={{ fontSize:"10px", fontWeight:600, color:"var(--text-2)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem" }}>
        Signal Influence
      </div>

      {FEATURES.map((f, i) => {
        const p      = (contribs[i] / total) * 100;
        const nv     = norm[i];
        const isHigh = nv > 0.55;
        const col    = isHigh ? "var(--rose)" : nv > 0.3 ? "var(--gold)" : "var(--purple)";

        return (
          <div key={f.id} style={{ marginBottom:"10px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", fontSize:"11.5px", marginBottom:"5px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                <span style={{ color: isHigh ? "var(--rose)" : "var(--purple)", fontSize:"13px" }}>{f.icon}</span>
                <span style={{ color:"var(--text-1)", fontWeight:500 }}>{f.label}</span>
              </div>
              <div style={{ display:"flex", gap:"10px", fontFamily:"var(--font-mono)", fontSize:"10px" }}>
                <span style={{ color:"var(--text-3)" }}>w={f.weight.toFixed(1)}</span>
                <span style={{ color: isHigh ? "var(--rose)" : "var(--text-2)" }}>{p.toFixed(1)}%</span>
              </div>
            </div>
            <div style={{ height:"5px", background:"rgba(255,255,255,0.04)", borderRadius:"3px", overflow:"hidden" }}>
              <div style={{
                height:"100%", width:`${p}%`,
                background: col,
                borderRadius:"3px",
                boxShadow: isHigh ? `0 0 8px ${col}` : "none",
                transition:"width .4s cubic-bezier(.4,0,.2,1), background .3s",
              }}/>
            </div>
          </div>
        );
      })}

      {/* Model internals */}
      <div style={{
        marginTop:"14px", padding:"10px 12px",
        background:"var(--bg-card)", borderRadius:"var(--r-sm)",
        border:"1px solid var(--border-1)",
        fontFamily:"var(--font-mono)", fontSize:"10.5px", color:"var(--text-3)", lineHeight:"1.8",
      }}>
        <div><span style={{ color:"var(--text-2)" }}>graph:  </span>MatMul [1×5] @ [5×1] + B → Sigmoid</div>
        <div><span style={{ color:"var(--text-2)" }}>W:      </span>[{W.join(", ")}]</div>
        <div><span style={{ color:"var(--text-2)" }}>B:      </span>{B}</div>
        <div><span style={{ color:"var(--text-2)" }}>output: </span>copyright_risk_score ∈ [0,1]</div>
      </div>
    </div>
  );
}
