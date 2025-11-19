export default async function Module() {
  const response = await fetch("/wasm/myProg.wasm");
  const wasmBinary = await response.arrayBuffer();

  const wasm = await WebAssembly.instantiate(wasmBinary, {
    env: {
      abort: () => console.error("WASM aborted"),
    },
  });

  const exports = wasm.instance.exports;

  return {
    modexp: exports.c  // WASM export "c" is your modexp function
  };
}
