/**
 * PQC & AES CLIENT LIBRARY
 * * 1. Simulates a Post-Quantum KEM (Kyber-ish logic) for Assignment.
 * - In a real environment, replace `SimulatedKEM` with `liboqs-wasm`.
 * 2. Uses native Web Crypto API for AES-GCM (Performance & Security).
 */

const CryptoLib = {
    
    // Convert ArrayBuffer to Hex String
    bufToHex: (buffer) => {
        return Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    },

    // Convert Hex String to Uint8Array
    hexToBuf: (hexString) => {
        return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    },

    // -----------------------------------------------------------
    // 1. SIMULATED POST-QUANTUM KEM (Assignment Compliance)
    // -----------------------------------------------------------
    // NOTE: This uses SHA-256 to simulate Key Encapsulation. 
    // It creates the same API surface as liboqs: Keypair, Encap, Decap.
    
    KEM: {
        // Generate a pair (Simulates running the C program)
        generateKeypair: async () => {
            // Real PQC keys are large. We simulate with 32 bytes for simplicity.
            const secretKey = window.crypto.getRandomValues(new Uint8Array(32));
            
            // Public key derived from secret (in simulation)
            // In real Kyber, PK is mathematically derived.
            const publicKeyBuf = await window.crypto.subtle.digest("SHA-256", secretKey);
            
            return {
                pk: CryptoLib.bufToHex(publicKeyBuf),
                sk: CryptoLib.bufToHex(secretKey)
            };
        },

        // Sender: Uses Receiver's PK to create a Shared Secret + Ciphertext
        encapsulate: async (receiverPublicKeyHex) => {
            // 1. Generate a random "seed" (Simulating the random vector in Kyber)
            const seed = window.crypto.getRandomValues(new Uint8Array(32));
            
            // 2. The "KEM Ciphertext" in this simulation is just the seed 
            // (In real Kyber, this is a polynomial vector)
            const kemCiphertext = CryptoLib.bufToHex(seed);

            // 3. The Shared Secret is Hash(Seed || ReceiverPK)
            // This binds the secret to the specific receiver.
            const receiverPkBuf = CryptoLib.hexToBuf(receiverPublicKeyHex);
            const combined = new Uint8Array(seed.length + receiverPkBuf.length);
            combined.set(seed);
            combined.set(receiverPkBuf, seed.length);

            const sharedSecretBuf = await window.crypto.subtle.digest("SHA-256", combined);
            
            return {
                sharedSecret: sharedSecretBuf, // ArrayBuffer
                kemCiphertext: kemCiphertext   // Hex String
            };
        },

        // Receiver: Uses SK + Ciphertext to recover Shared Secret
        decapsulate: async (secretKeyHex, kemCiphertextHex) => {
            // 1. Recover the seed (In simulation, it IS the ciphertext)
            const seed = CryptoLib.hexToBuf(kemCiphertextHex);
            
            // 2. Re-derive own PK from SK (to match the Sender's logic)
            const skBuf = CryptoLib.hexToBuf(secretKeyHex);
            const pkBuf = await window.crypto.subtle.digest("SHA-256", skBuf);
            
            // 3. Re-calculate Hash(Seed || PK)
            const combined = new Uint8Array(seed.length + pkBuf.byteLength);
            combined.set(seed);
            combined.set(new Uint8Array(pkBuf), seed.length);

            const sharedSecretBuf = await window.crypto.subtle.digest("SHA-256", combined);
            
            return sharedSecretBuf; // ArrayBuffer
        }
    },

    // -----------------------------------------------------------
    // 2. AES-GCM (Authenticated Encryption)
    // -----------------------------------------------------------
    AES: {
        // Import the Shared Secret (from KEM) as an AES Key
        importKey: async (sharedSecretBuffer) => {
            return await window.crypto.subtle.importKey(
                "raw",
                sharedSecretBuffer,
                { name: "AES-GCM" },
                false,
                ["encrypt", "decrypt"]
            );
        },

        encrypt: async (key, plaintext) => {
            const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
            const enc = new TextEncoder();
            const encodedText = enc.encode(plaintext);

            const ciphertextBuffer = await window.crypto.subtle.encrypt(
                { name: "AES-GCM", iv: iv },
                key,
                encodedText
            );

            return {
                aesCiphertext: CryptoLib.bufToHex(ciphertextBuffer),
                iv: CryptoLib.bufToHex(iv)
            };
        },

        decrypt: async (key, aesCiphertextHex, ivHex) => {
            const iv = CryptoLib.hexToBuf(ivHex);
            const ciphertext = CryptoLib.hexToBuf(aesCiphertextHex);

            try {
                const decryptedBuffer = await window.crypto.subtle.decrypt(
                    { name: "AES-GCM", iv: iv },
                    key,
                    ciphertext
                );
                
                const dec = new TextDecoder();
                return dec.decode(decryptedBuffer);
            } catch (e) {
                console.error("Decryption failed:", e);
                return "[Decryption Error: Invalid Key or Tampered Message]";
            }
        }
    }
};
