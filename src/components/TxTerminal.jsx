import React, { useEffect, useState } from "react";
import { MODEL_META } from "../constants";

const STEPS = [
  "Encoding content feature vector [1×5] float32…",
  "Signing inference transaction…",
  "eth_sendRawTransaction → OpenGradient mempool…",
  "Inference node received calldata…",
  "Executing: MatMul [1×5]@[5×1] → Add → Sigmoid…",
  "Writing copyright_risk_score to chain state…",
  "Awaiting block confirmation…",
];

export default function TxTerminal({ phase, txHash, score, blockNumber, onRun, walletConnected, modelReady }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (phase !== "running") { setStep(0); return; }
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 430);
    return () => clearInterval(t);
  }, [phase]);

  const isRunning = phase === "running";
  const isDone    = phase === "done";
  const showLog   = isRunning || isDone;

  const btnLabel = !modelReady
    ? "LOADING MODEL…"
    : isRunning
    ? "RUNNING ON-CHAIN…"
    : walletConnected
    ? "⬡  SUBMIT INFERENCE TX"
    : "CONNECT WALLET & RUN";

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
      {showLog && (
        <div style={{
          background:"#070510", border:"1px solid var(--border-2)",
          borderRadius:"var(--r-lg)", overflow:"hidden",
          animation:"fadeUp .25s ease",
        }}>
          {/* Title bar */}
          <div style={{ display:"flex", alignItems:"center", gap:"6px", padding:"8px 14px", background:"rgba(0,0,0,0.3)", borderBottom:"1px solid var(--border-1)" }}>
            {["#ff5f57","#febc2e","#28c840"].map((c) => (
              <span key={c} style={{ width:"11px", height:"11px", borderRadius:"50%", background:c, opacity:.8 }}/>
            ))}
            <span style={{ fontFamily:"var(--font-mono)", fontSize:"11px", color:"var(--text-3)", marginLeft:"8px" }}>og-inference — bash</span>
          </div>

          {/* Body */}
          <div style={{ padding:"1rem", fontFamily:"var(--font-mono)", fontSize:"11.5px", lineHeight:"1.85" }}>
            <div>
              <span style={{ color:"var(--purple)" }}>→ </span>
              <span style={{ color:"var(--text-1)" }}>og-run</span>
              <span style={{ color:"var(--text-3)" }}> --model {MODEL_META.filename} --network testnet</span>
            </div>

            {STEPS.slice(0, isRunning ? step + 1 : STEPS.length).map((s, i) => (
              <div key={i} style={{ display:"flex", gap:"8px", opacity: isRunning && i === step ? 1 : 0.55 }}>
                <span style={{ color: isRunning && i === step ? "#facc15" : "var(--purple)", flexShrink:0 }}>
                  {isRunning && i === step ? "▶" : "✓"}
                </span>
                <span style={{ color: isRunning && i === step ? "var(--text-1)" : "var(--text-2)" }}>{s}</span>
              </div>
            ))}

            {isRunning && (
              <span style={{ display:"inline-block", width:"8px", height:"14px", background:"var(--purple)", borderRadius:"1px", animation:"blink .85s step-start infinite", marginTop:"2px" }}/>
            )}

            {isDone && (
              <div style={{ marginTop:"10px", paddingTop:"10px", borderTop:"1px solid var(--border-1)" }}>
                <div style={{ color:"#86efac" }}>✓ inference complete · gas: ~{MODEL_META.gasEst}</div>
                <div><span style={{ color:"var(--text-3)" }}>block: </span><span style={{ color:"var(--teal)" }}>#{blockNumber?.toLocaleString()}</span></div>
                <div><span style={{ color:"var(--text-3)" }}>tx:    </span><span style={{ color:"var(--text-3)", wordBreak:"break-all", fontSize:"10px" }}>{txHash}</span></div>
                <div style={{ marginTop:"6px" }}>
                  <span style={{ color:"var(--text-3)" }}>output: </span>
                  <span style={{ color:"var(--text-2)" }}>copyright_risk_score</span>
                  <span style={{ color:"var(--text-3)" }}> → </span>
                  <span style={{
                    fontWeight:700, fontSize:"14px",
                    color: score >= 0.60 ? "var(--rose)" : score >= 0.25 ? "var(--gold)" : "var(--teal)",
                  }}>
                    {score?.toFixed(8)}
                  </span>
                </div>
                {txHash && (
                  <a href={`${MODEL_META.explorer}/tx/${txHash}`} target="_blank" rel="noopener noreferrer"
                    style={{ display:"inline-block", marginTop:"10px", fontSize:"11px", color:"var(--purple-pale)" }}>
                    ↗ view on explorer
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Run button */}
      <button
        onClick={onRun}
        disabled={isRunning || !modelReady}
        style={{
          width:"100%", padding:"15px",
          borderRadius:"var(--r-md)",
          border: isRunning ? "1px solid var(--border-2)" : "1px solid var(--purple-border)",
          background: isRunning ? "var(--bg-card)" : "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(124,58,237,0.08) 100%)",
          color: isRunning ? "var(--text-3)" : "var(--purple-pale)",
          fontSize:"14px", fontWeight:700,
          fontFamily:"var(--font-display)", letterSpacing:"0.06em",
          cursor: isRunning || !modelReady ? "not-allowed" : "pointer",
          boxShadow: isRunning ? "none" : "0 0 24px rgba(168,85,247,0.12)",
          transition:"all .2s",
        }}
      >
        {btnLabel}
      </button>

      {!walletConnected && (
        <p style={{ fontSize:"11px", color:"var(--text-3)", textAlign:"center", lineHeight:1.5 }}>
          No wallet detected — runs in demo mode using local ONNX inference.
        </p>
      )}
    </div>
  );
}
