// pages/register.js
import { useState } from "react";
import { useRouter } from "next/router";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const registerUser = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setMsg("⚠️ Please fill all fields!");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      alert("✅ Registration successful!");
      router.push("/");
    } else {
      setMsg(data.message || "❌ Registration failed");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
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
            color: "#2e7d32",
            fontSize: 26,
            fontWeight: "700",
            letterSpacing: 0.5,
          }}
        >
          🧑‍💻 Register Account
        </h1>

        <form onSubmit={registerUser}>
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
              placeholder="Enter a username"
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
              onFocus={(e) => (e.target.style.border = "1px solid #43a047")}
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
              placeholder="Enter a password"
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
              onFocus={(e) => (e.target.style.border = "1px solid #43a047")}
              onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px 0",
              background: "#43a047",
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
              (e.target.style.background = "#2e7d32")
            }
            onMouseLeave={(e) =>
              (e.target.style.background = "#43a047")
            }
          >
            Register
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
          Already have an account?{" "}
          <a
            href="/"
            style={{
              color: "#2e7d32",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}
