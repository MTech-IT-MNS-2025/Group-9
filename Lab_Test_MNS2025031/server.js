const express = require("express");
const cors = require("cors");

const { execSync } = require("child_process");
const app = express();
app.use(cors());
app.use(express.json());

// JS version of modular exponentiation
function modexp(base, exp, mod) {
  let result = 1;
  base = base % mod;

  while (exp > 0) {
    if (exp & 1) result = (result * base) % mod;
    base = (base * base) % mod;
    exp >>= 1;
  }
  return result;
}

app.post("/run", (req, res) => {
  const { g, p, x } = req.body;

  // step 2: random b ∈ Zp*
  const b = Math.floor(Math.random() * (p - 2)) + 2;

  // step 3: y = g^b mod p
  const y = modexp(g, b, p);

  // step 4: K = x^b mod p
  const K = modexp(x, b, p);

  res.json({ K, y });
});

app.listen(3000, () => console.log("Server running on port 3000"));

