// pages/api/register.js

if (!global.users) global.users = []; // shared memory

export default function handler(req, res) {
  if (req.method === "POST") {
    const { username, password } = req.body;
    if (!username || !password)
      return res.json({ success: false, message: "All fields required" });

    if (global.users.find((u) => u.username === username))
      return res.json({ success: false, message: "Username already exists" });

    global.users.push({ username, password });
    console.log("Users:", global.users); // for debugging

    return res.json({ success: true });
  }

  res.status(405).end();
}
