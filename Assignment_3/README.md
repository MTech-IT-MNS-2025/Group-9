# Next.js + Socket.io Private Chat (Assignment-3)

## Overview
This project implements a one-to-one private messaging application using Next.js, Socket.io and MongoDB. It supports:
- Login with username
- One-to-one private messages (real-time via Socket.io)
- Messages persisted in MongoDB (chat history & offline delivery)
- API to fetch chat history between two users

## Project structure (key files)
- `server.js` — Custom server (Express) + Socket.io + message storage logic
- `models/Message.js` — Mongoose message model
- `pages/index.js` — Login page
- `pages/chat.js` — Chat UI (connects to socket.io-client)
- `package.json` — scripts & deps

## Features implemented (per assignment)
- Login page (username)
- Chat page with recipient field, input and message window
- `users` mapping (`{ username: socket.id }`) for routing private messages
- Socket events: `register_user`, `send_message`, `receive_message`
- Messages stored in MongoDB in `messages` collection
- `/api/messages?user1=...&user2=...` returns sorted chat history
- Offline delivery (server stores; when receiver connects later they'll get history via API)

## Optional enhancements included (suggested)
- Online users list (broadcasted with `user_list`)
- Message stored ack (`message_stored`) so sender can show stored/delivered state

## Setup & Run (local)
1. Clone this project.
2. Install dependencies:
