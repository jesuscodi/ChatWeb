let username = "";
let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

// Mostrar modal para pedir nombre
window.addEventListener("load", () => {
    const modal = new bootstrap.Modal(document.getElementById('usernameModal'), {
        backdrop: 'static',
        keyboard: false
    });
    modal.show();

    document.getElementById("saveUsername").addEventListener("click", () => {
        const name = document.getElementById("usernameInput").value.trim();
        if (name) {
            username = name;
            modal.hide();
            renderChat();
        }
    });
});

// Renderizar historial
function renderChat() {
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = "";
    chatHistory.forEach(msg => {
        const div = document.createElement("div");
        div.classList.add("message", msg.user === username ? "user" : "other");
        div.innerHTML = `<strong>${msg.user}:</strong> ${msg.text}`;
        chatBox.appendChild(div);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Enviar mensaje
document.getElementById("sendMessage").addEventListener("click", () => {
    const messageInput = document.getElementById("messageInput");
    const text = messageInput.value.trim();
    if (text) {
        chatHistory.push({ user: username, text });
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
        messageInput.value = "";
        renderChat();
    }
});

// Descargar historial como .txt
document.getElementById("downloadChat").addEventListener("click", () => {
    let content = chatHistory.map(m => `${m.user}: ${m.text}`).join("\n");
    let blob = new Blob([content], { type: "text/plain" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "chat_historial.txt";
    a.click();
});
