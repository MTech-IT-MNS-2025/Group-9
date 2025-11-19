# Lab Test – Diffie–Hellman (WASM + Native C)

## 1. Platform Used
- Windows 11 (WSL - Ubuntu)

## 2. Software / Tools Used
- NodeJS
- ExpressJS
- Emscripten (emcc)
- gcc (Ubuntu)
- JavaScript (Vanilla)
- HTML/CSS

---

## 3. Folder Structure (wasm-dh)
```

wasm-dh/
│
├── index.html
├── server.js
├── package.json
├── myProg.c
├── myProg_native.c
│
├── public/
│   ├── compute.js
│   ├── compute.wasm
│   └── style.css
│
└── README.md
```

---

## 4. Commands To Reproduce the Setup (Fresh Terminal)

### ➤ Install NodeJS
```
sudo apt update
sudo apt install nodejs npm -y
```

### ➤ Install Emscripten
```
sudo apt install emscripten -y
```

Verify:
```
emcc --version
```

### ➤ Compile WASM version of myProg.c
```
emcc myProg.c   -s WASM_BIGINT=1   -s EXPORTED_FUNCTIONS='["_modexp"]'   -s EXPORTED_RUNTIME_METHODS='["cwrap"]'   -O3   -o public/compute.js
```

### ➤ Compile Native Server Version
```
gcc myProg_native.c -O2 -o myProg_native
```

### ➤ Install Node Packages
```
npm install
```

### ➤ Run the Server
```
node server.js
```

app runs at:
```
http://localhost:3000
```

---

## 5. MD5 Digest Command (to show examiner)


```
md5sum -r wasm-dh.zip
```



---

## 6. Output Format (as required)
The client prints:

```
<K, y, a>
```
