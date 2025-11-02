# Next.js + Socket.io Private Chat Application

## Overview
This project implements a real-time one-to-one private messaging system using Next.js, Express, Socket.io, and MongoDB.
It supports user login, private chat, message storage, and chat history retrieval between two users.

## Features Implemented
- Login page with username input
- Chat page for one-to-one private messages
- Real-time communication using Socket.io
- Messages stored in MongoDB
- API route to fetch chat history between two users
- Online user tracking using Socket.io connections

## Project Structure
nextjs-chat/
│
├── models/
│   └── Message.js          # MongoDB schema and model for chat messages
│
├── pages/
│   ├── index.js            # Login page (enter username)
│   └── chat.js             # Chat interface (send/receive messages)
│
├── server.js               # Main backend server with Express + Socket.io
│
├── package.json            # Project dependencies and scripts
│
├── .env                    # Environment variables (database URI, port)
│
└── README.txt              # Project documentation

## Installation and Setup Guide

### 1. Install Node.js
Download and install Node.js LTS from https://nodejs.org
Check installation:
    node -v
    npm -v

### 2. Install MongoDB
You can either:
- Use local MongoDB — Download from https://www.mongodb.com/try/download/community
- Use MongoDB Atlas (Cloud) — Create a free cluster at https://www.mongodb.com/cloud/atlas

Example .env file:
    MONGODB_URI=mongodb://localhost:27017/nextjs-chat
    PORT=3000

### 3. Install Dependencies
Open terminal inside your project folder:
    npm install

If you’re on Windows and using cross-env:
    npm install cross-env

### 4. Run the Application
Start the development server:
    npm run dev

If successful, you’ll see:
    > Server listening on http://localhost:3000

Then open your browser at http://localhost:3000

## Usage Instructions

### Step 1: Login
- Visit http://localhost:3000
- Enter your username (e.g., sandeep)
- Click Enter Chat

### Step 2: Open Another Window
- Open a new browser window or incognito tab
- Enter another username (e.g., arif)

### Step 3: Chat
- In Sandeep’s chat window, type recipient: arif and send a message
- The message appears instantly in Arif’s chat window
- All messages are stored in MongoDB for persistence

## Your Contributions

### models/Message.js
Defines the MongoDB schema and model for storing chat messages — including sender, receiver, text, and timestamp — using Mongoose.

### server.js
Acts as the main backend server, integrating Express, Socket.io, and Next.js.
It handles:
- Real-time socket connections
- User registration and online tracking
- Sending and receiving private messages
- Storing messages in MongoDB
- Providing an API (/api/messages) to fetch chat history

### .env
Stores environment variables securely, including:
- Database connection string (MONGODB_URI)
- Application port (PORT)

This keeps sensitive configuration separate from the source code.

## Useful Commands
npm install         - Install all required dependencies
npm run dev         - Start the development server
node server.js      - Run the app directly without npm scripts
npm audit fix       - Fix security issues if found
Ctrl + C            - Stop the running server

## How It Works
1. User logs in and connects to Socket.io server.
2. Server registers username and tracks socket ID.
3. When a user sends a message:
   - Server stores it in MongoDB.
   - If recipient is online, it emits the message instantly.
4. Users can fetch full chat history from /api/messages.
5. Messages persist even after both users disconnect.

## Technologies Used
Next.js       - Frontend and routing framework
Express.js    - Backend framework for server & API
Socket.io     - Real-time message communication
MongoDB       - Database for storing chat messages
Mongoose      - ODM for MongoDB
dotenv        - Loads environment variables from .env
cross-env     - Ensures compatibility on Windows systems

## Verification Checklist
- Node.js and MongoDB installed
- .env file created with proper values
- npm install completed successfully
- npm run dev starts the server
- App opens at http://localhost:3000
- Chat works between two users in real-time
- Messages persist in MongoDB

## Author
MNS2025029
MNS2025030
MNS2025031
Course: M.Tech (Network & Security, IT) – IIIT Allahabad
Year: 2025
Assignment: Real-time Chat Application using Next.js & Socket.io
