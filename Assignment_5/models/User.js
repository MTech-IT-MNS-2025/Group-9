const mongoose = require("mongoose");

module.exports = mongoose.model(
  "User",
  new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    publicKey: { type: String, required: true } // Store PQC Public Key (Hex)
  })
);
