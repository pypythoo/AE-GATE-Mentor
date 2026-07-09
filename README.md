# ✈️ AeroMentor — GATE Aerospace Engineering AI Mentor

> An AI-powered study companion for GATE Aerospace Engineering aspirants, built with **Python Flask** and **IBM watsonx.ai (Granite)**. Featuring a modern chat UI, personalized study dashboard, quiz generator, formula sheets, and performance analytics.

---

## 🚀 Features

| Feature | Description |
|---|---|
| **AI Chat** | Ask any GATE AE concept, formula, or numerical problem |
| **Study Planner** | AI-generated week-by-week personalized study plans |
| **Quiz Generator** | GATE-level MCQs with answers & explanations |
| **Formula Sheets** | Subject-wise formula reference with tips |
| **Performance Analytics** | Radar charts, study hours trend, score tracking |
| **Syllabus Explorer** | Full GATE AE syllabus with AI study links |
| **Streak Tracker** | Daily study streak and exam countdown |
| **Dark / Light Mode** | One-click theme toggle |
| **Responsive UI** | Works on mobile, tablet, and desktop |

---

## 🗂️ Project Structure

```
gate-aerospace-mentor/
├── app.py                  ← Flask backend + IBM watsonx.ai + AGENT_INSTRUCTIONS
├── templates/
│   └── index.html          ← Single-page frontend (Bootstrap 5)
├── static/
│   ├── css/style.css       ← Custom dark/light theme styles
│   └── js/app.js           ← Frontend logic (charts, API calls, state)
├── requirements.txt        ← Python dependencies
├── .env.example            ← Template for secrets (copy to .env)
└── README.md               ← This file
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites

- Python 3.10+
- An **IBM Cloud** account → [cloud.ibm.com](https://cloud.ibm.com)
- An **IBM watsonx.ai** project → [dataplatform.cloud.ibm.com](https://dataplatform.cloud.ibm.com)

### 2. Clone / Navigate to the project

```bash
cd gate-aerospace-mentor
```

### 3. Create a virtual environment

```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure secrets

```bash
cp .env.example .env
```

Edit `.env` and fill in your credentials:

```ini
IBM_API_KEY=your_ibm_cloud_api_key_here
WATSONX_PROJECT_ID=your_watsonx_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
FLASK_SECRET_KEY=any_random_string_here
```

#### 🔑 How to get your IBM credentials

**IBM API Key:**
1. Go to [IBM Cloud → IAM → API Keys](https://cloud.ibm.com/iam/apikeys)
2. Click **Create** → give it a name → copy the key

**watsonx Project ID:**
1. Go to [IBM watsonx.ai](https://dataplatform.cloud.ibm.com)
2. Open your project → **Manage** tab → **General** → copy the Project ID

**watsonx URL:**
- Dallas (default): `https://us-south.ml.cloud.ibm.com`
- Frankfurt: `https://eu-de.ml.cloud.ibm.com`
- London: `https://eu-gb.ml.cloud.ibm.com`
- Tokyo: `https://jp-tok.ml.cloud.ibm.com`

### 6. Run the application

```bash
python app.py
```

Open **http://localhost:5000** in your browser.

---

## 🎛️ Customizing the AI Mentor (`AGENT_INSTRUCTIONS`)

At the top of [`app.py`](app.py), you'll find the `AGENT_INSTRUCTIONS` block. Modify any field to change how the AI behaves:

```python
AGENT_INSTRUCTIONS = {
    "teaching_style": "...",    # How concepts are taught
    "tone":           "...",    # Friendly / strict / peer
    "difficulty":     "...",    # Beginner / GATE-level / Advanced
    "explanation_depth": "...", # Intuitive analogy → formal derivation
    "study_strategy": "...",    # Spaced repetition / Pomodoro / etc.
    "motivation":     "...",    # Motivational messages and reminders
    "safety_rules":   "...",    # Content guardrails
    "syllabus":       {...},    # GATE AE subjects and topics
}
```

No other changes are needed — the system prompt is built automatically from this dict.

---

## 🌐 API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/chat` | POST | Send a message to AeroMentor |
| `/api/study-plan` | POST | Generate a personalized study plan |
| `/api/quiz` | POST | Generate GATE-level MCQs |
| `/api/formula-sheet` | POST | Generate a subject formula sheet |
| `/api/explain` | POST | Explain a specific concept |
| `/api/syllabus` | GET | Get full GATE AE syllabus |
| `/api/subjects` | GET | Get list of subjects |
| `/api/health` | GET | Health check |

### Example: Chat Request

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Explain Prandtl lifting line theory", "history": [], "profile": {}}'
```

### Example: Quiz Request

```bash
curl -X POST http://localhost:5000/api/quiz \
  -H "Content-Type: application/json" \
  -d '{"subject": "Aerodynamics", "num_questions": 5, "difficulty": "GATE Level"}'
```

---

## 🚢 Deployment

### Option A — Gunicorn (Production)

```bash
pip install gunicorn
gunicorn app:app --bind 0.0.0.0:5000 --workers 2 --timeout 120
```

### Option B — IBM Code Engine / Cloud Foundry

```bash
# Install IBM Cloud CLI
ibmcloud login
ibmcloud target --cf
ibmcloud cf push aeromentor -m 256M
```

Create a `manifest.yml`:

```yaml
applications:
  - name: aeromentor
    memory: 256M
    buildpack: python_buildpack
    env:
      IBM_API_KEY: your_key
      WATSONX_PROJECT_ID: your_project_id
      WATSONX_URL: https://us-south.ml.cloud.ibm.com
```

### Option C — Docker

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000"]
```

```bash
docker build -t aeromentor .
docker run -p 5000:5000 --env-file .env aeromentor
```

---

## 🛣️ Roadmap / Future Features

- [ ] **Previous Year Question Analysis** — AI-parsed GATE PYQs
- [ ] **Mock Tests** — Full 3-hour timed GATE simulation
- [ ] **Voice Interaction** — Speech-to-text questions + TTS answers
- [ ] **PDF Export** — Download study plans, formula sheets, and notes
- [ ] **Interview Prep** — ISRO, DRDO, HAL, NAL interview Q&A
- [ ] **Weak Topic Detection** — Auto-identify weak areas from quiz history
- [ ] **Community Forum** — Peer study group integration
- [ ] **Offline Mode** — PWA with cached content

---

## 🔒 Security Notes

- Never commit `.env` to version control — it's in `.gitignore`
- The `IBM_API_KEY` is only used server-side (never exposed to frontend)
- All AI responses go through Flask; no direct client-to-IBM calls
- Use a strong, random `FLASK_SECRET_KEY` in production

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/mock-tests`
3. Commit changes: `git commit -m "Add mock test module"`
4. Push and open a PR

---

## 📄 License

MIT License — free for personal and academic use.

---

*Made with ❤️ for GATE AE aspirants | Powered by IBM watsonx.ai*
