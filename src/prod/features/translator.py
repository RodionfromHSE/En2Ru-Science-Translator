from abc import ABC, abstractmethod
import typing as tp
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from omegaconf import DictConfig

translation_dict = tp.Dict[str, str | tp.List[str]]

class BaseTranslator(ABC):
    def __init__(self, model: AutoModelForSeq2SeqLM, tokenizer: AutoTokenizer):
        """
        :@param model: model to translate with
        :@param tokenizer: tokenizer to use
        """
        super().__init__()
        self.model = model
        self.tokenizer = tokenizer

    @abstractmethod
    def call_one(self, text: str, *args, **kwargs) -> translation_dict:
        """
        Translate one text

        :@param text: text to translate
        :@return: dict with translation, input and output tokens
        {
            'translation': str,
            'input_tokens': list[str]
            'output_tokens': list[str]
        }
        """
        pass

    def __call__(self, texts: str | tp.List[str], *args, **kwargs) -> translation_dict | tp.List[translation_dict]:
        """
        Translate texts

        :@param texts: text or list of texts to translate
        :@return: dict or list of dicts with translation, input and output tokens for each text
        {
            'translation': str,
            'input_tokens': list[str]
            'output_tokens': list[str]
        }
        """
        if isinstance(texts, str):
            return self.call_one(texts, *args, **kwargs)
        return [self.call_one(text, *args, **kwargs) for text in texts]
    

class Seq2SeqTranslator(BaseTranslator):
    def __init__(self, cfg: DictConfig):
        """
        :@param cfg: config with model and tokenizer paths
        """
        name = cfg.model_and_tokenizer_name
        model = AutoModelForSeq2SeqLM.from_pretrained(name)
        tokenizer = AutoTokenizer.from_pretrained(name)
        super().__init__(model, tokenizer)
        self.gen_params = cfg.get("gen_params", {})

    def get_tokens(self, text: str, is_target: bool) -> tp.List[str]:
        """
        Tokenize text with tokenizer

        :@param text: text to tokenize
        :@param is_target: whether text is target or source
        :@return: list of tokens
        """
        if is_target:
            with self.tokenizer.as_target_tokenizer():
                return self.tokenizer.tokenize(text)
        return self.tokenizer.tokenize(text)

    def call_one(self, text: str, *args, **kwargs) -> translation_dict:
        input_idx = self.tokenizer.encode(text, return_tensors="pt")
        translation = self.model.generate(input_idx, **self.gen_params)
        translation = self.tokenizer.batch_decode(translation, skip_special_tokens=True)[0]

        input_tokens = self.get_tokens(text, is_target=False)
        output_tokens = self.get_tokens(translation, is_target=True)

        return {
            "translation": translation,
            "input_tokens": input_tokens,
            "output_tokens": output_tokens
        }
                        

def choose_translator(cfg: DictConfig) -> BaseTranslator:
    if cfg.type == "seq2seq":
        return Seq2SeqTranslator(cfg)
    else:
        raise ValueError(f"Unknown translator type: {cfg.type}")