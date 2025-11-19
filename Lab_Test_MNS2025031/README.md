📘 Diffie–Hellman Key Exchange — WebAssembly + Node.js (Lab Test)
📌 Objective

The objective of this lab test is to implement the Diffie–Hellman Shared Secret Key Exchange between a Client (Browser) and a Server (Node.js).
The modular exponentiation ( gᵃ mod p and gᵇ mod p ) must be computed using the WASM version of the given C file (myProg.c).

🚀 Complete Workflow
1️⃣ User Inputs p and g (Frontend)

The user enters:

A prime number p

A generator g

These values are public.

2️⃣ Client Randomly Generates Private Key (a)

JavaScript generates a random:

a ∈ Zp*


This private key never leaves the browser.

3️⃣ Client Computes x = gᵃ mod p using WASM

The given file myProg.c contains the modular exponentiation function.

It is compiled to WebAssembly using Emscripten.

The browser calls the WASM function:

x = modexp(g, a, p)


✔ Faster
✔ Precise
✔ Runs C inside browser

4️⃣ Client Sends Public Values to Server

The browser sends:

{ "g": ..., "p": ..., "x": ... }


Private key a is NOT sent.

5️⃣ Server Randomly Generates Private Key (b)

On receiving the request, the server picks:

b ∈ Zp*


This stays on the server and is never shared.

6️⃣ Server Computes:
y = gᵇ mod p        # public value
K = xᵇ mod p        # shared secret key


Both computations use modular exponentiation.

7️⃣ Server Sends Result Back to Client

The response contains:

{ "y": ..., "K": ... }

8️⃣ Client Displays Final Output

The frontend prints:

K → Shared secret key

y → Server’s public value

a → Client’s private value

This matches the required output format from the lab.

🧩 Technology Stack
Frontend

HTML

JavaScript

WebAssembly (compiled from C)

Fetch API

Backend

Node.js

Express.js

JSON REST API

Cryptography

Modular exponentiation

Diffie–Hellman Key Exchange

Random private keys

Shared secret derived independently

🛠 File Structure
/
├── index.html
├── myProg.c
├── myProg.js
├── myProg.wasm
├── server.js
├── README.md
└── package.json

⚙️ Build & Run Commands
1️⃣ Compile C → WebAssembly
emcc myProg.c \
  -sEXPORTED_FUNCTIONS='["_modexp"]' \
  -sEXPORTED_RUNTIME_METHODS='["cwrap"]' \
  -o myProg.js


Generates:

myProg.js

myProg.wasm

2️⃣ Start the Node.js Server
node server.js


Server starts on http://localhost:3000

3️⃣ Start the Frontend

Any of the following:

npx live-server .


or

python3 -m http.server 8000


or

npx http-server -p 8000


Then open:

http://localhost:8000

🧪 Example Input/Output

Input:

p = 23
g = 5


Output:

K = 18
y = 13
a = 11

🔒 Security Notes

Private keys a and b are never transmitted.

Only x = gᵃ mod p and y = gᵇ mod p are exchanged.

Shared key K = gᵃᵇ mod p is computed separately by both sides.

Security depends on the Discrete Logarithm Problem.

📦 Submission Instructions

Zip the entire project folder:

zip -r dh-wasm.zip .


Generate MD5 digest:

md5 dh-wasm.zip


Record the MD5 with the invigilator.

🎉 Conclusion

This project successfully demonstrates:

Running C cryptographic code in the browser using WebAssembly

Implementing Diffie–Hellman key exchange

Using Node.js as server

Secure shared key generation over an insecure channel
