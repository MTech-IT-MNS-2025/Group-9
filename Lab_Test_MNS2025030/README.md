
# Diffie–Hellman Key Exchange (WebAssembly + React)

## Platform Used
- **Windows 11**

## Software / Tools Used
- **Node.js (Backend Server)**
- **React (Frontend UI)**
- **Emscripten (C to WASM Compiler)**
- **WebAssembly (WASM Runtime)**
- **C Language**

## Commands to Run Codes

### 1. Install Dependencies
#### Frontend:
```
cd my-app
npm install
```

#### Backend:
```
cd backend
npm install
```

### 2. Run Backend Server
```
node server.js
```
Backend runs on: http://localhost:5000

### 3. Run Frontend (React)
```
npm start
```
Frontend runs on: http://localhost:3000

### 4. Command Used to Compile C Code into WASM
```
emcc myProg.c -O3 -s WASM=1 -s ENVIRONMENT=web ^
-s MODULARIZE=1 -s EXPORT_ES6=1 -o myProg.js
```

### 5. WASM Export Used
```
exports.c
```

## MD5 Digest Command Used During Lab Test
```
md5sum -r lab-test.zip
```
