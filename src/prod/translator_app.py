import os
import sys

cur_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(cur_dir)

from features import BaseAttentionExtractor, BaseSynonymSearcher, BaseTranslator
from features import choose_attention_extractor, choose_synonym_searcher, choose_translator
from omegaconf import DictConfig
import typing as tp
from nltk.tokenize import word_tokenize

translation_type = tp.Dict[str, tp.Any]

class TranslatorApp:
    def __init__(self, cfg: DictConfig):
        self.cfg = cfg
        self.translator = choose_translator(cfg.translator)
        self.src_synonym_searcher = choose_synonym_searcher(cfg.src_synonym_searcher)
        self.dest_synonym_searcher = choose_synonym_searcher(cfg.dest_synonym_searcher)
        self.attention_extractor = choose_attention_extractor(cfg.attention_extractor)

    def _get_words(self, text: str) -> tp.List[str]:
        """
        Split text into words
        :@param text: text to split
        :@return: list of words
        """
        text = text.lower()
        return word_tokenize(text)
    
    def call_one(self, text: str) -> translation_type:
        """
        Return translation for one text
        :@param text: text to translate
        :@return: dict
        {
            'translation': str,
            'input_tokens': list[str]
            'input_words': list[str]
            'output_tokens': list[str]
            'output_words': list[str]
            'src_synonyms': list[list[str]]
            'dest_synonyms': list[list[str]]
            'attention': list[list[float]]
        }
        """
        translation = self.translator(text)
        input_tokens = translation["input_tokens"]
        output_tokens = translation["output_tokens"]
        input_words = self._get_words(text)
        output_words = self._get_words(translation["translation"])
        src_synonyms = self.src_synonym_searcher(input_words)
        dest_synonyms = self.dest_synonym_searcher(output_words)
        attention = self.attention_extractor(input_tokens)
        return {
            "translation": translation["translation"],
            "input_tokens": input_tokens,
            "input_words": input_words,
            "output_tokens": output_tokens,
            "output_words": output_words,
            "src_synonyms": src_synonyms,
            "dest_synonyms": dest_synonyms,
            "attention": attention
        }
    
    def __call__(self, texts: str | tp.List[str]) -> translation_type | tp.List[translation_type]:
        if isinstance(texts, str):
            return self.call_one(texts)
        return [self.call_one(text) for text in texts]
