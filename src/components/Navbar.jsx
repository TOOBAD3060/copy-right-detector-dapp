import React from "react";
import { MODEL_META } from "../constants";

export default function Navbar({ wallet, onConnect }) {
  const { short, connecting, onOGChain, hasMetaMask } = wallet;

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 2rem", height: "58px",
      background: "rgba(11,8,19,0.85)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--border-1)",
    }}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
        <svg width="30" height="30" viewBox="0 0 32 32">
          <rect width="32" height="32" rx="8" fill="var(--purple-bg)" stroke="var(--purple-border)" strokeWidth="1"/>
          <circle cx="16" cy="16" r="8" fill="none" stroke="var(--purple)" strokeWidth="1.6"/>
          <text x="16" y="21" textAnchor="middle" fontSize="12" fontWeight="700" fontFamily="serif" fill="var(--purple)">©</text>
        </svg>
        <span style={{ fontFamily:"var(--font-display)", fontSize:"16px", fontWeight:800, color:"var(--text-1)", letterSpacing:"0.04em" }}>
          CopyGuard
        </span>
        <span style={{ fontSize:"10px", fontFamily:"var(--font-mono)", color:"var(--text-3)", background:"var(--bg-card)", border:"1px solid var(--border-1)", borderRadius:"4px", padding:"2px 8px" }}>
          OpenGradient
        </span>
      </div>

      {/* Center info */}
      <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
        <span style={{ fontSize:"10px", fontFamily:"var(--font-mono)", color:"var(--text-3)", background:"var(--bg-card)", border:"1px solid var(--border-1)", borderRadius:"4px", padding:"3px 10px" }}>
          <span style={{ color:"var(--purple-pale)" }}>model:</span> {MODEL_META.filename}
        </span>
      </div>

      {/* Wallet */}
      {short ? (
        <div style={{ display:"flex", alignItems:"center", gap:"8px", background:"var(--purple-bg)", border:"1px solid var(--purple-border)", borderRadius:"var(--r-sm)", padding:"6px 14px" }}>
          <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:"var(--purple)", display:"inline-block", boxShadow:"0 0 6px var(--purple)" }}/>
          <span style={{ fontFamily:"var(--font-mono)", fontSize:"12px", color:"var(--purple-pale)" }}>{short}</span>
          {!onOGChain && <span style={{ fontSize:"10px", color:"var(--gold)" }}>⚠ switch network</span>}
        </div>
      ) : (
        <button
          onClick={onConnect}
          disabled={connecting}
          style={{
            background: "var(--purple-bg)", border:"1px solid var(--purple-border)",
            borderRadius:"var(--r-sm)", color:"var(--purple-pale)",
            padding:"7px 18px", fontSize:"13px", fontWeight:600, cursor:"pointer",
          }}
        >
          {connecting ? "Connecting…" : hasMetaMask ? "Connect Wallet" : "Demo Mode"}
        </button>
      )}
    </nav>
  );
}
