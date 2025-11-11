import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'users.json');

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;

    if (!username || !password)
      return res.json({ success: false, message: 'All fields required' });

    // Read existing users
    const users = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (users.find((u) => u.username === username)) {
      return res.json({ success: false, message: 'Username already exists' });
    }

    // Add new user
    users.push({ username, password });
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

    console.log('Registered Users:', users);
    return res.json({ success: true });
  }

  res.status(405).end();
}
