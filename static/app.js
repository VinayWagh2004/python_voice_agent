const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const listenBtn = document.getElementById("listenBtn");
const stopSpeechBtn = document.getElementById("stopSpeechBtn");
const statusDot = document.getElementById("statusDot");
const statusText = document.getElementById("statusText");
const supportNote = document.getElementById("supportNote");

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let listening = false;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListeningState(true);
    recognition.onend = () => setListeningState(false);
    recognition.onerror = () => setListeningState(false);
    recognition.onresult = (event) => {
        const spokenText = event.results[0][0].transcript.trim();
        if (spokenText) {
            messageInput.value = spokenText;
            sendMessage(spokenText);
        }
    };
} else {
    listenBtn.disabled = true;
    supportNote.classList.remove("hidden");
}

function setListeningState(state) {
    listening = state;
    statusText.textContent = state ? "Listening..." : "Idle";
    statusDot.classList.toggle("listening", state);
    listenBtn.textContent = state ? "Stop Listening" : "Start Listening";
    listenBtn.classList.toggle("btn-danger", !state);
    listenBtn.classList.toggle("btn-warning", state);
}

function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function appendMessage(role, text) {
    const item = document.createElement("article");
    item.className = `message ${role}`;
    item.innerHTML = `<strong>${role === "user" ? "You" : "Agent"}:</strong> ${escapeHtml(text)}`;
    chatBox.appendChild(item);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function speak(text) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
}

async function sendMessage(rawText) {
    const text = (rawText || messageInput.value).trim();
    if (!text) {
        return;
    }

    appendMessage("user", text);
    messageInput.value = "";

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });
        const data = await response.json();

        if (!response.ok) {
            appendMessage("bot", data.error || "Something went wrong.");
            return;
        }

        appendMessage("bot", data.reply);
        speak(data.reply);
    } catch {
        appendMessage("bot", "Unable to reach the server. Make sure the Flask app is running.");
    }
}

sendBtn.addEventListener("click", () => sendMessage());

messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

listenBtn.addEventListener("click", () => {
    if (!recognition) {
        return;
    }
    if (listening) {
        recognition.stop();
    } else {
        recognition.start();
    }
});

stopSpeechBtn.addEventListener("click", () => {
    window.speechSynthesis.cancel();
});
