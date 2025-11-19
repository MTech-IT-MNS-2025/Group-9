const express = require('express');
const { execFile } = require('child_process');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

function callNative(base, exp, mod) {
  return new Promise((resolve, reject) => {
    const exe = path.join(__dirname, 'myProg_native');
    execFile(exe, [String(base), String(exp), String(mod)], { timeout: 5000 }, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve(stdout.trim());
    });
  });
}

app.post('/run', async (req, res) => {
  try {
    const { g, p, x } = req.body;
    if (g === undefined || p === undefined || x === undefined) return res.status(400).json({ error: 'missing g/p/x' });

    const gg = BigInt(String(g));
    const pp = BigInt(String(p));
    // x may be large — send to native as decimal string; native wrapper uses atoll (works up to 64-bit)
    const xx = BigInt(String(x));

    function rndZp(pn) {
      const pNum = Number(pn);
      if (pNum <= 2) return 1;
      return Math.floor(Math.random() * (pNum - 1)) + 1;
    }
    const b = rndZp(Number(pp));

    // call native with numeric args (native uses 64-bit signed)
    const y = await callNative(Number(gg), b, Number(pp));
    const K = await callNative(Number(xx), b, Number(pp));

    res.json({ K: String(K), y: String(y) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err) });
  }
});

const port = 3000;
app.listen(port, () => console.log('Server listening on http://localhost:' + port));
