# TODO

The per-encoder checklist that used to live here is obsolete: coverage is no
longer tracked by hand. `tools/ludwig-surface.json` is extracted from Ludwig's
schema and every block in it is generated, so anything Ludwig supports is
covered by construction. `npm test` fails if that stops being true.

## Open

- [ ] Ship a bundled JSON Schema and register it via the `yamlValidation`
      contribution point, so users get validation and hover docs without
      running `ludwig export_schema` themselves. Ludwig's own published schema
      URLs (`https://ludwig-ai.github.io/schema/…`) currently 404.
- [ ] Decide whether 644 YAML-scoped snippets are too intrusive. They are
      contributed to every `.yaml` file, so Compose / k8s / CI files now see
      Ludwig completions too. The prefixes are distinctive (`txt-enc-bert`,
      `comb-tabnet`), but a shared leading token (`trainer`, `hyperopt`) can
      still surface. Options: a dedicated `ludwig-yaml` language that activates
      on `*.ludwig.yaml`, or a setting that gates the library.
- [ ] Decide how to handle Ludwig version drift. Options: ship one snippet set
      per major Ludwig version, or add a setting that scopes prefixes.
- [ ] `tools/verify-against-ludwig.py` re-derives the schema per config and
      takes ~15 minutes for the full library. Cache the compiled validator so
      it can run in CI.
- [ ] The longest `-full` snippets are the LLM trainers at ~50 lines. That is
      still tab-through-able, but worth revisiting if users report it.

## Nice to have

- [ ] Snippets for `ludwig` CLI invocations in shell files.
- [ ] A command that scaffolds a config from the columns of an open CSV.
