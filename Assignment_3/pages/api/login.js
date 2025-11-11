import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'users.json');

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    const users = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return res.json({ success: false, message: 'Invalid username or password' });
    }

    return res.json({ success: true });
  }

  res.status(405).end();
}

