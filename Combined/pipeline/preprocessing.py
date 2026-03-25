from __future__ import annotations
import os
import re
from typing import List, Dict, Iterable, Optional
import numpy as np
import joblib

from utils.config import DAN3_WEIGHTS_DIR
from utils.file_io import load_json

# ---------- text cleaning ----------
_CLEAN_REGEXES = [
    (re.compile(r"http\S+|www\.\S+"), " "),           # URLs
    (re.compile(r"@[A-Za-z0-9_]+"), " "),             # @handles
    (re.compile(r"#[A-Za-z0-9_]+"), " "),             # hashtags
    (re.compile(r"[^A-Za-z0-9\.\,\!\?\-\s]"), " "),   # non-ascii-ish
    (re.compile(r"\s+"), " "),                        # collapse spaces
]

def clean_text(text: str) -> str:
    """Basic, deterministic cleaning for finance/news text."""
    t = text.strip()
    for pat, repl in _CLEAN_REGEXES:
        t = pat.sub(repl, t)
    return t.strip()

# ---------- DAN-3 tokenization ----------
def load_vocab(vocab_path: Optional[str] = None) -> Dict[str, int]:
    """Load the DAN-3 vocab.json as {token: id}."""
    if vocab_path is None:
        vocab_path = os.path.join(DAN3_WEIGHTS_DIR, "vocab.json")
    vocab = load_json(vocab_path)
    if not isinstance(vocab, dict):
        raise ValueError("vocab.json must be a dict of {token: id}")
    return vocab

def tokenize_to_ids(
    texts: Iterable[str],
    vocab: Dict[str, int],
    pad_to: int = 16,
    unk_token: str = "<unk>",
    pad_token: str = "<pad>",
) -> List[List[int]]:
    """Simple whitespace tokenizer → vocab IDs, padded/truncated."""
    unk_id = vocab.get(unk_token, 1)
    pad_id = vocab.get(pad_token, 0)
    ids_batch: List[List[int]] = []
    for raw in texts:
        text = clean_text(raw)
        tokens = text.lower().split()
        ids = [vocab.get(tok, unk_id) for tok in tokens][:pad_to]
        if len(ids) < pad_to:
            ids += [pad_id] * (pad_to - len(ids))
        ids_batch.append(ids)
    return ids_batch

# ---------- LSTM input builder ----------
def prepare_lstm_input(
    historical_vol_seq: Iterable[float],
    sentiment_scalar: float,
) -> List[List[float]]:
    """
    Build the 2D feature sequence expected by your LSTM:
    [ [vol_t, S_t], ... ] where S_t is the same daily sentiment_scalar.
    """
    seq = []
    for v in historical_vol_seq:
        seq.append([float(v), float(sentiment_scalar)])
    return seq

# ---------- Scaling helper ----------
def scale_features(
    historical_vol_seq: Iterable[float],
    sentiment_scalar: float,
    scaler_path: str,
):
    """
    Loads a pre-fitted scaler (PKL) and applies it to the LSTM input sequence.
    Returns a numpy array ready for LSTM prediction.
    """
    seq = prepare_lstm_input(historical_vol_seq, sentiment_scalar)
    scaler = joblib.load(scaler_path)
    seq_scaled = scaler.transform(seq)
    return np.array(seq_scaled, dtype=np.float32)
