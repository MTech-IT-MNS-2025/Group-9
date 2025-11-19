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

  const encryptText = () => {
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
    setResult(btoa(String.fromCharCode(...out)));

    Module._free(textPtr);
    Module._free(keyPtr);
    Module._free(outPtr);
  };

  const decryptText = () => {
    if (!Module) return;

    const encryptedBytes = Uint8Array.from(atob(text), (c) =>
      c.charCodeAt(0)
    );
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
    <div style={{
      minHeight: "100vh",
      background: "#f5f5ff",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "600px",
        background: "white",
        padding: "30px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}>
          🔐 RC4 WASM Encryption Tool
        </h1>

        <label style={{ fontWeight: "bold" }}>Enter Text</label>
        <textarea
          rows="4"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%",
            marginTop: "6px",
            marginBottom: "20px",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "15px"
          }}
        />

        <label style={{ fontWeight: "bold" }}>Key</label>
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          style={{
            width: "100%",
            marginTop: "6px",
            marginBottom: "20px",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "15px"
          }}
        />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            onClick={encryptText}
            style={{
              flex: 1,
              padding: "12px",
              background: "#4a6cff",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: "pointer",
              marginRight: "10px"
            }}
          >
            🔒 Encrypt
          </button>

          <button
            onClick={decryptText}
            style={{
              flex: 1,
              padding: "12px",
              background: "#00b894",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              cursor: "pointer",
              marginLeft: "10px"
            }}
          >
            🔓 Decrypt
          </button>
        </div>

        <h3 style={{ marginTop: "30px", fontWeight: "bold" }}>Result</h3>
        <div style={{
          background: "#f0f0ff",
          padding: "15px",
          borderRadius: "10px",
          minHeight: "80px",
          whiteSpace: "pre-wrap",
          fontSize: "15px"
        }}>
          {result || "Result will appear here..."}
        </div>
      </div>
    </div>
  );
}
