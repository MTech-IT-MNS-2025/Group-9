# POST-QUANTUM SECURE MESSAGING APP (ASSIGNMENT-5)
-------------------------------------------------

Using:
- liboqs (Open Quantum Safe)
- C Programs for Kyber KEM
- WebAssembly (WASM) for in-browser PQC
- AES-GCM for message encryption
- Next.js + Socket.io backend
- Client-side secret-key protection


## 1. INTRODUCTION


### This project extends Assignment-3 by converting the messaging system into a fully post-quantum secure application using liboqs.

PQC Features Implemented:
- Kyber KEM (C → WASM)
- AES-GCM session-key encryption
- PQ public-key registration
- Client-side decapsulation and AES decryption
- Secret key stored only in browser memory
- Server stores only public keys

This meets the assignment requirements:
“Use liboqs… encrypt messages using AES… session key encapsulated by KEM…
generate keypair manually using C… protect against side-channel leaks.”


# 2. PROJECT STRUCTURE

```
nextjs-chat/
├── server.js
├── models/
│   ├── User.js
│   └── Message.js
│
├── pages/
│   ├── index.js        (login, upload sk.bin)
│   ├── register.js     (register, upload pk.bin)
│   ├── chat.js         (UI + PQC encryption/decryption)
│   └── api/
│       ├── register.js
│       ├── login.js
│       ├── getPqKey.js
│       └── messages.js
│
├── lib/
│   ├── pqKemClient.js  (JS → WASM Kyber KEM)
│   ├── pqAes.js        (AES-GCM encryption/decryption)
│   ├── utils.js
│
├── public/
│   ├── pqc_kem.js      (Emscripten loader)
│   └── pqc_kem.wasm    (Kyber KEM WebAssembly)
│
└── pqc_c_code/
    ├── keygen.c        (Standalone C PQ key generator)
    ├── pqc_kem.c       (Kyber KEM compiled to WASM)
    ├── pqc_kem.js
    ├── pqc_kem.wasm
    ├── pk.bin
    └── sk.bin
```

# 3. INSTALLATION (LINUX)


Install Node.js, npm and MongoDB:
```
    sudo apt update
    sudo apt install nodejs npm mongodb
    sudo systemctl start mongodb
    sudo systemctl enable mongodb
```

Install dependencies:

    cd nextjs-chat
    npm install

# 4. INSTALLING LIBOQS

Clone and build liboqs:

    git clone https://github.com/open-quantum-safe/liboqs.git
    cd liboqs
    mkdir build && cd build
    cmake -DCMAKE_INSTALL_PREFIX=$HOME/oqs-install -DOQS_BUILD_SHARED_LIB=OFF ..
    make -j4
    make install

liboqs installed at:
- $HOME/oqs-install/include/oqs
- $HOME/oqs-install/lib

# 5. GENERATING PQ KEYS (STANDALONE C PROGRAM)


Move to pqc_c_code folder:

    cd ~/nextjs-chat/pqc_c_code

Compile keygen.c:

    gcc keygen.c       -I$HOME/oqs-install/include       -L$HOME/oqs-install/lib -loqs -lcrypto       -o keygen

Run it:

    ./keygen

It generates:
- pk.bin (public key) → upload during registration
- sk.bin (secret key) → upload during login

# 6. COMPILING PQC KEM (C → WASM)


Install emscripten:

    sudo apt install emscripten

Compile pqc_kem.c to WASM:

    emcc pqc_kem.c       -I$HOME/oqs-install/include       -L$HOME/oqs-install/lib -loqs       -sEXPORTED_FUNCTIONS='["_kem_public_key_len","_kem_secret_key_len","_kem_ciphertext_len","_kem_shared_secret_len","_kem_keypair","_kem_encaps","_kem_decaps"]'       -sEXPORTED_RUNTIME_METHODS='["cwrap","ccall","HEAPU8","_malloc","_free"]'       -O3       -o pqc_kem.js

Copy WASM output to public/:

    cp pqc_kem.* ~/nextjs-chat/public/

# 7. RUNNING APPLICATION


    cd nextjs-chat
    npm run dev

Runs at:
    http://localhost:3000


# 8. PQC FLOW (END-TO-END)


## Registration 
1. User generates keys with keygen.c
2. Uploads pk.bin
3. Server stores PQ public key in MongoDB

## Login 
1. User uploads sk.bin
2. Browser stores secret key in sessionStorage
3. Secret key is NEVER sent to server

## Sending Message
1. Sender fetches receiver PQ public key
2. WASM Kyber encaps:
       kem_encaps(pk) → CT, sharedSecret
3. Session key = SHA-256(sharedSecret)
4. AES-GCM encrypts plaintext
5. Socket sends:
       kemCiphertext, aesCiphertext, iv

## Receiving Message 
1. Browser loads sk.bin from sessionStorage
2. Kyber decapsulation:
       kem_decaps(sk, CT) → sharedSecret
3. Derive AES key
4. AES-GCM decrypts message
5. Display plaintext

## 9. SECURITY & SIDE-CHANNEL PROTECTIONS


✔ Secret key stored only in browser
✔ AES-GCM WebCrypto (constant-time)
✔ WASM memory freed after KEM operations
✔ No sensitive data printed in console
✔ PQ secret key never sent to server
✔ Public-key lookup per user ensures forward secrecy

## 10. TESTING WITH TWO USERS


User A:
    ./keygen → pkA.bin, skA.bin
    Register → upload pkA.bin
    Login → upload skA.bin

User B:
    ./keygen → pkB.bin, skB.bin
    Register → upload pkB.bin
    Login → upload skB.bin

Open two browsers → start chatting.

## 11. CONCLUSION


This project successfully satisfies the assignment:

- Uses liboqs in C and WASM
- Implements PQC Kyber KEM
- Uses AES-GCM for encryption
- Public-key registration fully implemented
- Session key encapsulation/de-capsulation handled client-side
- Side-channel safe design
- Fully upgraded Assignment-3 to a PQ secure chat application

END OF README


```
