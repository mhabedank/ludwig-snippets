#!/usr/bin/env python3
"""Distil the Ludwig config surface into `tools/ludwig-surface.json`.

This is the only step that needs Ludwig itself. It exports Ludwig's own JSON
Schema (`ludwig.schema.export_schema`) and flattens it into the compact shape
that `generate-snippets.mjs` consumes, so day-to-day snippet work needs nothing
but Node.

Usage
-----
    pip install "ludwig==<version>"
    python tools/extract-ludwig-surface.py > tools/ludwig-surface.json

Ludwig pulls in torch and friends. If you only want to regenerate the surface,
`--stub-heavy-deps` replaces those imports with inert placeholders so the config
classes can be imported from a bare `pip download ludwig --no-deps` unpack:

    python tools/extract-ludwig-surface.py --stub-heavy-deps --package-path ./ludwig-pkg
"""

from __future__ import annotations

import argparse
import json
import sys

# Fields Ludwig fills in from preprocessing/runtime. Users never write them.
INTERNAL_PREFIX = "[internal]"

# Never offered as a snippet placeholder: either emitted literally or noise.
SKIP_FIELDS = {"type", "ludwig_version"}

FEATURE_ABBREV = {
    "binary": "bin",
    "number": "num",
    "category": "cat",
    "bag": "bag",
    "set": "set",
    "sequence": "seq",
    "text": "txt",
    "vector": "vec",
    "audio": "aud",
    "date": "dt",
    "h3": "h3",
    "image": "img",
    "timeseries": "ts",
    "anomaly": "anom",
    "category_distribution": "catdist",
}


def install_stubs(package_path: str | None) -> None:
    """Make torch/transformers/... importable as inert placeholders."""
    import abc
    import importlib.abc
    import importlib.machinery
    import types

    never_stub = {"ludwig"}

    class DummyMeta(abc.ABCMeta):
        """ABCMeta-derived so stub bases can be mixed with ABC."""

        _cache: dict = {}

        def __getattr__(cls, name):
            if name.startswith("__"):
                raise AttributeError(name)
            key = (cls.__name__, name)
            if key not in DummyMeta._cache:
                DummyMeta._cache[key] = DummyMeta(f"{cls.__name__}.{name}", (Dummy,), {})
            return DummyMeta._cache[key]

        def __call__(cls, *a, **k):
            return super().__call__()

        def __getitem__(cls, item):
            return cls

        def __or__(cls, other):
            return cls

        def __ror__(cls, other):
            return cls

    class Dummy(metaclass=DummyMeta):
        def __init__(self, *a, **k):
            pass

        def __getattr__(self, name):
            return Dummy

        def __call__(self, *a, **k):
            return Dummy()

        def __iter__(self):
            return iter(())

    class StubModule(types.ModuleType):
        def __getattr__(self, name):
            if name == "__version__":
                return "0.0.0"  # libraries version-gate on this at import time
            if name.startswith("__") and name.endswith("__"):
                raise AttributeError(name)
            value = sys.modules.get(f"{self.__name__}.{name}") or getattr(Dummy, name)
            setattr(self, name, value)
            return value

    class StubFinder(importlib.abc.MetaPathFinder, importlib.abc.Loader):
        def find_spec(self, fullname, path=None, target=None):
            if fullname.split(".")[0] in never_stub:
                return None
            # Appended last, so real modules always win; anything reaching here
            # is genuinely absent and safe to stub.
            return importlib.machinery.ModuleSpec(fullname, self, is_package=True)

        def create_module(self, spec):
            mod = StubModule(spec.name)
            mod.__path__ = []
            return mod

        def exec_module(self, module):
            pass

    if package_path:
        sys.path.insert(0, package_path)
    sys.meta_path.append(StubFinder())

    import torch

    torch.__version__ = "2.12.0"  # version gates should take the modern-torch branch
    torch.device = type("device", (Dummy,), {})  # a type: used in `str | torch.device`
    torch.cuda.is_available = lambda: False
    torch.cuda.device_count = lambda: 0
    torch.cuda.is_bf16_supported = lambda *a, **k: False
    torch.backends.mps.is_available = lambda: False
    torch.backends.mps.is_built = lambda: False
    torch.get_default_dtype = lambda: "float32"


def jsonable(value):
    """Coerce a schema default into something JSON can hold."""
    if isinstance(value, (str, int, float, bool)) or value is None:
        return value
    if isinstance(value, (list, tuple)):
        return [jsonable(v) for v in value]
    if isinstance(value, dict):
        return {str(k): jsonable(v) for k, v in value.items()}
    return None


def clean(node: dict, name: str) -> dict | None:
    """Reduce one JSON Schema property node to the bits a snippet needs."""
    if name in SKIP_FIELDS or not isinstance(node, dict):
        return None

    description = node.get("description") or ""
    if description.startswith(INTERNAL_PREFIX):
        return None

    types_ = node.get("type")
    nullable = False
    if isinstance(types_, list):
        nullable = "null" in types_
        types_ = next((t for t in types_ if t != "null"), types_[0] if types_ else None)
    elif types_ == "null":
        nullable = True

    field = {"type": types_}
    if nullable:
        # Only nullable fields can be written out as a literal `null`; for the
        # rest a null default means "block omitted", which a snippet must respect.
        field["nullable"] = True
    if "default" in node:
        field["default"] = jsonable(node["default"])
    if "enum" in node:
        field["enum"] = [jsonable(v) for v in node["enum"]]
    if description:
        field["description"] = " ".join(description.split())
    for bound in ("minimum", "maximum"):
        if bound in node:
            field[bound] = jsonable(node[bound])
    return field


def clean_props(props: dict) -> dict:
    out = {}
    for name, node in (props or {}).items():
        field = clean(node, name)
        if field is not None:
            out[name] = field
    return out


def branch_map(node: dict) -> dict:
    """Turn a list of `{if: {type: const}, then: {...}}` conds into {name: props}."""
    result = {}
    for cond in node.get("allOf", []) or []:
        try:
            key = cond["if"]["properties"]["type"]["const"]
        except (KeyError, TypeError):
            continue
        result[key] = clean_props(cond.get("then", {}).get("properties", {}))
    return result


def type_enum(node: dict) -> list:
    return list((node.get("properties", {}).get("type", {}) or {}).get("enum", []) or [])


def unwrap_nullable(node: dict) -> dict:
    """Optional blocks are modelled as `oneOf: [null, {...}]`; return the real branch."""
    if not isinstance(node, dict):
        return {}
    for key in ("oneOf", "anyOf"):
        branches = node.get(key)
        if not branches:
            continue
        merged = {k: v for k, v in node.items() if k not in ("oneOf", "anyOf")}
        for branch in branches:
            if not isinstance(branch, dict) or branch.get("type") == "null":
                continue
            if branch.get("type") == "object" or "properties" in branch or "allOf" in branch:
                merged.update(branch)
                return merged
            if "enum" in branch:
                # e.g. base_model: a shortlist of known names or any HF model id.
                merged.setdefault("enum", branch["enum"])
        return merged
    return node


def selection_or_fields(node: dict) -> dict:
    """A node is either a `type:`-keyed selection of variants or a flat block."""
    node = unwrap_nullable(node)
    if not node:
        return {"fields": {}}
    if node.get("allOf"):
        return {"types": type_enum(node), "options": branch_map(node)}

    result = {"fields": clean_props(node.get("properties", {}))}
    types = type_enum(node)
    if types:
        result["types"] = types
    if node.get("enum"):
        result["values"] = [jsonable(v) for v in node["enum"]]
    return result


def feature_surface(items: dict, nested_keys: tuple[str, ...]) -> dict:
    """Build {feature_type: {common, <nested>: {...}}} from an items node."""
    surface = {}
    base_common = clean_props(items.get("properties", {}))

    for cond in items.get("allOf", []) or []:
        try:
            ftype = cond["if"]["properties"]["type"]["const"]
        except (KeyError, TypeError):
            continue
        then_props = cond.get("then", {}).get("properties", {})

        entry = {"common": dict(base_common)}
        for key, node in then_props.items():
            if key in nested_keys and isinstance(node, dict):
                # `encoder`/`decoder`/`loss` are always `type:`-selected, but
                # `preprocessing` is a flat block for most feature types.
                entry[key] = selection_or_fields(node)
            else:
                field = clean(node, key)
                if field is not None:
                    entry["common"][key] = field
        surface[ftype] = entry
    return surface


def build(schemas: dict) -> dict:
    ecd = schemas["ecd"]
    llm = schemas["llm"]

    surface = {
        "ludwig_version": ecd.get("description", "").split("v")[-1].rstrip(")"),
        "feature_abbrev": FEATURE_ABBREV,
        "models": {},
        "combiners": {},
        "trainer": {},
        "global_preprocessing": {},
        "splits": {},
        "hyperopt": {},
    }

    for model_type, schema in (("ecd", ecd), ("llm", llm)):
        props = schema.get("properties", {})
        surface["models"][model_type] = {
            "input_features": feature_surface(
                props.get("input_features", {}).get("items", {}), ("encoder", "preprocessing")
            ),
            "output_features": feature_surface(
                props.get("output_features", {}).get("items", {}), ("decoder", "loss")
            ),
            "top_level": {
                key: clean(node, key)
                for key, node in props.items()
                if key not in ("input_features", "output_features", "trainer", "hyperopt",
                               "preprocessing", "defaults", "combiner", "backend")
                and clean(node, key) is not None
            },
        }
        trainer_node = props.get("trainer", {})
        surface["trainer"][model_type] = selection_or_fields(trainer_node)

        # Nested trainer blocks the flat field list can only point at.
        unwrapped = unwrap_nullable(trainer_node)
        trainer_props = dict(unwrapped.get("properties", {}))
        # LLM trainers are a `type:` selection, so their real fields live in the
        # conditional branches rather than on the node itself.
        for cond in unwrapped.get("allOf", []):
            trainer_props.update(cond.get("then", {}).get("properties", {}))
        blocks = {}
        for key in ("optimizer", "learning_rate_scheduler", "gradient_clipping", "profiler"):
            if isinstance(trainer_props.get(key), dict):
                blocks[key] = selection_or_fields(trainer_props[key])
        surface.setdefault("trainer_blocks", {})[model_type] = blocks

    ecd_props = ecd.get("properties", {})
    surface["combiners"] = {
        "types": type_enum(ecd_props.get("combiner", {})),
        "options": branch_map(ecd_props.get("combiner", {})),
    }

    gp = ecd_props.get("preprocessing", {})
    surface["global_preprocessing"] = clean_props(gp.get("properties", {}))
    split = (gp.get("properties", {}) or {}).get("split", {})
    surface["splits"] = {"types": type_enum(split), "options": branch_map(split)}

    hyperopt_props = ecd_props.get("hyperopt", {}).get("properties", {})
    surface["hyperopt"] = {
        "fields": clean_props(hyperopt_props),
        "executor": selection_or_fields(hyperopt_props.get("executor", {})),
        "search_alg": selection_or_fields(hyperopt_props.get("search_alg", {})),
        "scheduler": selection_or_fields(
            (hyperopt_props.get("executor", {}).get("properties", {}) or {}).get("scheduler", {})
        ),
    }

    # LLM-only blocks live under the LLM schema's top level.
    llm_props = llm.get("properties", {})
    surface["llm"] = {
        key: selection_or_fields(llm_props[key])
        for key in ("prompt", "adapter", "quantization", "generation", "model_parameters", "base_model")
        if isinstance(llm_props.get(key), dict)
    }

    return surface


def backfill_defaults(surface: dict) -> tuple[int, int]:
    """Recover defaults that Ludwig's JSON Schema export drops.

    `OneOfOptionsField` (used for parameters that accept either a number or
    `auto`, among others) exports only a description, so the default is lost.
    The pydantic classes still carry it, so read it straight off `model_fields`
    instead of re-deriving the schema.
    """
    from pydantic_core import PydanticUndefined

    from ludwig.schema.combiners.utils import get_combiner_registry
    from ludwig.schema.decoders.utils import get_decoder_classes
    from ludwig.schema.encoders.utils import get_encoder_classes
    from ludwig.schema.features.loss import get_loss_classes, get_loss_cls
    from ludwig.schema.features.preprocessing.utils import preprocessing_registry
    from ludwig.schema.llms.peft import adapter_registry
    from ludwig.schema.lr_scheduler import LRSchedulerConfig
    from ludwig.schema.optimizers import optimizer_registry
    from ludwig.schema.trainer import get_llm_trainer_cls, trainer_schema_registry

    filled = [0]
    missing = [0]

    def apply(fields, cls):
        if not isinstance(fields, dict) or cls is None:
            return
        cls = cls[1] if isinstance(cls, tuple) else cls
        model_fields = getattr(cls, "model_fields", None) or {}
        for name, field in fields.items():
            if not isinstance(field, dict) or "default" in field:
                continue
            info = model_fields.get(name)
            if info is None:
                missing[0] += 1
                continue
            default = info.default
            if default is PydanticUndefined:
                factory = getattr(info, "default_factory", None)
                if factory is None:
                    missing[0] += 1
                    continue
                try:
                    default = factory()
                except Exception:
                    missing[0] += 1
                    continue
            if isinstance(default, (str, int, float, bool)) or default is None:
                field["default"] = default
                filled[0] += 1
            else:
                missing[0] += 1

    def apply_group(node, classes):
        for name, fields in (node or {}).get("options", {}).items():
            apply(fields, (classes or {}).get(name))

    for model_type, model in surface["models"].items():
        for ftype, entry in model["input_features"].items():
            try:
                apply_group(entry.get("encoder"), get_encoder_classes(model_type, ftype))
            except Exception:
                pass
            try:
                apply(entry.get("preprocessing", {}).get("fields"), preprocessing_registry.get(ftype))
            except Exception:
                pass
        for ftype, entry in model["output_features"].items():
            try:
                apply_group(entry.get("decoder"), get_decoder_classes(model_type, ftype))
            except Exception:
                pass
            try:
                losses = {name: get_loss_cls(ftype, name) for name in get_loss_classes(ftype)}
                apply_group(entry.get("loss"), losses)
            except Exception:
                pass

    apply_group(surface.get("combiners"), dict(get_combiner_registry()))
    apply(surface["trainer"]["ecd"].get("fields"), trainer_schema_registry.get("ecd"))
    for variant, fields in (surface["trainer"]["llm"].get("options") or {}).items():
        try:
            apply(fields, get_llm_trainer_cls(variant))
        except Exception:
            pass

    for model_type, blocks in surface.get("trainer_blocks", {}).items():
        apply_group(blocks.get("optimizer"), dict(optimizer_registry))
        apply(blocks.get("learning_rate_scheduler", {}).get("fields"), LRSchedulerConfig)

    apply_group(surface.get("llm", {}).get("adapter"), dict(adapter_registry))

    return filled[0], missing[0]


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--stub-heavy-deps", action="store_true",
                        help="Import Ludwig with torch/transformers/... replaced by inert stubs.")
    parser.add_argument("--package-path", default=None,
                        help="Directory containing an unpacked `ludwig` package to import from.")
    parser.add_argument("--output", "-o", default=None, help="Write here instead of stdout.")
    args = parser.parse_args(argv)

    if args.stub_heavy_deps:
        install_stubs(args.package_path)
    elif args.package_path:
        sys.path.insert(0, args.package_path)

    from ludwig.schema.export_schema import export_schema

    schemas = {}
    for model_type in ("ecd", "llm"):
        # Round-trip through JSON to drop anything unserialisable (stubbed
        # enum descriptions), which we do not use anyway.
        raw = export_schema(model_type)
        schemas[model_type] = json.loads(json.dumps(raw, default=lambda _: None))

    surface = build(schemas)
    filled, missing = backfill_defaults(surface)
    print(f"backfilled {filled} defaults the schema export dropped ({missing} left unresolved)",
          file=sys.stderr)
    text = json.dumps(surface, indent=1, sort_keys=True)

    if args.output:
        with open(args.output, "w") as fh:
            fh.write(text + "\n")
    else:
        print(text)


if __name__ == "__main__":
    main()
