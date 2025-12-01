# 🔐 Private Messaging Application (Post-Quantum Secure)

A real-time, one-to-one **end-to-end encrypted private messaging system** designed to remain secure even against **future Quantum Computer attacks** using **Post-Quantum Cryptography (PQC)**.

---

## 📖 Overview

This project implements a **real-time private messaging application** using:

- **Node.js + Express** for backend  
- **Socket.io** for real-time communication  
- **MongoDB** for encrypted message storage  

Unlike traditional chat applications, this project uses a **Hybrid Cryptography Scheme (KEM–DEM)** which combines:

- **Post-Quantum Cryptography (KEM)**  
- **Classical AES-256-GCM Encryption (DEM)**  

All messages are stored **only in encrypted form**, ensuring **even the server cannot read user messages**.

---

## ✨ Key Features

- 🧬 **Post-Quantum Security** – Uses a Key Encapsulation Mechanism (KEM)  
- 🔒 **End-to-End Encryption (E2EE)** – AES-256-GCM in the browser  
- 👤 **User Authentication** – Username + manually managed private key  
- ⚡ **Real-Time Messaging** – Socket.io based secure messaging  
- 🗂 **Encrypted Chat History** – Stored in encrypted form in MongoDB  
- 🛡 **Side-Channel Protection** – Private keys stored only in RAM  

---

## 📸 Screenshots

### 🔐 Login Page
![Login](https://raw.githubusercontent.com/MTech-IT-MNS-2025/Group-9/main/Assignment_5/Screenshots/login.png)

### 📝 Register Page
![Register](https://raw.githubusercontent.com/MTech-IT-MNS-2025/Group-9/main/Assignment_5/Screenshots/register.png)

### 💬 Chat Interface
![Chat](https://raw.githubusercontent.com/MTech-IT-MNS-2025/Group-9/main/Assignment_5/Screenshots/chat.png)


---

## 🏗️ Project Architecture

```text
pqc-secure-chat
│── server.js
│── package.json
│── README.md
│
├── models
│   ├── Message.js
│   └── User.js
│
└── public
    ├── index.html
    └── js
        ├── app.js
        └── crypto-client.js
```

---

## 💻 Installation (macOS)

### ✅ Prerequisites
Install Homebrew (if not already installed):

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

---

### 1️⃣ Install Node.js & npm

```bash
brew install node
```

---

### 2️⃣ Install MongoDB

```bash
brew tap mongodb/brew
brew update
brew install mongodb-community@8.0
brew services start mongodb-community@8.0
```

---

### 3️⃣ (Optional) Install MongoDB Compass

Download from:  
https://www.mongodb.com/try/download/compass

---

### 4️⃣ Run the Application

```bash
git clone https://github.com/yourusername/pqc-secure-chat.git
cd pqc-secure-chat
npm install
npm start
```

Open in browser:

```
http://localhost:4000
```

---

## 🔍 Verifying Encrypted Data in MongoDB

```bash
mongosh
use pqc-chat-new
db.messages.find()
```

### ✅ Example Output

```json
{
  "_id": ObjectId("64..."),
  "sender": "Alice",
  "receiver": "Bob",
  "aesCiphertext": "7f9a2...",
  "kemCiphertext": "1c8d4e...",
  "iv": "a12...",
  "createdAt": ISODate("...")
}
```

⚠️ **Plaintext messages will NOT be visible**, proving End-to-End Encryption.

---

## 🧰 Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript  
- **Backend:** Node.js, Express.js  
- **Real-Time Communication:** Socket.io  
- **Database:** MongoDB  
- **Cryptography:** Web Crypto API (AES-GCM + PQC Simulation)
