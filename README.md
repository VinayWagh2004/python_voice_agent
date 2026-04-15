# Python Voice Agent (from scratch)

## 1. Setup
```bash
cd C:\xampp\htdocs\Alumni-Portal-main\python_voice_agent
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

## 2. Run
```bash
python app.py
```

Open: `http://127.0.0.1:5000`

## Features
- Flask backend (`/api/chat`) for response generation
- Web UI chat interface
- Browser speech-to-text (voice input)
- Browser text-to-speech (voice output)
