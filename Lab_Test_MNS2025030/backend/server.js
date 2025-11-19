import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// f(x) = x^2 mod p  (or whichever your sir's function is)
function serverFunction(x, p) {
  return (x * x) % p;
}

app.post("/api/dh", (req, res) => {
  const { g, p, x } = req.body;

  console.log("Received from client:", { g, p, x });

  const y = serverFunction(x, p);
  const K = (x * y) % p; // Example shared key (modify as per assignment)

  res.json({ y, K });
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
