// pages/chat.js - Chat UI
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { useRouter } from 'next/router';

let socket;

export default function ChatPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [recipient, setRecipient] = useState('');
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const messagesRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('chat_username');
    if (!stored) {
      router.replace('/');
      return;
    }
    setUsername(stored);

    // connect socket
    socket = io();

    socket.on('connect', () => {
      socket.emit('register_user', stored);
    });

    socket.on('receive_message', (msg) => {
      // push into messages if the chat involves current recipient or is sender
      setMessages((prev) => [...prev, { ...msg, incoming: true }]);
    });

    socket.on('message_stored', (msg) => {
      // server ack for stored message - show as sent message (local)
      setMessages((prev) => [...prev, { ...msg, incoming: false }]);
    });

    socket.on('user_list', (list) => {
      setOnlineUsers(list || []);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // scroll to bottom on messages change
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const loadHistory = async () => {
    if (!recipient) return;
    const res = await fetch(`/api/messages?user1=${encodeURIComponent(username)}&user2=${encodeURIComponent(recipient)}`);
    const hist = await res.json();
    // normalize messages into UI shape: {sender, receiver, text, timestamp}
    const formatted = hist.map(m => ({
      sender: m.sender,
      receiver: m.receiver,
      text: m.text,
      timestamp: m.timestamp,
      incoming: m.sender !== username
    }));
    setMessages(formatted);
  };

  const send = (e) => {
    e.preventDefault();
    if (!recipient || !text.trim()) return;
    // emit to server for storage and delivery
    socket.emit('send_message', { sender: username, receiver: recipient, text: text.trim() });

    // clear input (message will be appended via message_stored ack)
    setText('');
  };

  return (
    <div style={{ maxWidth: 900, margin: '20px auto', display: 'grid', gridTemplateColumns: '260px 1fr', gap: 16 }}>
      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
        <h3>Profile</h3>
        <div><b>You:</b> {username}</div>
        <hr />
        <h4>Online Users</h4>
        <ul style={{ paddingLeft: 12 }}>
          {onlineUsers.map(u => (
            <li key={u} style={{ fontWeight: u === username ? 'bold' : 'normal' }}>{u}</li>
          ))}
        </ul>
      </div>

      <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, display: 'flex', flexDirection: 'column', height: '70vh' }}>
        <div style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
          <input
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="recipient username"
            style={{ padding: 8, flex: '0 0 240px' }}
          />
          <button onClick={loadHistory}>Load History</button>
          <div style={{ marginLeft: 'auto', alignSelf: 'center' }}>
            <small>Recipient status: <b>{recipient ? (onlineUsers.includes(recipient) ? 'online' : 'offline') : '-'}</b></small>
          </div>
        </div>

        <div ref={messagesRef} style={{ flex: 1, overflowY: 'auto', border: '1px solid #eee', padding: 12, borderRadius: 6, background: '#fafafa' }}>
          {messages.map((m, idx) => (
            <div key={idx} style={{ marginBottom: 10, textAlign: m.incoming ? 'left' : 'right' }}>
              <div style={{ display: 'inline-block', padding: '8px 12px', borderRadius: 16, background: m.incoming ? '#fff' : '#d1ffd6', border: '1px solid #ddd', maxWidth: '80%' }}>
                <div style={{ fontSize: 12, color: '#555' }}>
                  <b>{m.incoming ? m.sender : 'You'}</b> <span style={{ marginLeft: 8, fontSize: 11, color: '#999' }}>{new Date(m.timestamp).toLocaleString()}</span>
                </div>
                <div style={{ marginTop: 6 }}>{m.text}</div>
              </div>
            </div>
          ))}

          {messages.length === 0 && (<div style={{ color: '#777' }}>No messages yet. Load history or send one.</div>)}
        </div>

        <form onSubmit={send} style={{ marginTop: 12, display: 'flex', gap: 8 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="type a message..."
            style={{ flex: 1, padding: 8 }}
          />
          <button type="submit" style={{ padding: '8px 12px' }}>Send</button>
        </form>
      </div>
    </div>
  );
}
