# 📘 Diffie–Hellman Key Exchange using WebAssembly & Node.js

## 📌 Project Overview

This project implements the **Diffie–Hellman (DH) Key Exchange** protocol using:
- **WebAssembly (WASM)** to run C code in the browser
- **HTML + JavaScript** as the client
- **Node.js (Express)** as the server
- **C modular exponentiation** compiled to WASM using Emscripten

The objective is to securely compute a shared secret key **K** between a client and server without directly transmitting the secret keys.

---

## 🚀 Workflow (Step-by-Step)

### 1. User Input (Frontend)
The user enters:
- A prime number `p`
- A generator `g`

### 2. Client Generates Private Key
The browser randomly chooses:
```
a ∈ Z*p
```

### 3. Client Computes x = g^a mod p using WASM
The given C file `myProg.c` contains the modular exponentiation function:
```c
int modexp(int g, int a, int p);
```

This file is compiled to WebAssembly using:
```bash
emcc myProg.c \
  -sEXPORTED_FUNCTIONS='["_modexp"]' \
  -sEXPORTED_RUNTIME_METHODS='["cwrap"]' \
  -o myProg.js
```

The browser calls this WASM function to compute:
```
x = g^a mod p
```

### 4. Client Sends Public Values to Server
The browser sends via HTTP POST:
```json
{ "g": ..., "p": ..., "x": ... }
```

### 5. Server Generates Private Key
Server randomly chooses:
```
b ∈ Z*p
```

### 6. Server Computes:
```
y = g^b mod p
K = x^b mod p     (shared secret)
```

### 7. Server Sends Back Response
The server returns:
```json
{ "y": ..., "K": ... }
```

### 8. Client Displays Output
The browser shows:
- `K` = shared secret
- `y` = server public value
- `a` = client private value

✅ This completes the Diffie–Hellman key exchange.

---

## 🧩 Technology Stack

### Frontend
- HTML
- Vanilla JavaScript
- WebAssembly generated from C
- `fetch()` API for server communication

### Backend
- Node.js
- Express.js
- JSON communication via POST
- JavaScript modular exponentiation

### Cryptography
- Modular exponentiation
- Diffie–Hellman key exchange
- Random private keys
- No private keys transmitted

---

## 🛠 File Structure
```
/project-folder
│
├── index.html          # Frontend UI
├── myProg.c            # C code (modexp)
├── myProg.js           # WASM loader (generated)
├── myProg.wasm         # WebAssembly binary (generated)
├── server.js           # Node.js backend
├── README.md           # Documentation
└── package.json        # Express server info
```

---

## 🔧 Installation & Setup

### Prerequisites
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org)
- **Emscripten** - For compiling C to WebAssembly
- **Live Server** (optional) - For serving frontend

### Install Emscripten
```bash
# Install emsdk
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
source ./emsdk_env.sh  # On Windows: emsdk_env.bat
```

### Install Node.js Dependencies
```bash
npm install express body-parser
```

---

## ⚙️ Build & Run Instructions

### 1️⃣ Compile C to WASM
```bash
emcc myProg.c \
  -sEXPORTED_FUNCTIONS='["_modexp"]' \
  -sEXPORTED_RUNTIME_METHODS='["cwrap"]' \
  -o myProg.js
```

**Output files:**
- `myProg.js` (WASM loader)
- `myProg.wasm` (WebAssembly binary)

### 2️⃣ Start the Backend
```bash
node server.js
```

**Expected output:** `Server running on http://localhost:3000`

### 3️⃣ Start the Frontend

**Option A: Using Python**
```bash
python -m http.server 8000
```

**Option B: Using Live Server**
```bash
npx live-server .
```

**Option C: Using Node.js http-server**
```bash
npx http-server -p 8000
```

Then open: [http://localhost:8000](http://localhost:8000)

---

## 🎯 Usage Example

1. Open the frontend in your browser
2. Enter values:
   - `p = 23` (prime number)
   - `g = 5` (generator)
3. Click **"Exchange Keys"**
4. View the results:
```
   K = 18   (shared secret)
   y = 13   (server public value)
   a = 11   (client private value)
```

---

## 🔒 Security Notes

✅ **Private values** `a` (client) and `b` (server) are **never transmitted**  
✅ Only **public values** `x` and `y` are exchanged  
✅ Shared key `K` is computed **independently** on both sides  
✅ Security relies on the **Discrete Logarithm Problem**

⚠️ **Note:** This implementation is for **educational purposes only**. For production use:
- Use cryptographically secure random number generators
- Use sufficiently large prime numbers (2048+ bits)
- Consider using established libraries (OpenSSL, libsodium)

---

## 🧪 Example Output
```
K = 18
y = 13
a = 11
```

---

## 📦 Submission Instructions

1. **Zip your entire project folder**
```bash
   zip -r diffie-hellman-wasm.zip project-folder/
```

2. **Generate MD5 hash of ZIP file**
```bash
   # Linux/Mac
   md5sum diffie-hellman-wasm.zip
   
   # Windows
   certutil -hashfile diffie-hellman-wasm.zip MD5
```

3. **Record the MD5 value** with the invigilator

---

## 🐛 Troubleshooting

### WASM Module Not Found
```bash
# Make sure myProg.js and myProg.wasm are in the same directory as index.html
# Re-compile if needed
emcc myProg.c -sEXPORTED_FUNCTIONS='["_modexp"]' -sEXPORTED_RUNTIME_METHODS='["cwrap"]' -o myProg.js
```

### Server Connection Error
```bash
# Check if server is running
node server.js

# Verify port 3000 is available
netstat -an | grep 3000
```

### CORS Issues
```javascript
// Add to server.js
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

---

## 📚 Mathematical Background

### Diffie–Hellman Protocol

**Given:**
- `p` = large prime number
- `g` = generator (primitive root modulo p)

**Steps:**
1. Alice picks secret `a`, computes `x = g^a mod p`
2. Bob picks secret `b`, computes `y = g^b mod p`
3. Alice and Bob exchange `x` and `y`
4. Alice computes `K = y^a mod p`
5. Bob computes `K = x^b mod p`
6. Both arrive at the same `K = g^(ab) mod p`

**Security:** Breaking this requires solving the discrete logarithm problem, which is computationally hard for large primes.

---

## 🎉 Conclusion

This project successfully demonstrates:
✅ Running C cryptography code inside the browser using **WebAssembly**  
✅ Implementing a complete **DH key exchange**  
✅ Client–server communication using **Node.js**  
✅ Secure computation of **shared secrets** over an insecure channel

---

## 📝 License

MIT License - Free to use for educational purposes

---
