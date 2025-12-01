const socket = io();

let currentUser = null;
let myPrivateKey = null;
let currentChatUser = null;
let authMode = 'login'; 

const publicKeyCache = {}; 

// -----------------------------------------------------------
// 1. AUTHENTICATION & UI
// -----------------------------------------------------------

function toggleMode() {
    authMode = authMode === 'login' ? 'register' : 'login';
    const title = document.getElementById("authTitle");
    const mainBtn = document.getElementById("mainAuthBtn");
    const toggleBtn = document.getElementById("toggleAuthBtn");
    const keyGenSection = document.getElementById("keyGenSection");
    const loginKey = document.getElementById("loginKeySection");
    const regKey = document.getElementById("registerKeySection");

    loginKey.style.border = "none"; 
    loginKey.style.padding = "0"; 
    loginKey.style.marginTop = "0";

    if (authMode === 'login') {
        title.innerText = "Login"; 
        mainBtn.innerText = "Login"; 
        toggleBtn.innerText = "Switch to Register";
        keyGenSection.classList.add("hidden"); 
        loginKey.classList.remove("hidden");
        loginKey.querySelector(".helper-text").innerHTML = "Enter your <b>Private Key</b> to decrypt messages:";
        regKey.classList.add("hidden");
    } else {
        title.innerText = "Register"; 
        mainBtn.innerText = "Register"; 
        toggleBtn.innerText = "Switch to Login";
        keyGenSection.classList.remove("hidden"); 
        loginKey.classList.add("hidden");
        regKey.classList.remove("hidden");
        
        // Clear inputs
        document.getElementById("username").value = ""; 
        document.getElementById("password").value = "";
        document.getElementById("publicKeyInput").value = ""; 
        document.getElementById("privateKeyInput").value = "";
    }
}

async function generateKeysForUI() {
    const pair = await CryptoLib.KEM.generateKeypair();
    document.getElementById("publicKeyInput").value = pair.pk;
    document.getElementById("privateKeyInput").value = pair.sk;
    
    // FORCE PRIVATE KEY DISPLAY
    const loginKeySection = document.getElementById("loginKeySection");
    loginKeySection.classList.remove("hidden");
    loginKeySection.querySelector(".helper-text").innerHTML = "⚠️ <b style='color:#ef5350;'>COPY THIS PRIVATE KEY NOW!</b>";
    loginKeySection.style.border = "2px dashed #ef5350"; 
    loginKeySection.style.padding = "10px"; 
    loginKeySection.style.borderRadius = "8px"; 
    loginKeySection.style.marginTop = "10px";
    
    alert("KEYS GENERATED! Copy the Private Key from the Red Box.");
}

async function handleAuth() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    if (!username || !password) return alert("Enter username/password");

    if (authMode === 'register') {
        const publicKey = document.getElementById("publicKeyInput").value.trim();
        if (!publicKey) return alert("Generate Keys first!");
        
        const res = await fetch("/api/register", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, publicKey })
        });
        const data = await res.json();
        if (!data.ok) return alert(data.error);
        
        alert("Registered! Now Login."); 
        toggleMode();
    } else {
        const privateKey = document.getElementById("privateKeyInput").value.trim();
        if (!privateKey) return alert("Private Key required!");
        
        const res = await fetch("/api/login", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (!data.ok) return alert(data.error);

        currentUser = username; 
        myPrivateKey = privateKey;
        
        document.getElementById("authScreen").classList.add("hidden");
        document.getElementById("chatScreen").classList.remove("hidden");
        document.getElementById("currentUserDisplay").innerText = username;
        
        socket.emit("register_online", username);
    }
}

function logout() { location.reload(); }

// -----------------------------------------------------------
// 2. MESSAGING (DUAL ENCRYPTION LOGIC)
// -----------------------------------------------------------

async function getPublicKey(user) {
    if (publicKeyCache[user]) return publicKeyCache[user];
    const res = await fetch(`/api/get_key/${user}`);
    const data = await res.json();
    if (!data.ok) throw new Error("Key not found");
    publicKeyCache[user] = data.publicKey;
    return data.publicKey;
}

async function sendMessage() {
    const text = document.getElementById("msgInput").value.trim();
    if (!text || !currentChatUser) return;

    // Show locally immediately
    appendMessage(text, 'sent');
    document.getElementById("msgInput").value = "";

    try {
        // 1. Encrypt for RECEIVER (Bob) - using Bob's PK
        const receiverPk = await getPublicKey(currentChatUser);
        const kemReceiver = await CryptoLib.KEM.encapsulate(receiverPk);
        const aesKeyReceiver = await CryptoLib.AES.importKey(kemReceiver.sharedSecret);
        const encReceiver = await CryptoLib.AES.encrypt(aesKeyReceiver, text);

        // 2. Encrypt for SENDER (Me) - using MY PK - So I can read it later!
        const myPk = await getPublicKey(currentUser);
        const kemSender = await CryptoLib.KEM.encapsulate(myPk);
        const aesKeySender = await CryptoLib.AES.importKey(kemSender.sharedSecret);
        const encSender = await CryptoLib.AES.encrypt(aesKeySender, text);

        // 3. Send BOTH copies to server
        socket.emit("send_message", {
            sender: currentUser,
            receiver: currentChatUser,
            
            // Receiver's Copy
            aesCiphertext: encReceiver.aesCiphertext,
            iv: encReceiver.iv,
            kemCiphertext: kemReceiver.kemCiphertext,

            // Sender's Copy (New!)
            senderAesCiphertext: encSender.aesCiphertext,
            senderIv: encSender.iv,
            senderKemCiphertext: kemSender.kemCiphertext
        });

    } catch (e) {
        console.error("Encryption failed:", e);
        alert("Encryption Failed");
    }
}

// -----------------------------------------------------------
// 3. RECEIVING & HISTORY DECRYPTION
// -----------------------------------------------------------

socket.on("receive_message", async (data) => {
    if (data.sender !== currentUser) {
        if (data.sender === currentChatUser) {
            const plaintext = await decryptPayload(data);
            appendMessage(plaintext, 'received');
        } else {
            const el = document.getElementById(`user-${data.sender}`);
            if(el) el.style.fontWeight = "bold";
        }
    }
});

async function decryptPayload(msgData) {
    try {
        const sharedSecretBuf = await CryptoLib.KEM.decapsulate(myPrivateKey, msgData.kemCiphertext);
        const aesKey = await CryptoLib.AES.importKey(sharedSecretBuf);
        return await CryptoLib.AES.decrypt(aesKey, msgData.aesCiphertext, msgData.iv);
    } catch (e) {
        // console.error(e); // Silent fail for cleaner UI
        return "⚠️ [Decryption Failed]";
    }
}

async function selectUser(u, el) {
    currentChatUser = u;
    document.querySelectorAll(".user-item").forEach(d => d.classList.remove("active"));
    if (el) el.classList.add("active"); 
    if (el) el.style.fontWeight = "normal";
    
    document.getElementById("chatHeader").innerText = `Chat with ${u}`;
    const box = document.getElementById("messageBox");
    box.innerHTML = "Loading...";

    const res = await fetch(`/api/messages?user1=${currentUser}&user2=${u}`);
    const msgs = await res.json();
    box.innerHTML = "";

    for (const m of msgs) {
        let text = "";
        
        if (m.sender === currentUser) {
            // SENDER LOGIC: Decrypt using the "Sender Copy"
            if (m.senderKemCiphertext) {
                // Construct a temporary object using Sender fields
                const selfMsgData = {
                    kemCiphertext: m.senderKemCiphertext,
                    aesCiphertext: m.senderAesCiphertext,
                    iv: m.senderIv
                };
                text = await decryptPayload(selfMsgData);
            } else {
                text = "[Encrypted Content] (Old message)";
            }
        } else {
            // RECEIVER LOGIC: Use standard fields
            text = await decryptPayload(m);
        }
        
        const type = m.sender === currentUser ? 'sent' : 'received';
        appendMessage(text, type);
    }
}

socket.on("online_users", (users) => {
    const list = document.getElementById("userList");
    list.innerHTML = "";
    users.forEach(u => {
        if (u !== currentUser) {
            const div = document.createElement("div");
            div.id = `user-${u}`; 
            div.className = "user-item";
            div.innerHTML = `<div class="status-dot"></div> ${u}`;
            div.onclick = () => selectUser(u, div);
            list.appendChild(div);
        }
    });
});

function appendMessage(text, type) {
    const box = document.getElementById("messageBox");
    const div = document.createElement("div");
    div.className = `msg ${type}`; 
    div.innerText = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}
