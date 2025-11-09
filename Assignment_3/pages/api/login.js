// pages/api/login.js

if (!global.users) global.users = []; // same global variable

export default function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;

    const user = global.users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user)
      return res.json({ success: false, message: "Invalid username or password" });

    return res.json({ success: true });
  }

  res.status(405).end();
}

