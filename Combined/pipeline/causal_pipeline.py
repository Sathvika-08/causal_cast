from pathlib import Path

import numpy as np
from models.finbert_model import FinBERTScorer
from models.dan3_model import DAN3Service
from models.lstm_model import LSTMVolService

class CausalPipeline:
    def __init__(self, use_gpu: bool = True):
        finbert_path = Path("weights/finbert")
        dan3_path = Path("weights/dan3/model_weights.pt")  # ✅ adjust filename
        lstm_path = Path("weights/lstm/final_lstm_volatility.pth")  # ✅ adjust filename

        self.finbert = FinBERTScorer(model_name_or_path="ProsusAI/finbert", use_gpu=use_gpu)
        self.dan3 = DAN3Service(weights_path=str(dan3_path), use_gpu=use_gpu)
        self.lstm = LSTMVolService(weights_path=str(lstm_path), use_gpu=use_gpu)  # ✅ fixed


    def run(self, historical_vol_seq, news_texts, dan3_token_ids, horizon: int = 1):
        finbert_out = self.finbert.predict(news_texts)
        sentiment_scores = finbert_out["sentiment_score"]
        avg_sentiment = float(np.mean(sentiment_scores)) if sentiment_scores else 0.0

        dan3_out = self.dan3.predict(dan3_token_ids)
        avg_dan3_probs = np.mean(dan3_out, axis=0).tolist() if len(dan3_out) > 0 else []

        lstm_in = [[v, avg_sentiment] for v in historical_vol_seq]
        lstm_out = self.lstm.predict(lstm_in, horizon=horizon)

        return {
            "daily_sentiment_score": sentiment_scores,
            "avg_sentiment_score": avg_sentiment,
            "dan3_probs_avg": avg_dan3_probs,
            "volatility_pred_next": lstm_out,
        }
