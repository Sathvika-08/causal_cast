# utils/plotting.py
from __future__ import annotations
import io
from typing import List, Dict, Optional

import matplotlib.pyplot as plt


def plot_volatility_history_and_forecast(
    history: List[float],
    forecast_value: float,
    horizon: int = 1,
    title: str = "Volatility (history + forecast)"
) -> bytes:
    """
    Returns a PNG (bytes) with a simple line chart of history + next-step forecast.
    """
    x_hist = list(range(len(history)))
    x_fore = [len(history) + horizon - 1]  # single next point by default

    plt.figure()
    plt.plot(x_hist, history, label="history")
    plt.scatter(x_fore, [forecast_value], label="forecast")
    plt.title(title)
    plt.xlabel("t")
    plt.ylabel("volatility")

    plt.legend()
    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight")
    plt.close()
    buf.seek(0)
    return buf.read()


def plot_sentiment_bars(
    probs: Dict[str, float],
    title: str = "Sentiment (DAN-3)"
) -> bytes:
    """
    Returns a PNG (bytes) of class probability bars for negative/neutral/positive.
    """
    labels = ["negative", "neutral", "positive"]
    values = [probs.get("negative", 0.0), probs.get("neutral", 0.0), probs.get("positive", 0.0)]

    plt.figure()
    plt.bar(labels, values)
    plt.ylim(0, 1)
    plt.title(title)
    plt.ylabel("probability")

    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight")
    plt.close()
    buf.seek(0)
    return buf.read()
