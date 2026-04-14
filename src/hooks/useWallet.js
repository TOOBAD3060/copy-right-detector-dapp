import { useState, useEffect, useCallback } from "react";
import { MODEL_META } from "../constants";

const OG_NETWORK = {
  chainId:           MODEL_META.chainHex,
  chainName:         MODEL_META.network,
  nativeCurrency:    { name: "OpenGradient", symbol: MODEL_META.symbol, decimals: 18 },
  rpcUrls:           [MODEL_META.rpc],
  blockExplorerUrls: [MODEL_META.explorer],
};

export function useWallet() {
  const [address,     setAddress]     = useState(null);
  const [chainId,     setChainId]     = useState(null);
  const [connecting,  setConnecting]  = useState(false);
  const [error,       setError]       = useState(null);
  const [hasMetaMask, setHasMetaMask] = useState(false);

  useEffect(() => {
    const has = typeof window !== "undefined" && Boolean(window.ethereum);
    setHasMetaMask(has);
    if (!has) return;
    window.ethereum.on("accountsChanged", (a) => setAddress(a[0] || null));
    window.ethereum.on("chainChanged",    (id) => setChainId(parseInt(id, 16)));
    window.ethereum.request({ method: "eth_accounts" }).then((a) => { if (a[0]) setAddress(a[0]); });
  }, []);

  const connect = useCallback(async () => {
    if (!window.ethereum) { setError("MetaMask not found — running in demo mode."); return false; }
    setConnecting(true); setError(null);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAddress(accounts[0]);
      try {
        await window.ethereum.request({ method: "wallet_switchEthereumChain", params: [{ chainId: OG_NETWORK.chainId }] });
      } catch (sw) {
        if (sw.code === 4902) await window.ethereum.request({ method: "wallet_addEthereumChain", params: [OG_NETWORK] });
      }
      const cid = await window.ethereum.request({ method: "eth_chainId" });
      setChainId(parseInt(cid, 16));
      return true;
    } catch (e) { setError(e.message); return false; }
    finally      { setConnecting(false); }
  }, []);

  return {
    address,
    short:      address ? `${address.slice(0,6)}…${address.slice(-4)}` : null,
    chainId,
    onOGChain:  chainId === MODEL_META.chainId,
    connecting,
    error,
    hasMetaMask,
    connect,
  };
}
