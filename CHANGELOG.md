## [0.3.0]

### Breaking

- Snippets are now scoped to a new `ludwig-yaml` language instead of every
  `.yaml` file. With 644 snippets, contributing them to YAML at large would put
  Ludwig completions into every Compose, Kubernetes and CI file you open.
  Files are recognised automatically when named `*.ludwig.yaml`, `*.ludwig.yml`,
  `ludwig.yaml`, `ludwig.yml`, `ludwig_config.yaml` or `ludwig_config.yml`.
  For any other name, add a `files.associations` entry — see the README.
  Highlighting is unchanged; the language reuses the built-in YAML grammar.

Rebuilt the library against **Ludwig 0.17.8**. Snippets are now generated from
Ludwig's own config schema instead of being written by hand, growing the library
from 43 to 644 snippets and covering every section of a Ludwig config.

### Added

- Full encoder coverage: all 114 encoders, including image (`timm`, `convnext`,
  `swin_transformer`, `unet`, …), audio (`wav2vec2`, `whisper`, `hubert`),
  text transformers (`modernbert`, `deberta`, `t5`, …), the new `mamba` /
  `jamba` hybrids and the `patchtst` / `nbeats` timeseries encoders.
- Decoders, losses, combiners (all 14, including `cross_attention`,
  `hypernetwork` and `tabpfn_v2`) and type-wide `defaults` blocks.
- Trainer coverage: the ECD trainer, all 31 optimizers, the learning rate
  scheduler, gradient clipping and the profiler.
- Hyperopt: the block itself, executors, all search algorithms, all trial
  schedulers and the common search spaces.
- LLM fine-tuning: `base_model`, `prompt`, all 15 PEFT adapters, quantization,
  generation, model parameters, and the `finetune` / `dpo` / `kto` / `orpo` /
  `grpo` trainers.
- Input and output feature snippets for every feature type, plus the new
  `anomaly` and `category_distribution` output types.
- Backend snippets for local and Ray execution.
- `SNIPPETS.md`, a generated index of every prefix.
- `npm test`, which checks that every snippet is valid JSON, expands to valid
  YAML, and only writes keys Ludwig actually accepts.

### Fixed

- Parameter names that Ludwig silently ignored, so the setting never applied:
  `weight_initializer` → `weights_initializer` (10 snippets), `fc_layer` →
  `fc_layers`, `filter_sizes` → `filter_size`, `num_stack_layers` →
  `num_stacked_layers`, `embedings_on_cpu` → `embeddings_on_cpu`,
  `embedings_trainable` → `embeddings_trainable`, `embidding_size` →
  `embedding_size`.
- Trailing commas that made three snippet files invalid JSON.
- Values that PyYAML (which Ludwig uses) misreads: quantities like `0_5` were
  parsed as the integer `5`, and `1e-12` as a string rather than a float.
- Duplicated and stale choice values, for example a `cell_type` list containing
  `lstm` twice alongside cell types Ludwig no longer accepts.

### Changed

- Most blocks now come in two variants: a minimal one, and a `-full` one that
  lists every parameter with its Ludwig default.
- Choice values are ordered with Ludwig's default first.
- Snippets are split into per-section files under `snippets/`.

Existing prefixes (`ecd`, `bootstrap-ecd`, `input-feature-list`, `glo-pre`,
`bemb`, `cdenc`, `csparse`, …) still work.

## [0.2.1]

- Added support information.

## [0.2.0]

- Added global preprocessing configuration snippet.
- Added encoding snippets for the following types:
  - Bag
  - Category
  - Date
  - H3
  - Sequence
  - Set
  - Text (incomplete)
- Added some generic encoders for multiple types.
- Changed some snippet prefixes to be more consistent.

## [0.1.1]

- Fixed minor typo issues.

## [0.1.0]

- Added bootstraping ECD configuration snippet.
- Added snippets for adding input and output feature lists.
- Added snippets for preprocessing configurations of input features.
- Created all neccessary file for the extension marketplace.
- Added a changelog
- Added a logo
