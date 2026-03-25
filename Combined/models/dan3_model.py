from typing import List
import torch
import torch.nn as nn
import torch.nn.functional as F
from pathlib import Path
from utils.config import select_device


class DAN3(nn.Module):
    def __init__(self, vocab_size: int = 5137, emb_dim: int = 100,
                 hidden_dims=(300, 300, 128), num_classes: int = 3, pad_idx: int = 0):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, emb_dim, padding_idx=pad_idx)
        self.fc1 = nn.Linear(emb_dim, hidden_dims[0])
        self.bn1 = nn.BatchNorm1d(hidden_dims[0])
        self.fc2 = nn.Linear(hidden_dims[0], hidden_dims[1])
        self.bn2 = nn.BatchNorm1d(hidden_dims[1])
        self.fc3 = nn.Linear(hidden_dims[1], hidden_dims[2])
        self.bn3 = nn.BatchNorm1d(hidden_dims[2])
        self.out = nn.Linear(hidden_dims[2], num_classes)

    def forward(self, x):
        emb = self.embedding(x)
        mask = (x != 0).float().unsqueeze(-1)
        summed = (emb * mask).sum(dim=1)
        lengths = mask.sum(dim=1).clamp(min=1.0)
        avg = summed / lengths
        h = F.relu(self.bn1(self.fc1(avg)))
        h = F.relu(self.bn2(self.fc2(h)))
        h = F.relu(self.bn3(self.fc3(h)))
        logits = self.out(h)
        return logits


class DAN3Service:
    def __init__(self, weights_path: Path, vocab_size: int = 50000, emb_dim: int = 100, num_classes: int = 3, use_gpu: bool = True):
        self.device = select_device(use_gpu)
        self.model = DAN3(vocab_size=5137, emb_dim=100,
                  hidden_dims=(300, 300, 128), num_classes=3)

        if not Path(weights_path).exists():
            raise FileNotFoundError(f"DAN-3 weights not found at {weights_path}")
        state = torch.load(str(weights_path), map_location="cpu")
        self.model.load_state_dict(state, strict=False)
        self.model.to(self.device).eval()

    @torch.no_grad()
    def predict(self, token_ids: torch.Tensor) -> torch.Tensor:
        token_ids = token_ids.to(self.device)
        logits = self.model(token_ids)
        probs = torch.softmax(logits, dim=-1)
        return probs.cpu()
