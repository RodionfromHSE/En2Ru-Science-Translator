from abc import ABC, abstractmethod
import typing as tp
from typing import Any
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from omegaconf import DictConfig
import numpy as np

class BaseAttentionExtractor(ABC):
    def __init__(self, model: AutoModelForSeq2SeqLM):
        """
        :@param model: model to extract attention from
        """
        super().__init__()
        self.model = model

    @abstractmethod
    def __call__(self, tokens: tp.List[str]) -> tp.List[tp.List[float]]:
        """
        Extract attention scores for each token in relation to all other tokens

        :@param tokens: list of tokens to extract attention for
        :@return: list of attention scores for each token
        """
        pass

class RandomAttentionExtractor(BaseAttentionExtractor):
    """
    Just for testing purposes
    """
    def __call__(self, tokens: tp.List[str]) -> tp.List[tp.List[float]]:
        """
        Extract random attention scores for each token in relation to all other tokens

        :@param tokens: list of tokens to extract attention for
        :@return: list of attention scores for each token
        """
        n_tokens = len(tokens)
        unnormalized_scores = np.random.rand(n_tokens, n_tokens)
        normalized_scores = unnormalized_scores / unnormalized_scores.sum(axis=1, keepdims=True)
        return normalized_scores.tolist()

class Seq2SeqAttentionExtractor(BaseAttentionExtractor):
    pass


def choose_attention_extractor(cfg: DictConfig) -> BaseAttentionExtractor:
    """
    Choose attention extractor based on config

    :@param cfg: config to choose attention extractor from
    :@return: attention extractor
    """
    if cfg.type == "random":
        model = None
        return RandomAttentionExtractor(model)
    if cfg.type == "seq2seq":
        return Seq2SeqAttentionExtractor(cfg)
    else:
        raise ValueError(f"Unknown attention extractor type: {cfg.attention_extractor.type}")