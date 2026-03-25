import torch
import torch.nn as nn
import numpy as np
from pathlib import Path
from utils.config import select_device



class LSTMVol(nn.Module):
    def __init__(self, input_dim: int = 2, hidden_dim: int = 100, num_layers: int = 3, dropout: float = 0.5):
        super().__init__()
        self.lstm = nn.LSTM(
            input_dim,
            hidden_dim,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout
        )
        self.head = nn.Linear(hidden_dim, 1)

    def forward(self, x):
        out, _ = self.lstm(x)
        last = out[:, -1, :]  # take last timestep
        y = self.head(last)
        return y


class LSTMVolService:
    def __init__(self, weights_path=None, scaler_path=None, use_gpu=True):
        self.device = select_device(use_gpu)
        self.model = LSTMVol()

        if not Path(weights_path).exists():
            raise FileNotFoundError(f"LSTM weights not found at {weights_path}")

        state = torch.load(str(weights_path), map_location="cpu")
        self.model.load_state_dict(state, strict=False)
        self.model.to(self.device).eval()

        self.scaler = None
        if scaler_path and Path(scaler_path).exists():
            import joblib
            self.scaler = joblib.load(scaler_path)

    @torch.no_grad()
    def predict(self, seq):
        # Convert numpy/list to tensor
        if isinstance(seq, np.ndarray):
            seq = torch.tensor(seq, dtype=torch.float32)
        elif not torch.is_tensor(seq):
            seq = torch.tensor(seq, dtype=torch.float32)

        # Apply scaling if scaler is loaded
        if self.scaler is not None and not torch.is_tensor(seq):
            seq = torch.tensor(self.scaler.transform(seq), dtype=torch.float32)

        seq = seq.to(self.device)
        self.model.eval()

        # Add batch dimension if missing
        if seq.ndim == 2:
            seq = seq.unsqueeze(0)

        out = self.model(seq)
        return out.item()
