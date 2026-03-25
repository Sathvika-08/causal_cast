# utils/metrics.py
from __future__ import annotations
import numpy as np
from typing import Iterable


def mse(y_true: Iterable[float], y_pred: Iterable[float]) -> float:
    y_true = np.asarray(list(y_true), dtype=np.float32)
    y_pred = np.asarray(list(y_pred), dtype=np.float32)
    return float(np.mean((y_true - y_pred) ** 2))


def rmse(y_true: Iterable[float], y_pred: Iterable[float]) -> float:
    return float(np.sqrt(mse(y_true, y_pred)))


def mae(y_true: Iterable[float], y_pred: Iterable[float]) -> float:
    y_true = np.asarray(list(y_true), dtype=np.float32)
    y_pred = np.asarray(list(y_pred), dtype=np.float32)
    return float(np.mean(np.abs(y_true - y_pred)))


def accuracy(y_true: Iterable[int], y_pred: Iterable[int]) -> float:
    y_true = np.asarray(list(y_true), dtype=np.int64)
    y_pred = np.asarray(list(y_pred), dtype=np.int64)
    return float(np.mean(y_true == y_pred))


def expected_calibration_error(
    confidences: Iterable[float],
    correctness: Iterable[float],
    n_bins: int = 10
) -> float:
    """
    Classic ECE over bins of confidence.
    confidences: probability of the predicted class for each item (0..1)
    correctness: 1.0 if prediction correct else 0.0 for each item
    """
    conf = np.asarray(list(confidences), dtype=np.float32)
    corr = np.asarray(list(correctness), dtype=np.float32)

    assert conf.shape == corr.shape, "confidences and correctness must align"
    bins = np.linspace(0.0, 1.0, n_bins + 1)
    ece = 0.0
    for i in range(n_bins):
        lo, hi = bins[i], bins[i + 1]
        mask = (conf > lo) & (conf <= hi) if i > 0 else (conf >= lo) & (conf <= hi)
        if not np.any(mask):
            continue
        conf_bin = conf[mask]
        corr_bin = corr[mask]
        avg_conf = np.mean(conf_bin)
        avg_acc = np.mean(corr_bin)
        ece += (len(conf_bin) / len(conf)) * abs(avg_conf - avg_acc)
    return float(ece)
