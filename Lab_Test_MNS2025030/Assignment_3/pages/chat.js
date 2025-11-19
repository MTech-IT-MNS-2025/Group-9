// pages/chat.js - Modern WhatsApp-style Chat
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

    socket = io();

    socket.on('connect', () => socket.emit('register_user', stored));
    socket.on('receive_message', (msg) => setMessages((prev) => [...prev, { ...msg, incoming: true }]));
    socket.on('message_stored', (msg) => setMessages((prev) => [...prev, { ...msg, incoming: false }]));
    socket.on('user_list', (list) => setOnlineUsers(list || []));

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  const loadHistory = async () => {
    if (!recipient) return;
    const res = await fetch(`/api/messages?user1=${encodeURIComponent(username)}&user2=${encodeURIComponent(recipient)}`);
    const hist = await res.json();
    const formatted = hist.map((m) => ({
      sender: m.sender,
      receiver: m.receiver,
      text: m.text,
      timestamp: m.timestamp,
      incoming: m.sender !== username,
    }));
    setMessages(formatted);
  };

  const send = (e) => {
    e.preventDefault();
    if (!recipient || !text.trim()) return;
    socket.emit('send_message', { sender: username, receiver: recipient, text: text.trim() });
    setText('');
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        background: '#e5ddd5',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          backgroundColor: '#f0f2f5',
          borderRight: '1px solid #ccc',
          padding: 16,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            color: '#333',
            fontSize: 18,
            marginBottom: 12,
          }}
        >
          👤 {username}
        </div>
        <div
          style={{
            background: 'white',
            borderRadius: 8,
            padding: 10,
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            flexGrow: 1,
            overflowY: 'auto',
          }}
        >
          <h4 style={{ margin: '6px 0', fontSize: 15, color: '#555' }}>🟢 Online Users</h4>
          <ul style={{ listStyle: 'none', paddingLeft: 0, marginTop: 10 }}>
            {onlineUsers.length > 0 ? (
              onlineUsers.map((u) => (
                <li
                  key={u}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 6,
                    background: u === recipient ? '#d1e7ff' : 'transparent',
                    fontWeight: u === username ? 'bold' : 'normal',
                    cursor: 'pointer',
                    color: '#333',
                    transition: 'background 0.2s ease',
                  }}
                  onClick={() => {
                    setRecipient(u);
                    loadHistory();
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f8ff')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = u === recipient ? '#d1e7ff' : 'transparent')}
                >
                  {u}
                </li>
              ))
            ) : (
              <li style={{ color: '#777' }}>No users online</li>
            )}
          </ul>
        </div>
      </div>

      {/* Chat area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#efeae2',
          borderLeft: '1px solid #ccc',
        }}
      >
        {/* Chat header with Logout */}
<div
  style={{
    background: '#ededed',
    padding: '12px 16px',
    fontWeight: 'bold',
    borderBottom: '1px solid #ccc',
    color: '#333',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}
>
  <span>{recipient ? `Chatting with: ${recipient}` : 'Select a user to start chatting'}</span>

  <button
    onClick={() => {
      localStorage.removeItem('chat_username');
      if (socket) socket.disconnect();
      router.replace('/');
    }}
    style={{
      background: '#f44336',
      border: 'none',
      color: 'white',
      borderRadius: 6,
      padding: '6px 10px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: 13,
      transition: 'background 0.2s ease, transform 0.1s ease',
    }}
    onMouseEnter={(e) => (e.target.style.background = '#d32f2f')}
    onMouseLeave={(e) => (e.target.style.background = '#f44336')}
    onMouseDown={(e) => (e.target.style.transform = 'scale(0.95)')}
    onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
  >
    Logout
  </button>
</div>

        {/* Messages */}
        <div
          ref={messagesRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          background: 'linear-gradient(135deg, #f9f9f9 25%, transparent 25%), linear-gradient(225deg, #f9f9f9 25%, transparent 25%), linear-gradient(45deg, #f9f9f9 25%, transparent 25%), linear-gradient(315deg, #f9f9f9 25%, #e5ddd5 25%)',
backgroundSize: '40px 40px',
backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',

          }}
        >
          {messages.length > 0 ? (
            messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.incoming ? 'flex-start' : 'flex-end',
                  background: m.incoming ? '#fff' : '#dcf8c6',
                  borderRadius: 18,
                  padding: '8px 14px',
                  maxWidth: '70%',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <div style={{ fontSize: 13, color: '#555' }}>
                  <b>{m.incoming ? m.sender : 'You'}</b>{' '}
                  <span style={{ fontSize: 11, color: '#999' }}>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{ marginTop: 5, fontSize: 15, color: '#222' }}>{m.text}</div>
              </div>
            ))
          ) : (
            <div style={{ color: '#888', textAlign: 'center', marginTop: 20 }}>No messages yet</div>
          )}
        </div>

        {/* Message input */}
        <form
          onSubmit={send}
          style={{
            background: '#f0f0f0',
            padding: 12,
            display: 'flex',
            gap: 8,
            borderTop: '1px solid #ccc',
          }}
        >
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 20,
              border: '1px solid #ccc',
              outline: 'none',
              fontSize: 15,
              background: 'white',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#34b7f1')}
            onBlur={(e) => (e.target.style.borderColor = '#ccc')}
          />
          <button
            type="submit"
            style={{
              background: '#34b7f1',
              border: 'none',
              color: 'white',
              borderRadius: 20,
              padding: '10px 18px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'background 0.2s ease, transform 0.1s ease',
            }}
            onMouseEnter={(e) => (e.target.style.background = '#2196f3')}
            onMouseLeave={(e) => (e.target.style.background = '#34b7f1')}
            onMouseDown={(e) => (e.target.style.transform = 'scale(0.95)')}
            onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
          >
            ➤
          </button>
        </form>
      </div>
    </div>
  );
}


