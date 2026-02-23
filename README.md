# PathFinder+

**PathFinder+** is an AI-powered career and course recommendation platform built for Sri Lankan professionals. It combines a Next.js frontend, a FastAPI backend, and a machine-learning recommendation engine to deliver personalised job and course guidance.

---

## Repository structure

```
SDGP-CS-116/
├── backend/                        # FastAPI REST API
│   └── app/main.py
├── frontend/                       # Main Next.js web app (PathFinder+)
│   └── pathfinder_frontend/
├── Landing Page/                   # Standalone Next.js marketing site
└── Machine Learning and Data Cleaning/   # ML recommendation engine & data pipeline
    ├── core/
    │   └── recommendation_engine.py
    ├── processed/                  # Pre-processed CSV datasets
    ├── scripts/                    # Data-pipeline scripts
    └── utils/
```

---

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18 or later |
| Python | 3.10 or later |
| npm | 9 or later |

---

## Getting started

### 1. Clone and enter the project

```bash
git clone https://github.com/Rumblingengine4815/SDGP-CS-116.git
cd SDGP-CS-116
```

### 2. Fetch all remote branches

```bash
git fetch --all
```

---

## Running each component

### Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.  
Interactive docs: `http://localhost:8000/docs`

### Frontend — main app

```bash
cd frontend/pathfinder_frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### Landing page

```bash
cd "Landing Page"   # note: directory name includes a space
npm install
npm run dev
```

Open `http://localhost:3000` in your browser (use a different port if the main app is already running: `npm run dev -- -p 3001`).

---

## Environment variables

Copy `.env.example` (if provided) or create a `.env` file in `backend/` with your credentials:

```env
MONGODB_URI=your_mongodb_connection_string
```

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/status` | ML engine load status |
| POST | `/api/recommend` | Get job & course recommendations |

**Example request body for `/api/recommend`:**

```json
{
  "target_role": "Software Engineer",
  "skills": ["python", "sql"],
  "interests": ["backend", "web development"],
  "top_n": 5
}
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to your branch: `git push origin feature/your-feature`
5. Open a pull request
