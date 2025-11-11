import User from '../../models/User';
import dbConnect from '../../utils/dbConnect';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.json({ success: false, message: 'All fields required' });
    }

    try {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.json({ success: false, message: 'Username already exists' });
      }

      await User.create({ username, password });
      return res.json({ success: true });
    } catch (err) {
      console.error('Register error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  res.status(405).end();
}
