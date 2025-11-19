// server.js - custom Next.js + Express + Socket.io server
require('dotenv').config();
const express = require('express');
const http = require('http');
const next = require('next');
const mongoose = require('mongoose');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

const Message = require('./models/Message');

app.prepare().then(async () => {
  // Connect to MongoDB
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nextjs-chat';
  mongoose.set('strictQuery', false);
  await mongoose.connect(MONGODB_URI, {});

  const server = express();
  const httpServer = http.createServer(server);

  const { Server } = require('socket.io');
  const io = new Server(httpServer, {
    cors: { origin: true }
  });

  // store username -> socket.id
  const users = {};

  io.on('connection', (socket) => {
    console.log('socket connected:', socket.id);

    socket.on('register_user', (username) => {
      if (!username) return;
      users[username] = socket.id;
      socket.username = username;
      console.log('registered:', username, '->', socket.id);
      // Optionally broadcast user online status
      io.emit('user_list', Object.keys(users));
    });

    socket.on('send_message', async ({ sender, receiver, text }) => {
      if (!sender || !receiver || !text) return;
      try {
        const msg = await Message.create({
          sender,
          receiver,
          text,
          timestamp: new Date()
        });

        // send to receiver if online
        const receiverSocketId = users[receiver];
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_message', {
            sender,
            text,
            timestamp: msg.timestamp
          });
        }

        // also optionally acknowledge sender (so sender UI can show delivered)
        socket.emit('message_stored', {
          sender,
          receiver,
          text,
          timestamp: msg.timestamp
        });
      } catch (err) {
        console.error('Error storing message', err);
      }
    });

    socket.on('disconnect', () => {
      if (socket.username) {
        delete users[socket.username];
        io.emit('user_list', Object.keys(users));
      }
      console.log('socket disconnected:', socket.id);
    });
  });

  // API route for messages (server-side)
  server.get('/api/messages', async (req, res) => {
    const { user1, user2 } = req.query;
    if (!user1 || !user2) return res.status(400).json({ error: 'user1 and user2 required' });

    try {
      // find messages where (sender=user1 and receiver=user2) or vice-versa
      const messages = await Message.find({
        $or: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 }
        ]
      }).sort({ timestamp: 1 }).lean();

      res.json(messages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'server error' });
    }
  });

  // Let Next handle everything else
  server.all('*', (req, res) => handle(req, res));

  httpServer.listen(PORT, () => {
    console.log(`> Server listening on http://localhost:${PORT}`);
  });
});
