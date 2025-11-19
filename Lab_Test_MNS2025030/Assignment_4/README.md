RC4 WebAssembly (WASM) Encryption/Decryption Demo

----------------------------------------------------
Objective
----------------------------------------------------
This project demonstrates how native C code can be compiled to WebAssembly (WASM)
and executed inside a Next.js frontend. The RC4 encryption algorithm is implemented
fully in C, compiled using Emscripten, and invoked from JavaScript.

----------------------------------------------------
Learning Outcomes
----------------------------------------------------
1. Compile C code into WebAssembly using Emscripten.
2. Expose C functions to JavaScript using exported symbols.
3. Call native C code (via WASM) from Next.js frontend.
4. Pass text/binary data between JavaScript and WASM memory.

----------------------------------------------------
Project Folder Structure
----------------------------------------------------
```
rc4-wasm-demo/
│
├── rc4.c                (RC4 algorithm)
├── build.sh             (Emscripten compile script)
│
├── public/
│   ├── rc4.js           (Generated JS glue file from Emscripten)
│   └── rc4.wasm         (Compiled WebAssembly module)
│
└── pages/
    └── index.js         (Next.js frontend UI)
```

----------------------------------------------------
RC4 Implementation (rc4.c)
----------------------------------------------------
The RC4 algorithm contains:
- Key Scheduling Algorithm (KSA)
- Pseudo-Random Generation Algorithm (PRGA)
- encrypt() and decrypt() exported functions

These functions are compiled to WASM and called from JavaScript.

----------------------------------------------------
Compiling C to WebAssembly
----------------------------------------------------
Run the following script:

    chmod +x build.sh
    ./build.sh

This generates the files:
- public/rc4.js
- public/rc4.wasm

----------------------------------------------------
Next.js Frontend
----------------------------------------------------
Features:
- Textarea for plaintext/ciphertext
- Key input box
- Encrypt button (RC4 via WASM)
- Decrypt button (RC4 via WASM)
- Output display area

The WASM module is loaded using:

    import createRC4Module from "../public/rc4.js";

----------------------------------------------------
Running the Application
----------------------------------------------------
Start the Next.js development server:

    npm run dev

Open the app in your browser:

    http://localhost:3000

You can:
- Enter plaintext + key → click Encrypt → get Base64 ciphertext
- Enter ciphertext + same key → click Decrypt → get plaintext back

----------------------------------------------------
Notes
----------------------------------------------------
- RC4 is an insecure and deprecated algorithm; use only for learning.
- Emscripten warnings are normal and safe to ignore.
- This project is purely for educational purposes.

----------------------------------------------------
