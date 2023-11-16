from omegaconf import OmegaConf
import json
import typing as tp
import os
from hydra import initialize_config_dir, compose

__ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
__CONFIG_DIR = os.path.join(__ROOT_DIR, "conf")

def read_config(config_dir: str = __CONFIG_DIR, overrides: tp.Optional[tp.List[str]] = None) -> OmegaConf:
    """
    :@param config_dir: path to config directory
    :@param overrides: list of overrides (e.g. ["dataset=model_eval"])
    :@param set_to_none_empty_with_warn: if True, set empty values to None and print warning
    :@return: OmegaConf object
    """
    config_dir = os.path.abspath(config_dir)
    with initialize_config_dir(config_dir=config_dir, version_base=None):
        cfg = compose(config_name="config", overrides=overrides)
        cfg = OmegaConf.create(OmegaConf.to_yaml(cfg, resolve=True))
    return cfg

def pprint_config(cfg: OmegaConf) -> None:
    "Pretty print config"
    print(json.dumps(OmegaConf.to_container(cfg), indent=2))
