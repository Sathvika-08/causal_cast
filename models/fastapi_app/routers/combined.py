import os
os.environ["TRANSFORMERS_NO_TF"] = "1"  # disable TensorFlow globally

from pathlib import Path
import sys
import torch
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

ROOT = Path(__file__).resolve().parents[3]  # Go up to project root
COMBINED = ROOT / "Combined"
if str(COMBINED) not in sys.path:
    sys.path.insert(0, str(COMBINED))

# Lazy import after environment variable
from models.finbert_model import FinBERTScorer
from models.dan3_model import DAN3Service
from models.lstm_model import LSTMVolService
from utils import config as cfg
from utils.yahoo_finance import yahoo_service

router = APIRouter(tags=["combined"])


# ----------------------------
# Request & Response Schemas
# ----------------------------
class PredictRequest(BaseModel):
    historical_vol_seq: List[float]
    news_texts: List[str]
    dan3_token_ids: List[List[int]]
    horizon: int | None = 1

class PredictResponse(BaseModel):
    daily_sentiment: List[dict]
    avg_sentiment_score: float
    dan3_probs_avg: List[float]
    volatility_pred_next: float

# ----------------------------
# Initialize models once (lazy)
# ----------------------------
try:
    _finbert = FinBERTScorer(model_name_or_path="ProsusAI/finbert", use_gpu=False)
    _dan3 = DAN3Service(weights_path=Path(cfg.DAN3_STATE_DICT), use_gpu=False)
    _lstm = LSTMVolService(
        weights_path=Path(cfg.LSTM_STATE_DICT),
        scaler_path=Path(cfg.LSTM_SCALER_PKL),
        use_gpu=False
    )
    MODELS_LOADED = True
    print("✅ All ML models loaded successfully")
except Exception as e:
    print(f"❌ Failed to load models: {e}")
    MODELS_LOADED = False
    _finbert = None
    _dan3 = None
    _lstm = None

# ----------------------------
# Unified predict endpoint
# ----------------------------
@router.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest):
    if not MODELS_LOADED:
        raise Exception("ML models failed to load. Please check server logs.")
    
    try:
        # --- FinBERT ---
        finbert_scores = _finbert.score(req.news_texts)
        sentiment_scalars = [s.get("positive", 0.0) - s.get("negative", 0.0) for s in finbert_scores]
        avg_sentiment = float(sum(sentiment_scalars) / len(sentiment_scalars)) if sentiment_scalars else 0.0

        # --- DAN3 ---
        dan3_tensor = torch.tensor(req.dan3_token_ids, dtype=torch.long)
        if dan3_tensor.ndim == 1:
            dan3_tensor = dan3_tensor.unsqueeze(0)
        dan3_probs = _dan3.predict(dan3_tensor).numpy().tolist()
        avg_probs = [float(sum(col) / len(dan3_probs)) for col in zip(*dan3_probs)] if dan3_probs else []

        # --- LSTM ---
        lstm_in = [[float(v), float(avg_sentiment)] for v in req.historical_vol_seq]
        vol_pred = float(_lstm.predict(lstm_in))

        return PredictResponse(
            daily_sentiment=finbert_scores,
            avg_sentiment_score=avg_sentiment,
            dan3_probs_avg=avg_probs,
            volatility_pred_next=vol_pred,
        )
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        raise Exception(f"Prediction failed: {str(e)}")

# ----------------------------
# Yahoo Finance endpoints
# ----------------------------
@router.get("/volatility/{ticker}")
def get_volatility_data(ticker: str, period: str = "1y", window: int = 30):
    """
    Fetch historical volatility data for a given ticker from Yahoo Finance.
    
    Args:
        ticker: Stock symbol (e.g., 'AAPL', 'TSLA')
        period: Data period ('1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max')
        window: Rolling window for volatility calculation (default 30 days)
    """
    try:
        result = yahoo_service.get_historical_volatility(
            ticker=ticker.upper(),
            period=period,
            window=window
        )
        
        if 'error' in result:
            raise HTTPException(status_code=400, detail=result['error'])
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch volatility data: {str(e)}")

@router.get("/stock-info/{ticker}")
def get_stock_info(ticker: str):
    """Get basic stock information for a given ticker."""
    try:
        result = yahoo_service.get_stock_info(ticker.upper())
        
        if 'error' in result:
            raise HTTPException(status_code=400, detail=result['error'])
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch stock info: {str(e)}")

@router.get("/validate-ticker/{ticker}")
def validate_ticker(ticker: str):
    """Validate if a ticker symbol exists and has data."""
    try:
        is_valid = yahoo_service.validate_ticker(ticker.upper())
        return {"ticker": ticker.upper(), "valid": is_valid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to validate ticker: {str(e)}")
