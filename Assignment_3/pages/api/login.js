import User from '../../models/User';
import dbConnect from '../../utils/dbConnect';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'POST') {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username, password });

      if (!user) {
        return res.json({ success: false, message: 'Invalid username or password' });
      }

      return res.json({ success: true });
    } catch (err) {
      console.error('Login error:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
  }

  res.status(405).end();
}
