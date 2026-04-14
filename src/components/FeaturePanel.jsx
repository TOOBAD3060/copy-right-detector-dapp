import React from "react";
import { FEATURES, PRESETS, inferJS } from "../constants";

function pct(v, min, max) { return ((v - min) / (max - min)) * 100; }

export default function FeaturePanel({ values, onChange, onPreset }) {
  const liveScore = inferJS(values);
  const liveRisk  = liveScore >= 0.60 ? "var(--rose)" : liveScore >= 0.25 ? "var(--gold)" : "var(--teal)";

  return (
    <div style={{ background:"var(--bg-panel)", border:"1px solid var(--border-1)", borderRadius:"var(--r-lg)", padding:"1.5rem" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1.25rem" }}>
        <div>
          <div style={{ fontSize:"10px", fontWeight:600, color:"var(--text-2)", letterSpacing:"0.1em", textTransform:"uppercase" }}>Content Signals</div>
          <div style={{ fontSize:"11.5px", color:"var(--text-3)", marginTop:"2px" }}>Adjust each feature · model updates in real-time</div>
        </div>
        <div style={{ fontFamily:"var(--font-display)", fontSize:"12px", fontWeight:700, color:liveRisk, transition:"color .3s" }}>
          {(liveScore * 100).toFixed(1)}% live
        </div>
      </div>

      {/* Presets */}
      <div style={{ marginBottom:"1.25rem" }}>
        <div style={{ fontSize:"10px", color:"var(--text-3)", fontFamily:"var(--font-mono)", marginBottom:"7px", letterSpacing:"0.06em" }}>CONTENT PRESETS</div>
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
          {PRESETS.map((p) => {
            const ps = inferJS(p.values);
            const pc = ps >= 0.60 ? "var(--rose)" : ps >= 0.25 ? "var(--gold)" : "var(--teal)";
            return (
              <button
                key={p.label}
                onClick={() => onPreset(p.values)}
                style={{
                  background:"var(--bg-card)", border:"1px solid var(--border-2)",
                  borderRadius:"var(--r-sm)", padding:"5px 11px",
                  fontSize:"11px", color:"var(--text-2)", cursor:"pointer",
                  display:"flex", alignItems:"center", gap:"5px",
                  transition:"all .15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--purple-border)"; e.currentTarget.style.color = "var(--text-1)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-2)";      e.currentTarget.style.color = "var(--text-2)"; }}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
                <span style={{ fontFamily:"var(--font-mono)", fontSize:"10px", color:pc }}>
                  {(ps * 100).toFixed(0)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders */}
      {FEATURES.map((f) => {
        const v       = values[f.id];
        const p       = pct(v, f.min, f.max);
        const isDanger = v >= f.threshold;
        const barCol   = isDanger ? "var(--rose)" : v >= f.threshold * 0.65 ? "var(--gold)" : "var(--purple)";

        return (
          <div key={f.id} style={{ marginBottom:"1.15rem" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:"6px" }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:"7px" }}>
                  <span style={{ fontSize:"15px", color: isDanger ? "var(--rose)" : "var(--purple)", lineHeight:1 }}>{f.icon}</span>
                  <span style={{ fontSize:"13px", fontWeight:500, color:"var(--text-1)" }}>{f.label}</span>
                  {isDanger && (
                    <span style={{ fontSize:"9px", fontFamily:"var(--font-mono)", color:"var(--rose)", background:"var(--rose-bg)", border:"1px solid var(--rose-border)", borderRadius:"3px", padding:"1px 6px" }}>
                      HIGH
                    </span>
                  )}
                </div>
                <div style={{ fontSize:"11px", color:"var(--text-3)", marginTop:"2px", paddingLeft:"22px" }}>{f.description}</div>
              </div>
              <span style={{
                fontFamily:"var(--font-mono)", fontSize:"12px", fontWeight:700,
                color: isDanger ? "var(--rose)" : "var(--purple-pale)",
                background:"var(--bg-card)", border:"1px solid var(--border-2)",
                borderRadius:"var(--r-sm)", padding:"2px 10px", whiteSpace:"nowrap",
                minWidth:"52px", textAlign:"center",
              }}>
                {(v * 100).toFixed(0)}%
              </span>
            </div>

            <input
              type="range"
              min={f.min} max={f.max} step={f.step} value={v}
              onChange={(e) => onChange(f.id, parseFloat(e.target.value))}
              style={{ background:`linear-gradient(to right, ${barCol} ${p}%, rgba(255,255,255,0.07) ${p}%)` }}
            />
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"9.5px", color:"var(--text-3)", fontFamily:"var(--font-mono)", marginTop:"3px" }}>
              <span>0%</span>
              <span style={{ color: isDanger ? "var(--rose)" : "var(--text-3)" }}>
                {isDanger ? `threshold exceeded (${(f.threshold*100).toFixed(0)}%)` : f.unit}
              </span>
              <span>100%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
