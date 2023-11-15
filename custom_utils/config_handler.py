from omegaconf import OmegaConf
import json
import warnings
import typing as tp
import os
from hydra import initialize_config_dir, compose

def _set_to_none_empty_values(config: OmegaConf) -> OmegaConf:
    "Takes OmegaConf object and set empty values to None. Throws warning for each empty value."
    for key, value in config.items():
        if not value:
            warnings.warn(f"Empty value for field '{key}'. This field will set to None.")
            config[key] = None

    return config

def read_config(config_dir: str, overrides: tp.Optional[tp.List[str]] = None, set_to_none_empty_with_warn: bool = True) -> OmegaConf:
    """
    :@param config_dir: path to config directory
    :@param overrides: list of overrides (e.g. ["dataset=model_eval"])
    :@param set_to_none_empty_with_warn: if True, set empty values to None and print warning
    :@return: OmegaConf object
    """
    config_dir = os.path.abspath(config_dir)
    with initialize_config_dir(config_dir=config_dir, version_base=None):
        cfg = compose(config_name="config", overrides=overrides)
    if set_to_none_empty_with_warn:
        cfg = _set_to_none_empty_values(cfg)
    return cfg

def pprint_config(cfg: OmegaConf) -> None:
    "Pretty print config"
    print(json.dumps(OmegaConf.to_container(cfg), indent=2))
