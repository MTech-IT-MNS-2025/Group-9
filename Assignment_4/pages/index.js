"use client";
import { useEffect, useState } from "react";
import createRC4Module from "../public/rc4.js";

export default function Home() {
  const [Module, setModule] = useState(null);
  const [text, setText] = useState("");
  const [key, setKey] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    createRC4Module().then((mod) => setModule(mod));
  }, []);

  function toByteArray(str) {
    return Array.from(new TextEncoder().encode(str));
  }

  function fromByteArray(arr) {
    return new TextDecoder().decode(Uint8Array.from(arr));
  }

  const handleEncrypt = async () => {
    if (!Module) return;

    const textBytes = toByteArray(text);
    const keyBytes = toByteArray(key);

    const textPtr = Module._malloc(textBytes.length);
    const keyPtr = Module._malloc(keyBytes.length);
    const outPtr = Module._malloc(textBytes.length);

    Module.HEAPU8.set(textBytes, textPtr);
    Module.HEAPU8.set(keyBytes, keyPtr);

    Module.ccall(
      "encrypt",
      "number",
      ["number", "number", "number", "number", "number"],
      [textPtr, textBytes.length, keyPtr, keyBytes.length, outPtr]
    );

    const out = Module.HEAPU8.slice(outPtr, outPtr + textBytes.length);
    setResult(btoa(String.fromCharCode(...out))); // base64 output

    Module._free(textPtr);
    Module._free(keyPtr);
    Module._free(outPtr);
  };

  const handleDecrypt = async () => {
    if (!Module) return;

    const encryptedBytes = Uint8Array.from(atob(text), c => c.charCodeAt(0));
    const keyBytes = toByteArray(key);

    const textPtr = Module._malloc(encryptedBytes.length);
    const keyPtr = Module._malloc(keyBytes.length);
    const outPtr = Module._malloc(encryptedBytes.length);

    Module.HEAPU8.set(encryptedBytes, textPtr);
    Module.HEAPU8.set(keyBytes, keyPtr);

    Module.ccall(
      "decrypt",
      "number",
      ["number", "number", "number", "number", "number"],
      [textPtr, encryptedBytes.length, keyPtr, keyBytes.length, outPtr]
    );

    const out = Module.HEAPU8.slice(outPtr, outPtr + encryptedBytes.length);
    setResult(fromByteArray(out));

    Module._free(textPtr);
    Module._free(keyPtr);
    Module._free(outPtr);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>RC4 WASM Encryption / Decryption</h1>

      <h3>Input Text</h3>
      <textarea rows="4" value={text} onChange={(e) => setText(e.target.value)} />

      <h3>Key</h3>
      <input value={key} onChange={(e) => setKey(e.target.value)} />

      <br /><br />
      <button onClick={handleEncrypt}>Encrypt</button>
      <button onClick={handleDecrypt} style={{ marginLeft: "10px" }}>Decrypt</button>

      <h3>Result:</h3>
      <div style={{ background: "#eee", padding: "10px" }}>{result}</div>
    </div>
  );
}
