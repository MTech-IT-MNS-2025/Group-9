"use client";

import { useEffect, useState, useRef } from "react";

export default function RC4Page() {
  const [Module, setModule] = useState(null);
  const textRef = useRef();
  const keyRef = useRef();
  const [output, setOutput] = useState("");

  useEffect(() => {
    async function load() {
      const mod = await import("/rc4.js");
      const createModule = mod.default || mod.createRC4Module;

      const instance = await createModule({
        locateFile: () => "/rc4.wasm",
      });

      setModule(instance);
      console.log("WASM Loaded");
    }

    load();
  }, []);

  function runRC4(bytes, key) {
    const keyBytes = new TextEncoder().encode(key);

    const inPtr = Module._malloc(bytes.length);
    const keyPtr = Module._malloc(keyBytes.length);

    Module.HEAPU8.set(bytes, inPtr);
    Module.HEAPU8.set(keyBytes, keyPtr);

    Module._rc4_process(inPtr, bytes.length, keyPtr, keyBytes.length);

    const out = new Uint8Array(bytes.length);
    out.set(Module.HEAPU8.subarray(inPtr, inPtr + bytes.length));

    Module._free(inPtr);
    Module._free(keyPtr);

    return out;
  }

  function encrypt() {
    const text = textRef.current.value;
    const key = keyRef.current.value;

    const bytes = new TextEncoder().encode(text);
    const encrypted = runRC4(bytes, key);

    setOutput(btoa(String.fromCharCode(...encrypted)));
  }

  function decrypt() {
    const b64 = textRef.current.value;
    const key = keyRef.current.value;

    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const decrypted = runRC4(bytes, key);

    setOutput(new TextDecoder().decode(decrypted));
  }

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>RC4 WebAssembly</h1>
      {!Module && <p>Loading WASM…</p>}

      <textarea
        ref={textRef}
        rows={5}
        placeholder="Enter plaintext or ciphertext"
        style={{ width: "100%", padding: 10, marginTop: 20 }}
      />

      <input
        ref={keyRef}
        placeholder="Enter key"
        style={{ width: "100%", padding: 10, marginTop: 10 }}
      />

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button onClick={encrypt} style={{ flex: 1, padding: 10 }}>Encrypt</button>
        <button onClick={decrypt} style={{ flex: 1, padding: 10 }}>Decrypt</button>
      </div>

      <pre style={{ marginTop: 20, padding: 10, background: "#eee" }}>
        {output}
      </pre>
    </div>
  );
}
