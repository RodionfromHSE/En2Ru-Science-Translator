En2Ru Scientific Translator
==============================

Translator focused on exact science texts

Project Organization
------------

    ├── LICENSE
    ├── Makefile           <- Makefile with commands like `make data` or `make train`
    ├── README.md          <- The top-level README for developers using this project.
    ├── conf               <- Configuration files
    ├── data
    │   ├── external       <- Data from third party sources.
    │   ├── interim        <- Intermediate data that has been transformed.
    │   ├── processed      <- The final, canonical data sets for modeling.
    │   └── raw            <- The original, immutable data dump.
    │
    ├── docs               <- A default Sphinx project; see sphinx-doc.org for details
    │
    ├── models             <- Trained and serialized models, model predictions, or model summaries
    │
    ├── notebooks          <- Jupyter notebooks. Naming convention is a number (for ordering),
    │                         the creator's initials, and a short `-` delimited description, e.g.
    │                         `1.0-jqp-initial-data-exploration`.
    │
    ├── references         <- Data dictionaries, manuals, and all other explanatory materials.
    │
    ├── reports            <- Generated analysis as HTML, PDF, LaTeX, etc.
    │   └── figures        <- Generated graphics and figures to be used in reporting
    │
    ├── requirements.txt   <- The requirements file for reproducing the analysis environment, e.g.
    │                         generated with `pip freeze > requirements.txt`
    │
    ├── setup.py           <- makes project pip installable (pip install -e .) so src can be imported
    ├── src                <- Source code for use in this project.
    │   ├── __init__.py    <- Makes src a Python module
    │   │
    │   ├── data           <- Scripts to download or generate data
    │   │   └── make_dataset.py
    │   │
    │   ├── features       <- Scripts to turn raw data into features for modeling
    │   │   └── build_features.py
    │   │
    │   ├── models         <- Scripts to train models and then use trained models to make
    │   │   │                 predictions
    │   │   ├── predict_model.py
    │   │   └── train_model.py
    │   │
    │   └── visualization  <- Scripts to create exploratory and results oriented visualizations
    │       └── visualize.py
    │
    └── tox.ini            <- tox file with settings for running tox; see tox.readthedocs.io


--------

## Installation

```bash
pip3 install -r requirements.txt
```

## Dataset

#### Training dataset
The training dataset is based on `saier/unarxive_citrec` [hf](https://huggingface.co/datasets/saier/unarxive_citrec).

*Details*:
```yaml
Train size: 9082
Valid size: 702
Test size: 568
```

All the samples have length from `128` to `512` characters (TO-DO: characters -> tokens)\
More in `notebooks/data/dataset_download.ipynb`

After collecting the dataset, we carefully translated the samples from English to Russian using the OpenAI API.\
Details in `notebooks/data/dataset_translate.ipynb`

#### Dataset for model comparison (EvalDataset)
This dataset is based on `turkic_xwmt`, `subset=ru-en`, `split=test` [hf](https://huggingface.co/datasets/turkic_xwmt).

Dataset size: 1000

## Models comparison

Models comparison is based on bleu score of the translated samples and reference translation by OpenAI.

**Models**:\
transformer-en-ru: `Helsinki-NLP/opus-mt-en-ru` [hf](https://huggingface.co/Helsinki-NLP/opus-mt-en-ru)\
nnlb-1.3B-distilled: `facebook/nllb-200-distilled-1.3B` [hf](https://huggingface.co/facebook/nllb-200-distilled-1.3B)


**Results**:
```yaml
transformer-en-ru BLEU: 2.58
nnlb-1.3B-distilled BLEU: 2.55
```

Even though results aren't statistically important, transformer-en-ru model was chosen since it's faster and has smaller size.\
Details in `src/finetune/eval_bleu.py`

## Model finetuning

Simple seq2seq model finetuning transformer-en-ru.\
Details in `notebooks/finetune/finetune.ipynb`.\
Model on [hf](https://huggingface.co/under-tree/transformer-en-ru)

**Fine-tuned model results**:
```yaml
eval_loss: 0.656
eval_bleu: 67.197
```
(BLEU is suspeciously high)

## Translation App

**Synonyms Searcher**\
Simple version is based on `word2vec` model, namely `fasttext` ([link](https://fasttext.cc/docs/en/crawl-vectors.html)). We've chosen fasttext because it solves the problem of out-of-vocabulary words.






<p><small>Project based on the <a target="_blank" href="https://drivendata.github.io/cookiecutter-data-science/">cookiecutter data science project template</a>. #cookiecutterdatascience</small></p>
