from datetime import datetime
from flask import Flask, jsonify, render_template, request


app = Flask(__name__)


def generate_reply(user_text: str) -> str:
    text = user_text.lower().strip()
    if any(greet in text for greet in ("hello", "hi", "hey")):
        return "Hello! I am your Python voice agent. How can I help you today?"
    if "time" in text:
        return f"The current time is {datetime.now().strftime('%I:%M:%S %p')}."
    if "date" in text:
        return f"Today's date is {datetime.now().strftime('%Y-%m-%d')}."
    if "weather" in text:
        return "I do not have live weather data yet, but I can help you plan your day if you tell me your city."
    if "study" in text or "exam" in text:
        return "Try a 25-minute focus session, then a 5-minute break. Repeat this four times and do a short review."
    return f'I heard: "{user_text}". Ask me about time, date, weather, or study tips.'


@app.get("/")
def home():
    return render_template("index.html")


@app.post("/api/chat")
def chat():
    payload = request.get_json(silent=True) or {}
    message = str(payload.get("message", "")).strip()
    if not message:
        return jsonify({"error": "Message is required."}), 400

    reply = generate_reply(message)
    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
