import { useState, useEffect, useRef } from "react";
import { W, B, FEATURES, inferJS } from "../constants";

export { inferJS };

export function useOnnxModel() {
  const sessionRef = useRef(null);
  const [ready,     setReady]     = useState(false);
  const [usingWasm, setUsingWasm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const ort = await import("onnxruntime-web");
        ort.env.wasm.wasmPaths =
          "https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/";
        const session = await ort.InferenceSession.create(
          "/content_copyright_risk_classifier.onnx",
          { executionProviders: ["wasm"] }
        );
        if (!cancelled) { sessionRef.current = session; setUsingWasm(true); }
      } catch (e) {
        console.warn("ONNX WASM unavailable, using JS fallback:", e.message);
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  async function runInference(rawValues) {
    if (sessionRef.current) {
      try {
        const ort = await import("onnxruntime-web");
        const norm = FEATURES.map((f) => {
          const [lo, hi] = f.range;
          return Math.max(0, Math.min(1, (rawValues[f.id] - lo) / (hi - lo)));
        });
        const featTensor = new ort.Tensor("float32", new Float32Array(norm),    [1, 5]);
        const wTensor    = new ort.Tensor("float32", new Float32Array(W),       [5, 1]);
        const bTensor    = new ort.Tensor("float32", new Float32Array([B]),     [1, 1]);
        const out = await sessionRef.current.run({ features: featTensor, W: wTensor, B: bTensor });
        return out["copyright_risk_score"].data[0];
      } catch (e) {
        console.warn("ONNX run failed, JS fallback:", e.message);
      }
    }
    return inferJS(rawValues);
  }

  return { ready, usingWasm, runInference };
}
