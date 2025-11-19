// pages/index.js
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const loginUser = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setMsg("⚠️ Please fill all fields!");
      return;
    }

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("chat_username", username);
      router.push("/chat");
    } else {
      setMsg(data.message || "❌ Invalid credentials");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #6dd5fa 0%, #2980b9 100%)",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "40px 36px",
          width: 380,
          boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            marginBottom: 24,
            color: "#1976d2",
            fontSize: 26,
            fontWeight: "700",
            letterSpacing: 0.5,
          }}
        >
          💬 Chat Login
        </h1>

        <form onSubmit={loginUser}>
          <div style={{ textAlign: "left", marginBottom: 14 }}>
            <label
              style={{
                fontWeight: 600,
                fontSize: 14,
                color: "#333",
              }}
            >
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              style={{
                width: "100%",
                padding: 12,
                marginTop: 6,
                border: "1px solid #ccc",
                borderRadius: 8,
                outline: "none",
                fontSize: 15,
                transition: "0.2s",
              }}
              onFocus={(e) => (e.target.style.border = "1px solid #1976d2")}
              onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
            />
          </div>

          <div style={{ textAlign: "left", marginBottom: 18 }}>
            <label
              style={{
                fontWeight: 600,
                fontSize: 14,
                color: "#333",
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: 12,
                marginTop: 6,
                border: "1px solid #ccc",
                borderRadius: 8,
                outline: "none",
                fontSize: 15,
                transition: "0.2s",
              }}
              onFocus={(e) => (e.target.style.border = "1px solid #1976d2")}
              onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px 0",
              background: "#1976d2",
              color: "white",
              border: "none",
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: 0.5,
              transition: "0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.target.style.background = "#0d47a1")
            }
            onMouseLeave={(e) =>
              (e.target.style.background = "#1976d2")
            }
          >
            Login
          </button>

          {msg && (
            <p
              style={{
                color: "red",
                marginTop: 10,
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              {msg}
            </p>
          )}
        </form>

        <p style={{ marginTop: 18, fontSize: 14, color: "#444" }}>
          New user?{" "}
          <a
            href="/register"
            style={{
              color: "#1976d2",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}

