import os
import sys

root_dir = os.path.abspath(os.path.join(__file__, '../../..'))
sys.path.append(root_dir)

import pandas as pd
import sacrebleu
from omegaconf import OmegaConf
from custom_utils.config_handler import read_config, pprint_config


def main() -> None:
    cfg: OmegaConf = read_config(overrides=["dataset=model_eval"])
    pprint_config(cfg)

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
