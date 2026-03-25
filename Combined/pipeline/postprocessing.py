# pipeline/postprocessing.py
from __future__ import annotations
from typing import Dict, Any, Optional, Tuple
import json
import os
import numpy as np

from utils.metrics import expected_calibration_error
from utils.config import DAN3_WEIGHTS_DIR
from utils.file_io import load_json


def apply_temperature_scaling(
    probs: np.ndarray,
    temperature: Optional[float]
) -> np.ndarray:
    """
    Applies temperature scaling on logits approximated from probs.
    We convert probs -> logits (safe log), scale, then softmax back.
    If temperature is None or ~1.0, returns original probs.
    """
    if temperature is None or abs(temperature - 1.0) < 1e-6:
        return probs

    # Convert probs to logits safely
    eps = 1e-12
    p = np.clip(probs, eps, 1 - eps)
    logits = np.log(p)

    # Scale and softmax
    logits_scaled = logits / float(temperature)
    logits_scaled -= logits_scaled.max(axis=-1, keepdims=True)
    exp = np.exp(logits_scaled)
    return exp / exp.sum(axis=-1, keepdims=True)


def format_results(
    finbert_out: Dict[str, Any],
    dan3_probs_avg: Dict[str, float],
    volatility_pred_next: float,
    debug: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Final response contract for /predict and for UI consumption.
    """
    return {
        "daily_sentiment_score": float(finbert_out["sentiment_score"]),
        "dan3_probs_avg": {
            "negative": float(dan3_probs_avg["negative"]),
            "neutral":  float(dan3_probs_avg["neutral"]),
            "positive": float(dan3_probs_avg["positive"]),
        },
        "volatility_pred_next": float(volatility_pred_next),
        "debug": debug or {}
    }


def maybe_calibrate_dan3(
    avg_probs: Dict[str, float],
    temperature_json_path: str = os.path.join(DAN3_WEIGHTS_DIR, "temperature.json"),
) -> Dict[str, float]:
    """
    Optionally calibrate DAN-3 probabilities using a single temperature.
    If temperature.json does not exist, returns avg_probs unchanged.
    """
    try:
        temp_obj = load_json(temperature_json_path)
        temperature = float(temp_obj.get("temperature", 1.0))
    except Exception:
        temperature = 1.0

    arr = np.array([[avg_probs["negative"], avg_probs["neutral"], avg_probs["positive"]]])
    arr_cal = apply_temperature_scaling(arr, temperature=temperature)
    neg, neu, pos = arr_cal[0].tolist()
    return {"negative": neg, "neutral": neu, "positive": pos}


def compute_ece_for_probs(
    probs: Dict[str, float],
    true_label_index: Optional[int] = None,
    n_bins: int = 10
) -> float:
    """
    Compute ECE given class probabilities and (optionally) a true label.
    If true_label_index is None, we approximate confidence vs. correctness by
    assuming the argmax is "predicted"; this is mainly for diagnostics in demo.
    """
    p = np.array([[probs["negative"], probs["neutral"], probs["positive"]]])
    y_pred = p.argmax(axis=1)
    if true_label_index is None:
        # In demo mode we can't measure correctness — treat as 1.0 for the argmax
        y_true = y_pred.copy()
    else:
        y_true = np.array([true_label_index])

    conf = p.max(axis=1)
    correct = (y_pred == y_true).astype(np.float32)
    return float(expected_calibration_error(conf, correct, n_bins=n_bins))
