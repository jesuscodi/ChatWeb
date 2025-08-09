// Firebase desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// 🔹 CONFIGURACIÓN FIREBASE (pon tus datos aquí)
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "chatweb-7d65a.firebaseapp.com",
    databaseURL: "https://chatweb-7d65a-default-rtdb.firebaseio.com",
    projectId: "chatweb-7d65a",
    storageBucket: "chatweb-7d65a.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let username = "";

// DOM
const loginSection = document.getElementById("login-section");
const chatSection = document.getElementById("chat-section");
const chatBox = document.getElementById("chat-box");
const startChatBtn = document.getElementById("start-chat");
const sendBtn = document.getElementById("send");
const messageInput = document.getElementById("message");
const emojiBtn = document.getElementById("emoji-btn");
const emojiPicker = document.getElementById("emoji-picker");

// Iniciar chat
startChatBtn.addEventListener("click", () => {
    const nameInput = document.getElementById("username");
    if (nameInput.value.trim() !== "") {
        username = nameInput.value.trim();
        loginSection.style.display = "none";
        chatSection.style.display = "block";
        escucharMensajes();
    }
});

// Enviar mensaje
sendBtn.addEventListener("click", enviarMensaje);
messageInput.addEventListener("keypress", e => {
    if (e.key === "Enter") enviarMensaje();
});

function enviarMensaje() {
    const mensaje = messageInput.value.trim();
    if (mensaje !== "") {
        const mensajesRef = ref(db, "mensajes");
        push(mensajesRef, {
            usuario: username,
            texto: mensaje,
            fecha: new Date().toLocaleString()
        });
        messageInput.value = "";
    }
}

// Escuchar mensajes
function escucharMensajes() {
    const mensajesRef = ref(db, "mensajes");
    onValue(mensajesRef, (snapshot) => {
        const data = snapshot.val();
        chatBox.innerHTML = "";
        for (let id in data) {
            const msg = data[id];
            const clase = msg.usuario === username ? "msg msg-user" : "msg msg-other";
            chatBox.innerHTML += `<div class="${clase}"><strong>${msg.usuario}:</strong> ${msg.texto}</div>`;
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    });
}

// Mostrar/Ocultar emoji picker
emojiBtn.addEventListener("click", () => {
    emojiPicker.style.display = emojiPicker.style.display === "none" ? "block" : "none";
});

// Insertar emoji en input
emojiPicker.addEventListener("emoji-click", event => {
    messageInput.value += event.detail.unicode;
});
