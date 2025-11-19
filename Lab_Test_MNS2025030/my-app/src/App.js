import React, { useState, useEffect } from "react";
import "./App.css";
import createModule from "./wasm/myProg.js";

function App() {
  const [g, setG] = useState("");
  const [p, setP] = useState("");
  const [output, setOutput] = useState("");
  const [modexp, setModexp] = useState(null);
  const [a, setA] = useState(null);

  useEffect(() => {
    const loadWasm = async () => {
      const module = await createModule();

      console.log("Loaded WASM exports:", module);

      if (!module.modexp) {
        console.error("ERROR: modexp not found!");
        return;
      }

      setModexp(() => module.modexp);
    };

    loadWasm();
  }, []);

  const computeDH = async () => {
    if (!modexp) {
      alert("WASM not loaded yet!");
      return;
    }

    const gInt = Number(g);
    const pInt = Number(p);

    const randA = Math.floor(Math.random() * (pInt - 2)) + 2;
    setA(randA);

    const x = modexp(gInt, randA, pInt);  // NOW WORKS!

    const res = await fetch("http://localhost:5000/api/dh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ g: gInt, p: pInt, x }),
    });

    const data = await res.json();

    setOutput(`K = ${data.K}\ny = ${data.y}\na = ${randA}`);
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Diffie–Hellman Key Exchange</h1>

        <input
          type="number"
          className="inputBox"
          placeholder="Enter p"
          value={p}
          onChange={(e) => setP(e.target.value)}
        />

        <input
          type="number"
          className="inputBox"
          placeholder="Enter g"
          value={g}
          onChange={(e) => setG(e.target.value)}
        />

        <button className="btn" onClick={computeDH}>
          Compute Shared Key
        </button>

        {output && <div className="outputBox">{output}</div>}
      </div>
    </div>
  );
}

export default App;
