#!/usr/bin/env python3
"""Run every snippet through Ludwig's own config validator.

`npm test` proves the snippets are well-formed YAML that only uses keys Ludwig
knows about. This goes one step further: it embeds each snippet into a complete
config and hands it to `ludwig.config_validation.validation.check_schema`, so a
snippet that produces a config Ludwig would reject fails here.

Usage
-----
    node tools/validate-snippets.mjs --emit-expanded /tmp/expanded.json
    python tools/verify-against-ludwig.py /tmp/expanded.json

Accepts the same `--stub-heavy-deps` / `--package-path` options as
`extract-ludwig-surface.py` so it can run without a full Ludwig install.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path



def _load_install_stubs():
    """Reuse the stub installer from the hyphenated sibling script."""
    import importlib.util

    path = Path(__file__).resolve().parent / "extract-ludwig-surface.py"
    spec = importlib.util.spec_from_file_location("_extract_ludwig_surface", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.install_stubs


install_stubs = _load_install_stubs()

# A minimal, always-valid config that each snippet gets grafted onto.
BASE_INPUT = {"name": "in_col", "type": "category"}
BASE_OUTPUT = {"name": "out_col", "type": "binary"}

# Blocks that are not part of a model config and cannot be validated this way.
UNVALIDATABLE_FILES = ("features.code-snippets",)


def feature_type_from_path(path: str) -> str | None:
    """`snippets/encoders/text.code-snippets` -> `text`."""
    stem = Path(path).stem
    if stem.startswith("llm-"):
        stem = stem[len("llm-"):]
    return stem or None


def build_config(entry: dict, block: dict) -> tuple[dict, str] | None:
    """Graft one snippet's parsed YAML into a complete Ludwig config."""
    path = entry["file"]
    # LLM-only blocks are identified by the file (encoders/llm-text) or, where
    # they share a file with their ECD counterparts, by the snippet name.
    model_type = (
        "llm"
        if "llm-" in Path(path).stem
        or path.endswith("llm.code-snippets")
        or entry["name"].startswith("LLM ")
        else "ecd"
    )

    def base(mt=None):
        mt = mt or model_type
        if mt == "llm":
            return {
                "model_type": "llm",
                "base_model": "hf-internal-testing/tiny-random-GPTJForCausalLM",
                "input_features": [{"name": "in_col", "type": "text"}],
                "output_features": [{"name": "out_col", "type": "text"}],
            }
        return {
            "input_features": [dict(BASE_INPUT)],
            "output_features": [dict(BASE_OUTPUT)],
        }

    # Snippets that already are a whole config.
    if set(block) & {"input_features", "output_features"}:
        config = dict(block)
        config.setdefault("input_features", [dict(BASE_INPUT)])
        config.setdefault("output_features", [dict(BASE_OUTPUT)])
        return config, config.get("model_type", "ecd")

    if "encoder" in block:
        ftype = feature_type_from_path(path) or "category"
        config = base()
        config["input_features"] = [{"name": "in_col", "type": ftype, "encoder": block["encoder"]}]
        return config, model_type

    if "decoder" in block or "loss" in block:
        ftype = feature_type_from_path(path)
        if ftype in (None, "losses"):
            # losses.code-snippets is shared; recover the type from the name.
            ftype = entry["name"].split(" ")[0]
        feature = {"name": "out_col", "type": ftype}
        for key in ("decoder", "loss"):
            if key in block:
                feature[key] = block[key]
        config = base()
        config["output_features"] = [feature]
        return config, model_type

    if "preprocessing" in block:
        ftype = feature_type_from_path(path)
        config = base()
        # A feature-scoped preprocessing block, or the global one.
        name = entry["name"]
        if name.endswith(" preprocessing") and not name.startswith("Global"):
            ftype = name.split(" ")[0]
            config["input_features"] = [
                {"name": "in_col", "type": ftype, "preprocessing": block["preprocessing"]}
            ]
        else:
            config["preprocessing"] = block["preprocessing"]
        return config, model_type

    if "combiner" in block:
        config = base("ecd")
        config["combiner"] = block["combiner"]
        return config, "ecd"

    if "trainer" in block:
        config = base()
        config["trainer"] = block["trainer"]
        return config, model_type

    for key in ("optimizer", "learning_rate_scheduler", "gradient_clipping", "profiler"):
        if key in block:
            config = base("ecd")
            config["trainer"] = {key: block[key]}
            return config, "ecd"

    if "hyperopt" in block:
        config = base("ecd")
        config["hyperopt"] = block["hyperopt"]
        return config, "ecd"

    for key in ("executor", "search_alg", "scheduler", "parameters"):
        if key in block:
            config = base("ecd")
            hyperopt = {"parameters": {"trainer.learning_rate": {"space": "loguniform",
                                                                 "lower": 1e-4, "upper": 1e-1}}}
            if key == "scheduler":
                hyperopt["executor"] = {"type": "ray", "scheduler": block[key]}
            elif key == "parameters":
                hyperopt["parameters"] = block[key]
            else:
                hyperopt[key] = block[key]
            config["hyperopt"] = hyperopt
            return config, "ecd"

    for key in ("adapter", "prompt", "quantization", "generation", "model_parameters", "base_model"):
        if key in block:
            config = base("llm")
            config[key] = block[key]
            return config, "llm"

    if "defaults" in block:
        config = base("ecd")
        config["defaults"] = block["defaults"]
        return config, "ecd"

    if "backend" in block:
        config = base("ecd")
        config["backend"] = block["backend"]
        return config, "ecd"

    return None


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("expanded", help="JSON produced by validate-snippets.mjs --emit-expanded")
    parser.add_argument("--stub-heavy-deps", action="store_true")
    parser.add_argument("--package-path", default=None)
    parser.add_argument("--verbose", "-v", action="store_true")
    args = parser.parse_args(argv)

    if args.stub_heavy_deps:
        install_stubs(args.package_path)
    elif args.package_path:
        sys.path.insert(0, args.package_path)

    import yaml
    from ludwig.config_validation.validation import check_schema

    entries = json.load(open(args.expanded))
    checked = skipped = 0
    failures = []

    for entry in entries:
        if any(entry["file"].endswith(name) for name in UNVALIDATABLE_FILES):
            skipped += 1
            continue
        try:
            block = yaml.safe_load(entry["yaml"])
        except Exception as exc:
            failures.append((entry, f"YAML parse: {exc}"))
            continue
        if not isinstance(block, dict):
            skipped += 1
            continue

        built = build_config(entry, block)
        if built is None:
            skipped += 1
            continue
        config, _ = built

        checked += 1
        try:
            check_schema(config)
        except Exception as exc:
            message = " ".join(str(exc).split())
            failures.append((entry, message[:300]))

    print(f"checked {checked}, skipped {skipped}, failed {len(failures)}")
    for entry, message in failures if args.verbose else failures[:25]:
        print(f"  FAIL {entry['file']} > {entry['name']}\n       {message}")
    if failures and not args.verbose and len(failures) > 25:
        print(f"  ... and {len(failures) - 25} more (use --verbose)")

    return 1 if failures else 0


if __name__ == "__main__":
    sys.exit(main())
