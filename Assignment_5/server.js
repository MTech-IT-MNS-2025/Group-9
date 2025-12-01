require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const path = require("path");

const User = require("./models/User");
const Message = require("./models/Message");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ---------- MIDDLEWARE ----------
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ---------- MONGODB ----------
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/pqc-chat-new";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ---------- STATE ----------
const onlineUsers = {}; 

// ---------- ROUTES ----------

app.post("/api/register", async (req, res) => {
  try {
    const { username, password, publicKey } = req.body;
    if (!username || !password || !publicKey) return res.json({ ok: false, error: "Missing fields" });
    const exist = await User.findOne({ username });
    if (exist) return res.json({ ok: false, error: "User already exists" });
    await User.create({ username, password, publicKey });
    console.log(`👤 New User: ${username}`);
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || user.password !== password) return res.json({ ok: false, error: "Invalid credentials" });
    return res.json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

app.get("/api/get_key/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.json({ ok: false, error: "User not found" });
    return res.json({ ok: true, publicKey: user.publicKey });
  } catch (e) {
    return res.status(500).json({ ok: false, error: "Server error" });
  }
});

app.get("/api/messages", async (req, res) => {
  try {
    const { user1, user2 } = req.query;
    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (e) {
    res.status(500).json({ error: "Could not fetch messages" });
  }
});

// ---------- SOCKET CHAT ----------
io.on("connection", (socket) => {
  console.log("🟢 Socket Connected:", socket.id);

  socket.on("register_online", (username) => {
    if (!username) return;
    onlineUsers[username] = socket.id;
    io.emit("online_users", Object.keys(onlineUsers));
  });

  socket.on("send_message", async (data) => {
    const { 
      sender, receiver, 
      aesCiphertext, kemCiphertext, iv, // Receiver's copy
      senderAesCiphertext, senderKemCiphertext, senderIv // Sender's copy (NEW)
    } = data;

    if (!sender || !receiver || !aesCiphertext) return;

    try {
      // 1. Store BOTH copies in DB (This fixes the history issue)
      await Message.create({ 
        sender, receiver, 
        aesCiphertext, kemCiphertext, iv,
        senderAesCiphertext, senderKemCiphertext, senderIv 
      });

      // 2. Payload for Receiver (Needs standard fields)
      const receiverPayload = {
        sender, receiver,
        aesCiphertext, kemCiphertext, iv,
        createdAt: new Date()
      };

      // 3. Payload for Sender (Echo back just in case, though UI handles it locally)
      const senderPayload = {
        sender, receiver,
        aesCiphertext: senderAesCiphertext,
        kemCiphertext: senderKemCiphertext,
        iv: senderIv,
        createdAt: new Date()
      };

      // Send to Receiver
      const targetSocket = onlineUsers[receiver];
      if (targetSocket) {
        io.to(targetSocket).emit("receive_message", receiverPayload);
      }
      
      // Ack to sender
      socket.emit("message_sent_ack", senderPayload);

    } catch (e) {
      console.error("MESSAGE ERROR:", e.message);
    }
  });

  socket.on("disconnect", () => {
    for (const u in onlineUsers) {
      if (onlineUsers[u] === socket.id) delete onlineUsers[u];
    }
    io.emit("online_users", Object.keys(onlineUsers));
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log("🚀 Server running on http://localhost:" + PORT);
});