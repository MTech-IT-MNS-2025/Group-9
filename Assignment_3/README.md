# 💬 Next.js Real-Time Chat Application

This project is a **real-time chat application** built using **Next.js**, **Express.js**, **Socket.IO**, and **MongoDB**.  
It allows users to **register**, **log in**, and **chat instantly** with other online users.

---

## ⚙️ Installation and Setup Guide

### 🧩 Step 1: Install Node.js and npm
Run the following commands in Ubuntu:
sudo apt update
sudo apt install -y nodejs npm

Verify installation:
node -v
npm -v

---

### 🧩 Step 2: Install MongoDB (on Ubuntu / WSL)
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org

Start and enable MongoDB service:
sudo systemctl start mongod
sudo systemctl enable mongod

Check status:
sudo systemctl status mongod

---

### 🧩 Step 3: Clone the Repository
cd ~
git clone https://github.com/MTech-IT-MNS-2025/Group-9.git
cd Group-9/Assignment_3

---

### 🧩 Step 4: Install Project Dependencies
npm install

---

### 🧩 Step 5: Create Environment Variables
Create a `.env` file in your root project folder:
MONGO_URI=mongodb://localhost:27017/chatapp
PORT=3000

---

### 🧩 Step 6: Start the Application
npm run dev

Visit http://localhost:3000 in your browser.

---

## 🗂️ Folder Structure

nextjs-chat/

├── models/                 # MongoDB Schemas (Message)

├── pages/

│   ├── api/                # API routes (login, register, messages)

│   ├── index.js            # Login page

│   ├── register.js         # Registration page

│   └── chat.js             # Chat interface

├── Screenshots/            # App screenshots

├── server.js               # Express + Socket.IO backend server

├── package.json            # Project dependencies

├── .env                    # Environment variables

└── README.md               # Documentation

---

## 🖼️ Application Screenshots

- Register Page: Screenshots/sc_ass3_1.png
- Login Page: Screenshots/sc_ass3_2.png
- Chat Interface: Screenshots/sc_ass3_3.png

---

## 🧠 Technologies Used

Next.js - Frontend and API routes  
React.js - UI framework  
Express.js - Backend server  
Socket.IO - Real-time chat functionality  
MongoDB - Database storage  
Mongoose - ODM for MongoDB  
dotenv - Environment variable management

---

## 🧹 Clean-up Before Submission

rm -rf node_modules .next
zip -r nextjs-chat.zip models pages Screenshots server.js package.json .env README.md

---

## 👨‍💻 Author
**Group9 2025**  
M.Tech (IT) – Network & Security  
IIIT Allahabad
"""
MNS2025030
MNS2025031
Course: M.Tech (Network & Security, IT) – IIIT Allahabad
Year: 2025
Assignment: Real-time Chat Application using Next.js & Socket.io
