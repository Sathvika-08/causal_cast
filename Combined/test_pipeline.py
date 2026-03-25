import torch
from pathlib import Path
from models.finbert_model import FinBERTScorer
from models.dan3_model import DAN3Service
from models.lstm_model import LSTMVolService
from pipeline.preprocessing import scale_features
from utils.config import WEIGHTS_DIR

# -----------------------------
# 1. Load Models
# -----------------------------
print("Loading models...")

# FinBERT sentiment scorer
finbert = FinBERTScorer(model_name_or_path="ProsusAI/finbert", use_gpu=False)

# DAN-3 sentiment classifier
dan3_weights = Path(WEIGHTS_DIR) / "dan3" / "model_weights.pt"
dan3_service = DAN3Service(weights_path=dan3_weights, use_gpu=False)

# LSTM volatility predictor
lstm_weights = Path(WEIGHTS_DIR) / "lstm" / "final_lstm_volatility.pth"
scaler_path = Path(WEIGHTS_DIR) / "lstm" / "scaler_final.pkl"
lstm_model = LSTMVolService(weights_path=lstm_weights, scaler_path=scaler_path, use_gpu=False)


# -----------------------------
# 2. Example Input Data
# -----------------------------
ticker = "^GSPC"
historical_vol_seq = [0.12, 0.10, 0.11, 0.13, 0.09, 0.08, 0.10]  # Example vol series
news_texts_for_day = [
    "Microsoft beats earnings expectations",
    "US CPI mixed, markets uncertain",
    "Oil prices rise amid supply concerns"
]
dan3_token_ids_for_day = [[12, 55, 181, 7, 99, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]

# -----------------------------
# 3. Step 1 – FinBERT Sentiment Scoring
# -----------------------------
finbert_outputs = finbert.score(news_texts_for_day)
print("\n[FinBERT Sentiment Scores]:")
for i, out in enumerate(finbert_outputs):
    print(f" News {i+1}: {out}")

# Average FinBERT sentiment (positive - negative)
avg_sentiment_score = sum([(o["positive"] - o["negative"]) for o in finbert_outputs]) / len(finbert_outputs)
print("\nAverage Sentiment Score:", avg_sentiment_score)

# -----------------------------
# 4. Step 2 – DAN-3 Sentiment Classification
# -----------------------------
token_tensor = torch.tensor(dan3_token_ids_for_day, dtype=torch.long)
dan3_probs = dan3_service.predict(token_tensor)
dan3_probs_dict = {
    "negative": float(dan3_probs[0][0]),
    "neutral": float(dan3_probs[0][1]),
    "positive": float(dan3_probs[0][2])
}
print("\n[DAN-3 Sentiment Probabilities]:", dan3_probs_dict)

# -----------------------------
# 5. Step 3 – LSTM Volatility Prediction
# -----------------------------
features_scaled = scale_features(historical_vol_seq, avg_sentiment_score, scaler_path)
volatility_pred = lstm_model.predict(features_scaled)

print("\n[LSTM Volatility Prediction]:", float(volatility_pred))

# -----------------------------
# 6. Combined Output
# -----------------------------
print("\n========== Final Combined Output ==========")
print({
    "ticker": ticker,
    "daily_sentiment_score": avg_sentiment_score,
    "dan3_probs_avg": dan3_probs_dict,
    "volatility_pred_next": float(volatility_pred),
    "debug": {
        "T": len(historical_vol_seq),
        "last_input_row": features_scaled[-1].tolist()
    }
})
