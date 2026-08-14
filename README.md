# Ludwig Snippets

Snippets for writing [Ludwig](https://ludwig.ai/latest/) configuration files in VS Code.

Ludwig configs are plain YAML, which means no autocomplete and a lot of trips to the
documentation to remember whether it is `weights_initializer` or `weight_initializer`.
This extension covers the whole config surface — **644 snippets generated directly from
Ludwig 0.17.8's own schema**, so every parameter name, default and allowed value matches
what Ludwig actually accepts.

## Quick start

Name your config so the extension recognises it — `model.ludwig.yaml`, or just
`ludwig.yaml` — then type a prefix:

| Prefix | What you get |
| ------ | ------------ |
| `ecd-config` | A complete starter ECD configuration |
| `llm-config` | A complete starter LLM fine-tuning configuration |
| `txt-enc-bert` | A BERT encoder on a text feature |
| `cat-out` | A category output feature |
| `comb-tabnet` | A TabNet combiner |
| `trainer` | The trainer block with the parameters you actually tune |
| `hyperopt` | A ready-to-run hyperopt block |
| `llm-adapter-lora` | A LoRA adapter block |

Every prefix is listed in **[SNIPPETS.md](SNIPPETS.md)**.

## Which files the snippets appear in

The snippets are scoped to a `ludwig-yaml` language rather than to YAML at large,
so a Compose or Kubernetes file does not get 644 Ludwig completions it can never
use. Files pick that language up automatically when they are named:

- `*.ludwig.yaml` / `*.ludwig.yml`
- `ludwig.yaml` / `ludwig.yml` / `ludwig_config.yaml` / `ludwig_config.yml`

Highlighting, folding and comments behave exactly as in YAML — the language
reuses the built-in YAML grammar.

If your configs are named something else (`config.yaml`, `experiments/*.yaml`),
map them yourself:

```jsonc
// .vscode/settings.json
{
  "files.associations": {
    "config.yaml": "ludwig-yaml",
    "experiments/*.yaml": "ludwig-yaml"
  }
}
```

You can also switch a single open file with **Change Language Mode**
(<kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>K</kbd> <kbd>M</kbd>) → *Ludwig YAML*.

> **Changed in 0.3.0.** Up to 0.2.1 the snippets were contributed to every
> `.yaml` file. If you relied on that, add a `files.associations` entry as above.

## Ludwig version

Generated from **Ludwig 0.17.8**. Parameter names, defaults and allowed values
match that release; the exact version is recorded in `package.json` under
`ludwig.generatedFrom`. On substantially older Ludwig (0.10 and earlier) some
parameters will not exist — and Ludwig ignores keys it does not recognise rather
than reporting them, so the setting would be silently dropped.

## How the prefixes are built

Prefixes follow `<feature>-<section>-<variant>`:

```
txt-enc-bert          text feature  ->  encoder  ->  bert
cat-dec-classifier    category      ->  decoder  ->  classifier
num-loss-mse          number        ->  loss     ->  mean squared error
img-pre               image         ->  preprocessing
```

| Feature | Abbreviation | | Feature | Abbreviation |
| ------- | ------------ |-| ------- | ------------ |
| Binary | `bin` | | Audio | `aud` |
| Number | `num` | | Date | `dt` |
| Category | `cat` | | H3 | `h3` |
| Bag | `bag` | | Image | `img` |
| Set | `set` | | Timeseries | `ts` |
| Sequence | `seq` | | Vector | `vec` |
| Text | `txt` | | Anomaly | `anom` |
| | | | Category distribution | `catdist` |

| Section | Abbreviation |
| ------- | ------------ |
| Encoder | `enc` |
| Decoder | `dec` |
| Loss | `loss` |
| Preprocessing | `pre` |
| Input / output feature | `in` / `out` |

LLM-only blocks are prefixed with `llm-`, for example `llm-adapter-lora` or
`llm-trainer-dpo`.

### Minimal and full variants

Most blocks come in two flavours:

- `txt-enc-bert` inserts only what Ludwig cannot fill in for you.
- `txt-enc-bert-full` inserts **every** parameter with its Ludwig default, as a
  tab-through checklist. Delete the lines you do not need.

Choice parameters expand into a dropdown of the values Ludwig accepts, with the
default listed first, so pressing <kbd>Enter</kbd> keeps Ludwig's behaviour.

## What is covered

| Area | Snippets |
| ---- | -------- |
| Config scaffolds (ECD, LLM, backends) | 6 |
| Input and output features | 54 |
| Encoders (all 114 of them) | 228 |
| Decoders (all 23) | 46 |
| Losses | 104 |
| Combiners (all 14) | 28 |
| Preprocessing (global, splits, per feature type) | 19 |
| Trainer, 31 optimizers, LR scheduler, profiler | 79 |
| Hyperopt (search algorithms, schedulers, search spaces) | 32 |
| LLM prompt, adapters, quantization, generation | 35 |
| Type-wide defaults | 13 |

## A note on validation

Ludwig **ignores** config keys it does not recognise rather than rejecting them.
A misspelled parameter is therefore silent: training runs, but your setting is
quietly dropped. That is the main reason these snippets are generated from the
schema rather than written by hand.

For live validation and hover documentation while you type, pair this extension
with the [YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml)
and point it at a schema exported from your own Ludwig install (Ludwig's published
schema URLs are not currently reachable):

```bash
ludwig export_schema --model-type ecd -o ludwig-schema.json
```

```jsonc
// .vscode/settings.json
{
  "yaml.schemas": { "./ludwig-schema.json": ["*.ludwig.yaml"] }
}
```

## Contributing

Nothing under `snippets/` is written by hand — it is generated. To change the
library, change the generator.

```bash
npm install
npm run generate   # rewrite snippets/, SNIPPETS.md and package.json
npm test           # validate every snippet
```

To target a newer Ludwig release, regenerate the schema surface first:

```bash
pip install "ludwig==<version>"
python tools/extract-ludwig-surface.py -o tools/ludwig-surface.json
npm run generate && npm test
```

A full Ludwig install pulls in torch. If you only want the schema, unpack the
wheel and let the extractor stub the heavy imports instead:

```bash
pip download ludwig --no-deps -d /tmp/lw && unzip -q /tmp/lw/ludwig-*.whl -d /tmp/lw/pkg
pip install pydantic pyyaml packaging python-dateutil
python tools/extract-ludwig-surface.py --stub-heavy-deps --package-path /tmp/lw/pkg \
  -o tools/ludwig-surface.json
```

`tools/verify-against-ludwig.py` goes further and runs every snippet through
Ludwig's own config validator; see the comments in that file. It needs Ludwig
installed, so it is not part of `npm test`.

## Release notes

See [CHANGELOG.md](CHANGELOG.md).
