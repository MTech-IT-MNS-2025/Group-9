// pages/index.js - Login page
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const router = useRouter();

  const submit = (e) => {
    e.preventDefault();
    if (!username.trim()) return;
    // store in localStorage for later use
    localStorage.setItem('chat_username', username.trim());
    router.push('/chat');
  };

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <form onSubmit={submit} style={{ width: 360, padding: 24, border: '1px solid #ddd', borderRadius: 8 }}>
        <h2>Login to Chat</h2>
        <label>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="enter a username"
          style={{ width: '100%', padding: 8, marginTop: 8, marginBottom: 12 }}
        />
        <button style={{ width: '100%', padding: 10 }}>Enter Chat</button>
      </form>
    </div>
  );
}
