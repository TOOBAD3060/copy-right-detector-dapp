import React, { useState, useCallback } from "react";
import { getRisk } from "../constants";

const MAX = 20;

export function useScanHistory() {
  const [history, setHistory] = useState([]);

  const addScan = useCallback((score, values, txHash, blockNumber) => {
    const entry = {
      id:          Date.now(),
      time:        new Date().toLocaleTimeString(),
      score,
      txHash,
      blockNumber,
      topSignal:   Object.entries(values).sort(([,a],[,b]) => b - a)[0][0],
    };
    setHistory((h) => [entry, ...h].slice(0, MAX));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  return { history, addScan, clearHistory };
}

export default function ScanHistory({ history, onClear }) {
  if (history.length === 0) return null;

  return (
    <div style={{ background:"var(--bg-panel)", border:"1px solid var(--border-1)", borderRadius:"var(--r-lg)", overflow:"hidden" }}>
      {/* Header */}
      <div style={{
        display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"0.85rem 1.25rem",
        borderBottom:"1px solid var(--border-1)",
        background:"var(--bg-card)",
      }}>
        <span style={{ fontSize:"10px", fontWeight:600, color:"var(--text-2)", letterSpacing:"0.1em", textTransform:"uppercase" }}>
          Scan History
        </span>
        <button
          onClick={onClear}
          style={{ background:"transparent", border:"1px solid var(--border-2)", borderRadius:"var(--r-sm)", color:"var(--text-3)", padding:"3px 10px", fontSize:"11px", cursor:"pointer" }}
        >
          Clear
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX:"auto" }}>
        <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:"var(--font-mono)", fontSize:"11px" }}>
          <thead>
            <tr style={{ background:"var(--bg-card)" }}>
              {["Time","Score","Verdict","Top Signal","TX Hash","Block"].map((h) => (
                <th key={h} style={{ padding:"7px 12px", textAlign:"left", color:"var(--text-3)", fontWeight:500, borderBottom:"1px solid var(--border-1)", whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => {
              const risk = getRisk(entry.score);
              return (
                <tr key={entry.id} style={{ borderBottom:"1px solid var(--border-1)" }}>
                  <td style={{ padding:"7px 12px", color:"var(--text-3)" }}>{entry.time}</td>
                  <td style={{ padding:"7px 12px" }}>
                    <span style={{ color:risk.colorHex, fontWeight:700 }}>{(entry.score * 100).toFixed(1)}%</span>
                  </td>
                  <td style={{ padding:"7px 12px" }}>
                    <span style={{
                      color:risk.colorHex, background:risk.bgHex,
                      border:`1px solid ${risk.border}`,
                      borderRadius:"3px", padding:"2px 7px",
                      fontSize:"9.5px", fontWeight:700, letterSpacing:"0.06em",
                    }}>
                      {risk.label}
                    </span>
                  </td>
                  <td style={{ padding:"7px 12px", color:"var(--purple-pale)" }}>{entry.topSignal}</td>
                  <td style={{ padding:"7px 12px", color:"var(--text-3)", fontSize:"10px", maxWidth:"120px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                    {entry.txHash ? entry.txHash.slice(0, 18) + "…" : "local"}
                  </td>
                  <td style={{ padding:"7px 12px", color:"var(--teal)" }}>
                    {entry.blockNumber ? `#${entry.blockNumber.toLocaleString()}` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
