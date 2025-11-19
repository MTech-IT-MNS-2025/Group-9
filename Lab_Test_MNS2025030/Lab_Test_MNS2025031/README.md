# 📘 README — Diffie–Hellman Key Exchange (Lab Test)

## Platform Used
- macOS

## Software / Tools Used
- Node.js  
- Express.js  
- Emscripten  
- WebAssembly (WASM)  
- HTML & JavaScript  
- live-server  
- Next.js (command used during setup)

---

## Project Folder Structure
```
labtest/
│
├── index.html
├── myProg.c
├── myProg.js
├── myProg.wasm
├── server.js
├── package.json
├── package-lock.json
└── node_modules/
```

---

## Commands to Run My Code

### 1. Create Next.js App (command used earlier)
```
npx create-next app .
```

### 2. Compile C to WebAssembly
```
emcc myProg.c \
  -sEXPORTED_FUNCTIONS='["_modexp"]' \
  -sEXPORTED_RUNTIME_METHODS='["cwrap"]' \
  -o myProg.js
```

### 3. Start Backend Server
```
node server.js
```

### 4. Run Frontend
```
live-server .
```
or:
```
python3 -m http.server 8000
```

---

## MD5 Digest Command Used During Lab Test
```
md5 labtest.zip
```

### MD5 Output
```
e212d8a4eb896dd1f40cc7c91da9c837
```
