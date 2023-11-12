import os
import sys
import hydra
import pandas as pd
import sacrebleu

from omegaconf import DictConfig, OmegaConf

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
conf_path = os.path.join(root_dir, "conf")

@hydra.main(version_base=None, config_path=conf_path, config_name="config")
def main(cfg: OmegaConf) -> None:
    cfg = OmegaConf.create(OmegaConf.to_yaml(cfg, resolve=True))

    # Load data
    data = pd.read_csv(cfg.dataset.path)

    # compute blue for each candidate
    cols = cfg.dataset.cols
    reference_col = cols.reference
    data[reference_col] = data[reference_col].apply(lambda x: [x])
    for candidate_col in cols.candidates:
        bleu = data[[reference_col, candidate_col]].apply(
            lambda x: sacrebleu.corpus_bleu(x[reference_col], x[candidate_col]).score,
            axis=1
        )
        data[f"{candidate_col}_bleu"] = bleu
        print(f"{candidate_col} BLEU: {bleu.mean():.2f}")

if __name__ == "__main__":
    main()