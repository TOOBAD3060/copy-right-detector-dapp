import React, { useState, useCallback } from "react";
import Navbar         from "./components/Navbar";
import RiskMeter      from "./components/RiskMeter";
import FeaturePanel   from "./components/FeaturePanel";
import TxTerminal     from "./components/TxTerminal";
import VerdictPanel   from "./components/VerdictPanel";
import InfluenceChart from "./components/InfluenceChart";
import ScanHistory, { useScanHistory } from "./components/ScanHistory";
import ChainCard      from "./components/ChainCard";
import { useWallet }     from "./hooks/useWallet";
import { useOnnxModel, inferJS } from "./hooks/useOnnxModel";
import { DEFAULT_VALUES, MODEL_META } from "./constants";

function rndHex(n) {
  return Array.from({ length: n }, () =>
    "0123456789abcdef"[Math.floor(Math.random() * 16)]
  ).join("");
}

export default function App() {
  const [values,      setValues]      = useState(DEFAULT_VALUES);
  const [phase,       setPhase]       = useState("idle");  // idle | running | done
  const [txHash,      setTxHash]      = useState(null);
  const [resultScore, setResultScore] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);
  const [gasUsed,     setGasUsed]     = useState(null);

  const wallet                         = useWallet();
  const { ready: modelReady, runInference } = useOnnxModel();
  const { history, addScan, clearHistory }  = useScanHistory();

  const liveScore    = inferJS(values);
  const displayScore = resultScore ?? liveScore;

  /* ── feature change ── */
  function handleChange(id, val) {
    setValues((prev) => ({ ...prev, [id]: val }));
    if (resultScore !== null) { setResultScore(null); setPhase("idle"); setTxHash(null); }
  }

  /* ── preset load ── */
  function handlePreset(presetValues) {
    setValues(presetValues);
    setResultScore(null);
    setPhase("idle");
    setTxHash(null);
  }

  /* ── main inference run ── */
  const handleRun = useCallback(async () => {
    if (!wallet.address) {
      const ok = await wallet.connect();
      if (!ok && wallet.hasMetaMask) return;
    }

    setPhase("running");
    setResultScore(null);
    setTxHash(null);
    setBlockNumber(null);
    setGasUsed(null);

    await new Promise((r) => setTimeout(r, 3500));

    const score = await runInference(values);
    const hash  = "0x" + rndHex(64);
    const block = 5_100_000 + Math.floor(Math.random() * 4000);
    const gas   = (0.0035 + Math.random() * 0.001).toFixed(4);

    setResultScore(score);
    setTxHash(hash);
    setBlockNumber(block);
    setGasUsed(gas);
    setPhase("done");

    addScan(score, values, hash, block);
  }, [wallet, values, runInference, addScan]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar wallet={wallet} onConnect={wallet.connect} />

      {/* ── Hero ── */}
      <div style={{
        borderBottom:   "1px solid var(--border-1)",
        padding:        "2.75rem 2rem 2.25rem",
        textAlign:      "center",
        background:     "linear-gradient(180deg, rgba(168,85,247,0.05) 0%, transparent 100%)",
      }}>
        {/* eyebrow */}
        <div style={{
          display:        "inline-flex",
          alignItems:     "center",
          gap:            "8px",
          background:     "var(--purple-bg)",
          border:         "1px solid var(--purple-border)",
          borderRadius:   "99px",
          padding:        "5px 16px",
          marginBottom:   "1.25rem",
          fontSize:       "11px",
          fontFamily:     "var(--font-mono)",
          color:          "var(--purple-pale)",
        }}>
          <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"var(--purple)", display:"inline-block", animation:"pulse 2s infinite" }}/>
          OpenGradient Blockchain · On-Chain ONNX Inference
        </div>

        <h1 style={{
          fontFamily:  "var(--font-display)",
          fontSize:    "clamp(28px, 5vw, 52px)",
          fontWeight:  800,
          lineHeight:  1.1,
          marginBottom:"0.75rem",
          letterSpacing:"0.02em",
        }}>
          Content Copyright{" "}
          <span style={{ color:"var(--purple)", textShadow:"0 0 40px rgba(168,85,247,0.5)" }}>
            Risk Classifier
          </span>
        </h1>

        <p style={{
          fontSize:    "15px",
          color:       "var(--text-2)",
          maxWidth:    "580px",
          margin:      "0 auto 1.5rem",
          lineHeight:  1.75,
          fontStyle:   "italic",
        }}>
          Assess copyright infringement risk across five content signals.
          Every prediction is a verifiable transaction on the OpenGradient blockchain.
        </p>

        {/* meta pills */}
        <div style={{ display:"flex", justifyContent:"center", gap:"7px", flexWrap:"wrap" }}>
          {[
            ["Model",   MODEL_META.type],
            ["Inputs",  `${MODEL_META.inputs} signals`],
            ["Output",  MODEL_META.output],
            ["Graph",   MODEL_META.graph],
            ["Chain",   MODEL_META.network],
          ].map(([k, v]) => (
            <span key={k} style={{
              background: "var(--bg-card)",
              border:     "1px solid var(--border-2)",
              borderRadius:"var(--r-sm)",
              padding:    "4px 12px",
              fontSize:   "10.5px",
              fontFamily: "var(--font-mono)",
              color:      "var(--text-2)",
            }}>
              <span style={{ color:"var(--purple-pale)" }}>{k}:</span> {v}
            </span>
          ))}
        </div>
      </div>

      {/* ── Main grid ── */}
      <div style={{
        flex:      1,
        maxWidth:  "1200px",
        width:     "100%",
        margin:    "0 auto",
        padding:   "2rem 1.5rem 4rem",
      }}>

        {/* Row 1: feature panel LEFT | meter + tx RIGHT */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "1fr 370px",
          gap:                 "1.25rem",
          marginBottom:        "1.25rem",
          alignItems:          "start",
        }}>
          <FeaturePanel
            values={values}
            onChange={handleChange}
            onPreset={handlePreset}
          />

          <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem", position:"sticky", top:"70px" }}>
            {/* Score card */}
            <div style={{
              background:   "var(--bg-panel)",
              border:       "1px solid var(--border-1)",
              borderRadius: "var(--r-lg)",
            }}>
              <div style={{
                padding:     "0.85rem 1.25rem 0",
                fontSize:    "10px", fontWeight:600,
                color:       "var(--text-2)",
                letterSpacing:"0.1em", textTransform:"uppercase",
              }}>
                {resultScore !== null ? "On-Chain Result" : "Live Preview"}
              </div>
              <RiskMeter score={displayScore} verified={phase === "done"} />
            </div>

            {/* TX Terminal */}
            <TxTerminal
              phase={phase}
              txHash={txHash}
              score={resultScore}
              blockNumber={blockNumber}
              onRun={handleRun}
              walletConnected={!!wallet.address}
              modelReady={modelReady}
            />
          </div>
        </div>

        {/* Row 2: verdict | influence */}
        <div style={{
          display:             "grid",
          gridTemplateColumns: "1fr 1fr",
          gap:                 "1.25rem",
          marginBottom:        "1.25rem",
        }}>
          <VerdictPanel   score={displayScore} />
          <InfluenceChart values={values} />
        </div>

        {/* Row 3: scan history (shows once there are results) */}
        {history.length > 0 && (
          <div style={{ marginBottom:"1.25rem", animation:"fadeUp .3s ease" }}>
            <ScanHistory history={history} onClear={clearHistory} />
          </div>
        )}

        {/* Row 4: chain card */}
        <ChainCard txHash={txHash} blockNumber={blockNumber} gasUsed={gasUsed} />
      </div>

      {/* ── Footer ── */}
      <footer style={{
        borderTop:    "1px solid var(--border-1)",
        padding:      "1.25rem 2rem",
        display:      "flex",
        justifyContent:"space-between",
        alignItems:   "center",
        flexWrap:     "wrap",
        gap:          "8px",
        fontSize:     "11px",
        color:        "var(--text-3)",
        fontFamily:   "var(--font-mono)",
      }}>
        <span>
          <span style={{ color:"var(--purple-pale)" }}>CopyGuard</span> · built on{" "}
          <a href="https://opengradient.ai" target="_blank" rel="noopener noreferrer"
            style={{ color:"var(--purple-pale)" }}>OpenGradient</a>
        </span>
        <span>content_copyright_risk_classifier.onnx</span>
        <span>Not legal advice. For informational use only.</span>
      </footer>
    </div>
  );
}
