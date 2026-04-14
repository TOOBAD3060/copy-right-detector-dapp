# CopyGuard — Content Copyright Risk Classifier dApp

> On-chain ONNX inference · OpenGradient Blockchain  
> Assess copyright infringement risk across five content signals with verifiable, tamper-proof predictions.

---

## What it does

**CopyGuard** analyses content across five copyright risk signals, runs them through `content_copyright_risk_classifier.onnx` deployed on the **OpenGradient Testnet**, and returns an on-chain verified risk score.

Every prediction is a signed blockchain transaction. The model inputs, weights, and outputs are all recorded on-chain — auditable and tamper-proof.

---

## Features

| Feature | Description |
|---|---|
| 5-signal feature panel | Sliders for all content risk signals with live danger highlights |
| Content presets | One-click presets: Original post, News wire, Social repost, Scraped, Licensed media |
| Live risk meter | Animated arc gauge (teal → amber → rose) updating as you type |
| On-chain inference | Signs tx on OpenGradient, runs ONNX, reads result from chain |
| TX terminal | Step-by-step blockchain log with macOS-style window |
| Verdict panel | Clear to publish / Manual review / Do not publish + action checklist |
| Signal influence chart | Bar chart showing which features drove the score |
| Scan history | Persistent table of all past scans in the session |
| Chain status card | Network info, block, gas, CID, explorer link |

---

## Model

```
File:    content_copyright_risk_classifier.onnx
Graph:   MatMul [1×5] @ [5×1]  →  Add  →  Sigmoid  →  copyright_risk_score
W:       [2.0, 1.8, 1.5, 1.3, 1.5]
B:       −4.0

Inputs (all normalised 0–1):
  [0] text_similarity      — semantic overlap with known copyrighted works
  [1] media_usage_ratio    — fraction of protected media embedded
  [2] source_reputation    — historical violation rate of the domain
  [3] license_absence      — proportion of elements missing attribution
  [4] repost_frequency     — how often near-duplicates appear elsewhere

Output:
  copyright_risk_score ∈ [0, 1]

Risk thresholds:
  < 0.25  →  LOW RISK      (clear to publish)
  0.25–0.60  →  MODERATE RISK  (manual review required)
  > 0.60  →  HIGH RISK     (do not publish)
```

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| ONNX runtime | `onnxruntime-web` v1.20 (WASM, in-browser) |
| Wallet | MetaMask / EIP-1193 via `ethers` v6 |
| Blockchain | OpenGradient Testnet (Chain ID: 43266) |
| Hosting | Vercel |

---

## Deploy to Vercel

### Option A — Vercel CLI (one command)

```bash
unzip copyright-dapp.zip && cd copyright-dapp
npm install
npx vercel --prod
```

Accept all defaults. Vercel auto-detects Vite.

---

### Option B — GitHub → Vercel Dashboard

```bash
git init && git add .
git commit -m "feat: CopyGuard dApp on OpenGradient"
gh repo create copyguard-dapp --public --push --source=.
```

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `copyguard-dapp`
3. Leave all build settings as defaults
4. Click **Deploy**

> ✅ `vercel.json` already sets the `Cross-Origin-Opener-Policy` and  
> `Cross-Origin-Embedder-Policy` headers required for ONNX WASM threads.

---

## Run locally

```bash
npm install
npm run dev
# → http://localhost:5173
```

---

## Wallet setup

The app works **without a wallet** — demo mode runs the ONNX model locally in
the browser via the JS fallback.

For **real on-chain inference**:
1. Install [MetaMask](https://metamask.io)
2. Click **Connect Wallet** — the app auto-adds OpenGradient Testnet:
   - RPC: `https://rpc.opengradient.ai`
   - Chain ID: `43266` (0xA902)
   - Symbol: `OG`
3. Get testnet OG: [faucet.opengradient.ai](https://faucet.opengradient.ai)
4. Hit **Submit Inference TX** — costs ~0.004 OG

---

## Project structure

```
copyright-dapp/
├── public/
│   ├── content_copyright_risk_classifier.onnx
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           sticky nav + wallet button
│   │   ├── RiskMeter.jsx        canvas arc gauge
│   │   ├── FeaturePanel.jsx     5 sliders + preset buttons
│   │   ├── TxTerminal.jsx       blockchain tx log + run button
│   │   ├── VerdictPanel.jsx     verdict + action checklist
│   │   ├── InfluenceChart.jsx   signal influence bars
│   │   ├── ScanHistory.jsx      session scan log table
│   │   └── ChainCard.jsx        chain status + explorer link
│   ├── hooks/
│   │   ├── useOnnxModel.js      ONNX WASM + JS fallback
│   │   └── useWallet.js         MetaMask + OG network switch
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css                purple/dark design system
│   └── constants.js             weights, features, risk logic, presets
├── index.html
├── vite.config.js
├── vercel.json                  COEP/COOP headers for WASM
├── package.json
└── README.md
```

---

## Disclaimer

This application is for informational and demonstration purposes only.
It does not constitute legal advice. Always consult a qualified intellectual
property attorney for copyright matters.
