from typing import List
import torch
import os
import numpy as np

# Disable TensorFlow in transformers globally
os.environ["TRANSFORMERS_NO_TF"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"

LABELS = ["negative", "neutral", "positive"]

class FinBERTScorer:
    def __init__(self, model_name_or_path: str, use_gpu: bool = False):
        # Do not import transformers at module level
        self.model_name_or_path = model_name_or_path
        self.use_gpu = use_gpu
        self.device = None
        self.tokenizer = None
        self.model = None

    def _lazy_load(self):
        if self.model is None or self.tokenizer is None:
            # For now, always use mock model to avoid TensorFlow issues
            print("⚠️ Using mock FinBERT model to avoid TensorFlow compatibility issues")
            self._create_mock_model()
            
            # TODO: Re-enable real FinBERT when TensorFlow issues are resolved
            # try:
            #     from transformers import AutoTokenizer, AutoModelForSequenceClassification
            #     from utils.config import select_device
            #     self.device = select_device(self.use_gpu)
            #     self.tokenizer = AutoTokenizer.from_pretrained(self.model_name_or_path, use_fast=True)
            #     self.model = AutoModelForSequenceClassification.from_pretrained(
            #         self.model_name_or_path, torch_dtype=torch.float32
            #     ).to(self.device)
            #     self.model.eval()
            #     print("✅ FinBERT model loaded successfully")
            # except Exception as e:
            #     print(f"❌ Failed to load FinBERT: {e}")
            #     self._create_mock_model()

    def _create_mock_model(self):
        """Create a mock model that returns random sentiment scores"""
        self.device = torch.device("cpu")
        self.tokenizer = None
        self.model = None
        print("⚠️ Using mock FinBERT model")

    @torch.no_grad()
    def score(self, texts: List[str]):
        if not texts:
            return []
        
        self._lazy_load()
        
        # If model failed to load, use mock responses
        if self.model is None:
            return self._mock_score(texts)
        
        try:
            enc = self.tokenizer(
                texts, padding=True, truncation=True, max_length=256, return_tensors="pt"
            )
            enc = {k: v.to(self.device) for k, v in enc.items()}
            logits = self.model(**enc).logits
            probs = torch.softmax(logits, dim=-1).cpu().numpy()
            return [dict(zip(LABELS, p.astype(float).tolist())) for p in probs]
        except Exception as e:
            print(f"❌ FinBERT prediction failed: {e}")
            return self._mock_score(texts)

    def _mock_score(self, texts: List[str]):
        """Generate mock sentiment scores based on text analysis"""
        results = []
        for text in texts:
            # Simple keyword-based sentiment
            positive_words = ['good', 'great', 'excellent', 'positive', 'rise', 'up', 'profit', 'gain']
            negative_words = ['bad', 'terrible', 'negative', 'fall', 'down', 'loss', 'decline']
            
            text_lower = text.lower()
            pos_count = sum(1 for word in positive_words if word in text_lower)
            neg_count = sum(1 for word in negative_words if word in text_lower)
            
            if pos_count > neg_count:
                # Positive sentiment
                probs = [0.1, 0.2, 0.7]  # [negative, neutral, positive]
            elif neg_count > pos_count:
                # Negative sentiment
                probs = [0.7, 0.2, 0.1]  # [negative, neutral, positive]
            else:
                # Neutral sentiment
                probs = [0.2, 0.6, 0.2]  # [negative, neutral, positive]
            
            results.append(dict(zip(LABELS, probs)))
        return results

    @staticmethod
    def to_triplets(outputs: List[dict]):
        return [(o["negative"], o["neutral"], o["positive"]) for o in outputs]
