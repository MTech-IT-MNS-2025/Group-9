# IC Lab Assignment 2 – Post-Quantum Cryptography
### M.Tech (IT – Network & Security)
### IIIT Allahabad

---

## 🧠 Objective
To understand and implement **Post-Quantum Cryptography (PQC)** algorithms using the **liboqs** library.  
This assignment focuses on:
- Implementing **Key Encapsulation Mechanisms (KEM)** like **Kyber512** and **NTRU**  
- Implementing a **Digital Signature Scheme** (Dilithium2)  
- Comparing their efficiency and security properties  

---

## ⚙️ Environment Setup

### Step 1 – Install Dependencies
sudo apt update && sudo apt install build-essential cmake git pkg-config -y

### Step 2 – Build and Install liboqs
git clone --branch main https://github.com/open-quantum-safe/liboqs.git
cd liboqs
mkdir build && cd build
cmake -DCMAKE_INSTALL_PREFIX=/usr/local -DOQS_USE_OPENSSL=OFF -DOQS_ENABLE_SIGS=ON -DOQS_ENABLE_KEMS=ON ..
make -j$(nproc)
sudo make install
sudo ldconfig

---

## 💻 Task 1 – Kyber512 KEM (Key Encapsulation)

**File:** task1.c

### Description
Implements the **Kyber512** Key Encapsulation Mechanism (KEM):
1. Key Generation  
2. Encapsulation (Sender side)  
3. Decapsulation (Receiver side)  
4. Verification of shared secrets  

### Expected Output
Using algorithm: Kyber512
Step 1: Key pair generated successfully.
Step 2: Ciphertext and sender's shared secret generated.
Step 3: Receiver recovered shared secret.
Success: Shared secrets match!

### Learning Outcome
Understood how two parties can securely share a common secret using PQC algorithms.

---

## 💻 Task 2 – KEM Algorithm Comparison (NTRU / Kyber)

**File:** task2_kem.c

### Description
This program:
- Lists all available KEM algorithms in liboqs  
- Performs key generation, encapsulation, and decapsulation  
- Measures execution time for each step  
- Verifies if the shared secrets match  

### Expected Output
KEM algorithms known to liboqs (total N):
[ 0] Kyber512 : ENABLED
[ 1] NTRU-HPS-2048-509 : ENABLED
Using KEM: NTRU-HPS-2048-509
Shared secrets match!

### Learning Outcome
Compared the performance of different lattice-based KEMs.  
Observed that **Kyber512** is faster, while **NTRU** has larger key sizes but similar security.

---

## 💻 Task 3 – Dilithium2 Digital Signature

**File:** task3_dilithium_sig.c

### Description
Implements the **Dilithium2** signature scheme to demonstrate message signing and verification.  
Steps performed:
1. Key Pair Generation  
2. Message Signing  
3. Signature Verification  

### Expected Output
Using algorithm: Dilithium2
Step 1: Key pair generated successfully.
Step 2: Message signed successfully.
Step 3: Signature verification SUCCESS.

### Learning Outcome
Understood the difference between encryption (KEM) and authentication (Signature).  
Observed that Dilithium2 produces large but highly secure signatures.

---

## 📊 Task 4 – Comparison Report

**File:** report.txt

### Description
Compares Kyber512, NTRU, and Dilithium2 based on:
- Key sizes  
- Operation times  
- Security levels  
- Practical use cases  

### Sample Comparison Table
Algorithm | Type | Keygen (ms) | Encapsulation (ms) | Decapsulation (ms) | Signature (bytes)
Kyber512 | KEM | 2.5 | 0.8 | 0.6 | -
NTRU-HPS-509 | KEM | 4.1 | 1.3 | 0.7 | -
Dilithium2 | SIG | 3.5 | - | - | 2700

### Conclusion
- Kyber512 is the most efficient KEM among tested algorithms.  
- NTRU provides similar security with slightly slower performance.  
- Dilithium2 signatures are larger but essential for post-quantum authentication.  
- PQC algorithms ensure future-proof security against quantum computers.

---

## 🧰 Tools and Libraries
- **Language:** C  
- **Library:** liboqs (Open Quantum Safe)  
- **Platform:** Ubuntu (WSL on Windows 10/11)

---

## 🧾 Final Conclusion
This assignment helped me understand how **Post-Quantum Cryptography** protects communications against future quantum attacks.  
Kyber512 and NTRU establish shared secrets securely, while Dilithium2 provides digital signatures for authentication.  
Together, they form the foundation of **quantum-safe security**.

---

© 2025 Sandeep Ananthavarapu | IIIT Allahabad
