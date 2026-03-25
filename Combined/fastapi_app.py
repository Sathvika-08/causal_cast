from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pipeline.causal_pipeline import CausalPipeline
from utils.yahoo_finance import yahoo_service

app = FastAPI()
pipeline = CausalPipeline(use_gpu=False)

class PredictRequest(BaseModel):
    ticker: str
    historical_vol_seq: list
    news_texts_for_day: list
    dan3_token_ids_for_day: list
    horizon: int = 1

@app.post("/predict")
def predict(req: PredictRequest):
    result = pipeline.run(
        historical_vol_seq=req.historical_vol_seq,
        news_texts=req.news_texts_for_day,
        dan3_token_ids=req.dan3_token_ids_for_day,
        horizon=req.horizon
    )
    return result

@app.get("/volatility/{ticker}")
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

@app.get("/stock-info/{ticker}")
def get_stock_info(ticker: str):
    """Get basic stock information for a given ticker."""
    try:
        result = yahoo_service.get_stock_info(ticker.upper())
        
        if 'error' in result:
            raise HTTPException(status_code=400, detail=result['error'])
            
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch stock info: {str(e)}")

@app.get("/validate-ticker/{ticker}")
def validate_ticker(ticker: str):
    """Validate if a ticker symbol exists and has data."""
    try:
        is_valid = yahoo_service.validate_ticker(ticker.upper())
        return {"ticker": ticker.upper(), "valid": is_valid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to validate ticker: {str(e)}")
