from omegaconf import OmegaConf
import json

def read_config(path: str, root: str | None = None) -> OmegaConf:
    """
    :@param path: path to the config file
    :@param root: root of the project to be set in config (optional)
    """
    cfg = OmegaConf.load(path)
    if root is not None:
        cfg.root = root

    cfg = OmegaConf.to_yaml(cfg, resolve=True)
    cfg = OmegaConf.create(cfg)
    return cfg

def pprint_config(cfg: OmegaConf):
    print(json.dumps(OmegaConf.to_container(cfg), indent=2))
