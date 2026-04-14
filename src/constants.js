// ─────────────────────────────────────────────────────────
//  ONNX model: content_copyright_risk_classifier.onnx
//  Graph:  MatMul [1×5] @ [5×1]  →  Add  →  Sigmoid
//  W = [2.0, 1.8, 1.5, 1.3, 1.5]    B = −4.0
// ─────────────────────────────────────────────────────────

export const W = [2.0, 1.8, 1.5, 1.3, 1.5];
export const B = -4.0;

export const MODEL_META = {
  filename:  "content_copyright_risk_classifier.onnx",
  cid:       "bafkreicopy2025ogxyz9876543210abcdefghij",
  type:      "Logistic Regression",
  graph:     "MatMul → Add → Sigmoid",
  inputs:    5,
  output:    "copyright_risk_score ∈ [0,1]",
  network:   "OpenGradient Testnet",
  chainId:   43266,
  chainHex:  "0xA902",
  rpc:       "https://rpc.opengradient.ai",
  explorer:  "https://explorer.opengradient.ai",
  symbol:    "OG",
  gasEst:    "~0.0041 OG",
};

// ─── Feature definitions (order = model input order) ────
export const FEATURES = [
  {
    id:          "textSimilarity",
    label:       "Text similarity",
    description: "Semantic overlap with known copyrighted works (0 = original, 1 = verbatim copy)",
    unit:        "score 0–1",
    type:        "slider",
    min:         0, max:   1, default: 0.1, step: 0.01,
    threshold:   0.6,
    range:       [0, 1],
    weight:      2.0,
    icon:        "≈",
  },
  {
    id:          "mediaUsageRatio",
    label:       "Protected media ratio",
    description: "Fraction of embedded media (images, audio, video) from protected sources",
    unit:        "0 – 100%",
    type:        "slider",
    min:         0, max:   1, default: 0.05, step: 0.01,
    threshold:   0.5,
    range:       [0, 1],
    weight:      1.8,
    icon:        "◫",
  },
  {
    id:          "sourceReputation",
    label:       "Source reputation risk",
    description: "Historical copyright violation rate of the publishing domain",
    unit:        "0 = clean · 1 = high-risk",
    type:        "slider",
    min:         0, max:   1, default: 0.1, step: 0.01,
    threshold:   0.5,
    range:       [0, 1],
    weight:      1.5,
    icon:        "⊙",
  },
  {
    id:          "licenseAbsence",
    label:       "Missing license signals",
    description: "Proportion of content elements lacking attribution or license metadata",
    unit:        "0 – 100%",
    type:        "slider",
    min:         0, max:   1, default: 0.2, step: 0.01,
    threshold:   0.6,
    range:       [0, 1],
    weight:      1.3,
    icon:        "⊘",
  },
  {
    id:          "repostFrequency",
    label:       "Repost frequency",
    description: "How often this content or its near-duplicates appear across monitored channels",
    unit:        "normalised 0–1",
    type:        "slider",
    min:         0, max:   1, default: 0.05, step: 0.01,
    threshold:   0.5,
    range:       [0, 1],
    weight:      1.5,
    icon:        "↺",
  },
];

export const DEFAULT_VALUES = Object.fromEntries(
  FEATURES.map((f) => [f.id, f.default])
);

// ─── Risk level helpers ──────────────────────────────────
export function getRisk(score) {
  if (score < 0.25) return {
    label:    "LOW RISK",
    sublabel: "Likely original content",
    colorHex: "#2dd4bf",
    color:    "var(--teal)",
    bg:       "var(--teal-bg)",
    bgHex:    "rgba(45,212,191,0.08)",
    border:   "rgba(45,212,191,0.25)",
    glow:     "rgba(45,212,191,0.2)",
    icon:     "✓",
    level:    0,
  };
  if (score < 0.60) return {
    label:    "MODERATE RISK",
    sublabel: "Review before publishing",
    colorHex: "#f59e0b",
    color:    "var(--gold)",
    bg:       "var(--gold-bg)",
    bgHex:    "rgba(245,158,11,0.08)",
    border:   "var(--gold-border)",
    glow:     "rgba(245,158,11,0.2)",
    icon:     "⚠",
    level:    1,
  };
  return {
    label:    "HIGH RISK",
    sublabel: "Potential copyright violation",
    colorHex: "#f43f5e",
    color:    "var(--rose)",
    bg:       "var(--rose-bg)",
    bgHex:    "rgba(244,63,94,0.08)",
    border:   "var(--rose-border)",
    glow:     "var(--rose-glow)",
    icon:     "✕",
    level:    2,
  };
}

export function getVerdict(score) {
  if (score < 0.25) return {
    action:  "Clear to publish",
    detail:  "Content signals are well within acceptable bounds. Standard attribution practices are sufficient.",
    steps: [
      "Proceed with publication",
      "Add standard attribution metadata",
      "Keep content fingerprint on file for future reference",
    ],
  };
  if (score < 0.60) return {
    action:  "Manual review required",
    detail:  "One or more signals exceed safe thresholds. A human review or legal check is recommended before distribution.",
    steps: [
      "Hold publication pending review",
      "Identify highest-risk media elements",
      "Seek explicit licence or substitute flagged assets",
      "Re-run classifier after remediation",
    ],
  };
  return {
    action:  "Do not publish",
    detail:  "High-confidence copyright violation detected. Publishing without remediation exposes creators and platforms to legal liability.",
    steps: [
      "Block content immediately",
      "Notify the submitting user of the violation",
      "Log fingerprint for DMCA / IP enforcement tracking",
      "Escalate to legal if repeat infringement detected",
      "Issue takedown if already published",
    ],
  };
}

// ─── Content type presets ────────────────────────────────
export const PRESETS = [
  {
    label:  "Original blog post",
    icon:   "✍",
    values: { textSimilarity: 0.05, mediaUsageRatio: 0.04, sourceReputation: 0.05, licenseAbsence: 0.10, repostFrequency: 0.03 },
  },
  {
    label:  "News article (wire)",
    icon:   "📰",
    values: { textSimilarity: 0.45, mediaUsageRatio: 0.35, sourceReputation: 0.20, licenseAbsence: 0.40, repostFrequency: 0.30 },
  },
  {
    label:  "Social media repost",
    icon:   "↺",
    values: { textSimilarity: 0.70, mediaUsageRatio: 0.60, sourceReputation: 0.35, licenseAbsence: 0.65, repostFrequency: 0.75 },
  },
  {
    label:  "Scraped article",
    icon:   "⚡",
    values: { textSimilarity: 0.90, mediaUsageRatio: 0.85, sourceReputation: 0.70, licenseAbsence: 0.90, repostFrequency: 0.80 },
  },
  {
    label:  "Licensed stock media",
    icon:   "◎",
    values: { textSimilarity: 0.12, mediaUsageRatio: 0.55, sourceReputation: 0.05, licenseAbsence: 0.02, repostFrequency: 0.08 },
  },
];

// ─── Pure-JS model inference (mirrors ONNX graph exactly) ─
export function inferJS(rawValues) {
  const norm = FEATURES.map((f) => {
    const [lo, hi] = f.range;
    return Math.max(0, Math.min(1, (rawValues[f.id] - lo) / (hi - lo)));
  });
  const dot = norm.reduce((sum, v, i) => sum + v * W[i], 0);
  return 1 / (1 + Math.exp(-(dot + B)));
}
