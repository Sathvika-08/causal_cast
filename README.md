## CausalCast MVP

An AI-powered financial forecasting MVP combining volatility prediction (LSTM), news sentiment (FinBERT), and DAN-3 sentiment classification, with a simple web UI and backend.

### Monorepo Structure
- `frontend/` Next.js + Tailwind dashboard
- `backend/` Express.js + MongoDB API and auth
- `models/fastapi_app/` FastAPI service wrapping existing Python models in `Combined/`
- `Combined/` Provided models, weights, and utilities

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB Atlas connection string

### Quickstart
1) Start FastAPI (uses the provided `Combined/` models)
```bash
cd models/fastapi_app
python -m venv .venv && .venv/Scripts/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

2) Start Express backend
```bash
cd backend
npm install
npm start
```

3) Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

### Environment Variables
Create `.env` files based on the provided examples in `backend/.env.example` and `frontend/.env.local.example`.

### Notes
- This repo uses the Python code in `Combined/` as-is; the FastAPI service imports from that directory.
- For demo machines without GPU, inference uses CPU by default.


