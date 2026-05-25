# 🎀 BreastGuard — Breast Cancer Detection System

Bilingual (Arabic/English) breast cancer risk awareness web application.

## Project Structure
```
breast-cancer-detection/
├── backend/                  # Python Flask API
│   ├── app.py                # Main Flask app
│   ├── requirements.txt      # Python dependencies
│   ├── models/
│   │   └── risk_model.py     # Risk scoring algorithm
│   └── routes/
│       ├── assessment.py     # Questionnaire API
│       ├── lab.py            # Blood marker analysis API
│       └── info.py           # Educational content API
└── frontend/                 # React Application
    ├── package.json
    ├── public/index.html
    └── src/
        ├── App.jsx            # Main router
        ├── index.js
        ├── index.css          # Global styles + themes
        ├── context/
        │   └── AppContext.jsx # Lang + Theme context
        ├── components/
        │   ├── Navbar.jsx/.css
        │   └── Results.jsx/.css
        └── pages/
            ├── Home.jsx/.css
            ├── Assessment.jsx/.css
            ├── About.jsx/.css
            ├── SelfExam.jsx/.css
            └── LabResults.jsx/.css
```

## How to Run

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

## Features
- 🌐 Bilingual Arabic / English (full RTL support)
- 🌙 Light & Dark mode
- 📋 23-question risk assessment questionnaire
- 🔬 Blood tumor marker analysis (CA 15-3, CEA, CBC)
- 🤖 Combined ML + rule-based risk scoring
- 🖐️ Interactive 5-step self-exam guide
- 📚 Educational content on symptoms & risk factors
- 📱 Fully responsive design

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/health | GET | Health check |
| /api/assessment/evaluate | POST | Risk questionnaire scoring |
| /api/lab/analyze | POST | Lab marker analysis |
| /api/info/self-exam | GET | Self-exam guide |
| /api/info/about | GET | General info |

## ⚕️ Disclaimer
This system is for educational awareness only and does NOT constitute medical diagnosis.
