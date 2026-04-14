import React from "react";
import { MODEL_META } from "../constants";

export default function ChainCard({ txHash, blockNumber, gasUsed }) {
  const rows = [
    ["Network",   MODEL_META.network],
    ["Chain ID",  String(MODEL_META.chainId)],
    ["RPC",       MODEL_META.rpc.replace("https://","")],
    ["Block",     blockNumber ? `#${blockNumber.toLocaleString()}` : "—"],
    ["Gas",       gasUsed     ? `${gasUsed} OG`                  : `${MODEL_META.gasEst} (est.)`],
    ["Graph",     MODEL_META.graph],
    ["CID",       MODEL_META.cid.slice(0,18) + "…"],
  ];

  return (
    <div style={{ background:"var(--bg-panel)", border:"1px solid var(--border-1)", borderRadius:"var(--r-lg)", padding:"1.25rem" }}>
      <div style={{ fontSize:"10px", fontWeight:600, color:"var(--text-2)", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"1rem", display:"flex", alignItems:"center", gap:"7px" }}>
        <span style={{ color:"var(--purple)", fontSize:"14px" }}>⬡</span> Chain Status
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"1px", background:"var(--border-1)", borderRadius:"var(--r-sm)", overflow:"hidden" }}>
        {rows.map(([k, v]) => (
          <div key={k} style={{ background:"var(--bg-card)", padding:"9px 12px" }}>
            <div style={{ fontSize:"9.5px", color:"var(--text-3)", fontFamily:"var(--font-mono)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:"3px" }}>{k}</div>
            <div style={{ fontSize:"11.5px", fontFamily:"var(--font-mono)", color:"var(--purple-pale)", wordBreak:"break-all" }}>{v}</div>
          </div>
        ))}
      </div>

      {txHash && (
        <a
          href={`${MODEL_META.explorer}/tx/${txHash}`}
          target="_blank" rel="noopener noreferrer"
          style={{
            display:"block", marginTop:"1rem", padding:"9px 12px",
            background:"var(--purple-bg)", border:"1px solid var(--purple-border)",
            borderRadius:"var(--r-sm)", textAlign:"center",
            fontSize:"12px", fontFamily:"var(--font-mono)", color:"var(--purple-pale)",
            transition:"background .2s",
          }}
        >
          ↗ View transaction on explorer
        </a>
      )}

      <p style={{ marginTop:"1rem", fontSize:"10.5px", color:"var(--text-3)", lineHeight:1.6, textAlign:"center" }}>
        For informational purposes only. Not legal advice.<br/>
        Always consult a qualified IP attorney for copyright matters.
      </p>
    </div>
  );
}
