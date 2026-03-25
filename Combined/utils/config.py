# utils/config.py
import os

# Root directory (assumes this file lives in causalcast/utils/config.py)
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# Weights
WEIGHTS_DIR       = os.path.join(ROOT_DIR, "weights")
FINBERT_WEIGHTS   = os.path.join(WEIGHTS_DIR, "finbert")
DAN3_WEIGHTS_DIR  = os.path.join(WEIGHTS_DIR, "dan3")
LSTM_WEIGHTS_DIR  = os.path.join(WEIGHTS_DIR, "lstm")

# DAN-3 files
DAN3_STATE_DICT   = os.path.join(DAN3_WEIGHTS_DIR, "model_weights.pt")
DAN3_VOCAB_JSON   = os.path.join(DAN3_WEIGHTS_DIR, "vocab.json")
DAN3_EMB_WEIGHTS  = os.path.join(DAN3_WEIGHTS_DIR, "embedding_weights.pt")
DAN3_TEMP_JSON    = os.path.join(DAN3_WEIGHTS_DIR, "temperature.json")
DAN3_LABELS_JSON  = os.path.join(DAN3_WEIGHTS_DIR, "label_encoder.json")

# LSTM files
LSTM_STATE_DICT   = os.path.join(LSTM_WEIGHTS_DIR, "final_lstm_volatility.pth")
LSTM_SCALER_PKL   = os.path.join(LSTM_WEIGHTS_DIR, "scaler_final.pkl")

# Model hyperparams (must match training!)
DAN3_EMBED_DIM    = 100
DAN3_NUM_CLASSES  = 3
DAN3_PAD_TO       = 16

LSTM_INPUT_SIZE   = 2
LSTM_HIDDEN_SIZE  = 64
LSTM_NUM_LAYERS   = 2
LSTM_OUTPUT_SIZE  = 1

# Runtime
USE_GPU           = False  # Flip to True if you want CUDA and it’s available.

import torch

def select_device(use_gpu: bool = True):
    """
    Returns the torch.device object for GPU if available, otherwise CPU.
    """
    if use_gpu and torch.cuda.is_available():
        print(f"Using GPU: {torch.cuda.get_device_name(0)}")
        return torch.device("cuda")
    else:
        print("Using CPU")
        return torch.device("cpu")
