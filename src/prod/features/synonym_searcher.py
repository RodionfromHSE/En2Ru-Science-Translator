from abc import ABC, abstractmethod
import typing as tp
import fasttext
from omegaconf import DictConfig

class BaseSynonymSearcher(ABC):
    @abstractmethod
    def __call__(self, tokens: tp.List[str], *args, return_scores: bool = False, 
                 n_synonyms: int = 5, **kwargs) -> tp.List[tp.List[str]] | tp.List[tp.List[tp.Tuple[str, float]]]:
        """
        Search for synonyms for each token in the list
        :@param tokens: list of tokens to find synonyms for
        :@param return_scores: whether to return scores for synonyms
        :@param n_synonyms: number of synonyms to return for each token
        :@return: list of synonyms for each token or list of synonyms and scores
        """
        pass


class FastTextSynonymSearcher(BaseSynonymSearcher):
    def __init__(self, model_path: str):
        """
        :@param model_path: path to fasttext model
        """
        super().__init__()
        self.model = fasttext.load_model(model_path)

    def __call__(self, tokens: tp.List[str], *args, return_scores: bool = False,
                    n_synonyms: int = 5, **kwargs) -> tp.List[tp.List[str]] | tp.List[tp.List[tp.Tuple[str, float]]]:
            """
            Search for synonyms for each token in the list
            :@param tokens: list of tokens to find synonyms for
            :@param return_scores: whether to return scores for synonyms
            :@param n_synonyms: number of synonyms to return for each token
            :@return: list of synonyms for each token or list of synonyms and scores
            """
            synonyms = []
            for token in tokens:
                if return_scores:
                    synonyms.append(self.model.get_nearest_neighbors(token, k=n_synonyms))
                else:
                    synonyms.append([synonym for _, synonym in self.model.get_nearest_neighbors(token, k=n_synonyms)])
            return synonyms
    
def choose_synonym_searcher(cfg: DictConfig) -> BaseSynonymSearcher:
    """
    Choose synonym searcher based on config

    :@param cfg: config to choose synonym searcher from
    :@return: synonym searcher
    """
    if cfg.type == "fasttext":
        return FastTextSynonymSearcher(cfg.path)
    else:
        raise ValueError(f"Unknown synonym searcher type: {cfg.type}")