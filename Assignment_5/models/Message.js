const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Message",
  new mongoose.Schema({
    sender: String,
    receiver: String,
    
    // --- RECEIVER COPY (Friend ke liye) ---
    aesCiphertext: String, 
    iv: String,            
    kemCiphertext: String, 
    
    // --- SENDER COPY (Aapke liye - History fix) ---
    senderAesCiphertext: String,
    senderIv: String,
    senderKemCiphertext: String,

    createdAt: { type: Date, default: Date.now }
  })
);
