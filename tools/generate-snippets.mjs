#!/usr/bin/env node
/**
 * Generate the whole snippet library from `tools/ludwig-surface.json`.
 *
 *   node tools/generate-snippets.mjs           # write snippets/ and package.json
 *   node tools/generate-snippets.mjs --check   # fail if anything is out of date
 *
 * The surface file is produced by `tools/extract-ludwig-surface.py` and is the
 * only thing that changes when Ludwig releases a new version. Nothing under
 * `snippets/` should be edited by hand.
 */

import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SNIPPETS_DIR = join(ROOT, "snippets");
const surface = JSON.parse(readFileSync(join(ROOT, "tools", "ludwig-surface.json"), "utf8"));

const ABBREV = surface.feature_abbrev;

/** Legacy prefixes from the hand-written library, kept so existing muscle memory still works. */
const LEGACY_ALIASES = {
  "ecd-config": ["bootstrap-ecd", "ecd"],
  "input-features": ["input-feature-list"],
  "output-features": ["output-feature-list"],
  "bag-enc-embed": ["bemb"],
  "cat-enc-dense": ["cdenc"],
  "cat-enc-sparse": ["csparse"],
  "global-preprocessing": ["gpp", "glo-pre"],
};

// --- snippet syntax helpers -------------------------------------------------

/** Escape text that sits in a snippet body outside of a placeholder. */
function escapeBody(text) {
  return String(text).replace(/\\/g, "\\\\").replace(/\$/g, "\\$").replace(/}/g, "\\}");
}

/** Escape one option inside a `${n|a,b|}` choice. */
function escapeChoice(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\$/g, "\\$")
    .replace(/,/g, "\\,")
    .replace(/\|/g, "\\|");
}

/**
 * Ludwig reads configs with PyYAML, i.e. YAML 1.1, which is stricter about
 * numbers than the YAML 1.2 parsers most editors use. Two traps matter here:
 * `0_5` is read as the integer 5 (underscore digit separator), and an exponent
 * float is only recognised with a decimal point *and* a signed exponent, so
 * `1e-12` silently becomes the string "1e-12".
 */
function yamlNumber(value) {
  const text = String(value);
  if (!/[eE]/.test(text)) return text;
  const [mantissa, exponent] = text.split(/[eE]/);
  const withPoint = mantissa.includes(".") ? mantissa : `${mantissa}.0`;
  const signed = /^[-+]/.test(exponent) ? exponent : `+${exponent}`;
  return `${withPoint}e${signed}`;
}

/** True when a bare string would be read back as something other than that string. */
function needsQuoting(text) {
  if (text === "") return true;
  if (/^(null|~|true|false|yes|no|on|off)$/i.test(text)) return true;
  if (/^[-+]?[0-9][0-9_]*$/.test(text) && text.includes("_")) return true; // 0_5 -> 5
  if (/^[-+]?[0-9.]+([eE][-+]?[0-9]+)?$/.test(text)) return true; // keep numeric look-alikes as text
  return /[^A-Za-z0-9_.\-/]/.test(text);
}

/** Render a JSON default as a YAML scalar. */
function yamlScalar(value) {
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean") return String(value);
  if (typeof value === "number") return yamlNumber(value);
  if (Array.isArray(value)) return `[${value.map(yamlScalar).join(", ")}]`;
  if (typeof value === "object") {
    const entries = Object.entries(value);
    if (!entries.length) return "{}";
    return `{${entries.map(([k, v]) => `${k}: ${yamlScalar(v)}`).join(", ")}}`;
  }
  const text = String(value);
  return needsQuoting(text) ? `'${text.replace(/'/g, "''")}'` : text;
}

/**
 * Build the placeholder for one field, so tabbing through a snippet offers the
 * real choices where Ludwig defines an enum and the real default otherwise.
 */
function placeholder(index, field) {
  const { enum: values, type, default: def } = field;

  if (Array.isArray(values) && values.length) {
    const options = values.map((v) => yamlScalar(v));
    const ordered = orderByDefault(options, def === undefined ? undefined : yamlScalar(def));
    return `\${${index}|${ordered.map(escapeChoice).join(",")}|}`;
  }

  if (type === "boolean") {
    const ordered = orderByDefault(["true", "false"], def === undefined ? undefined : String(def));
    return `\${${index}|${ordered.join(",")}|}`;
  }

  return `\${${index}:${escapeBody(yamlScalar(def))}}`;
}

/** Put the schema default first so pressing Enter keeps Ludwig's behaviour. */
function orderByDefault(options, rendered) {
  if (rendered === undefined) return options;
  const index = options.indexOf(rendered);
  return index <= 0
    ? options
    : [rendered, ...options.slice(0, index), ...options.slice(index + 1)];
}

/**
 * Not every schema field can be written as a scalar line.
 *
 * A `null` default on a non-nullable field means "this nested block is absent",
 * not "write null here" — Ludwig rejects the literal. A field with no default at
 * all is a nested block whose default is built by a factory (`optimizer`,
 * `postprocessor`, ...). Both have dedicated snippets of their own, so they are
 * dropped from the surrounding body rather than emitted as a bogus `null`.
 */
function isWritable([, field]) {
  if (!("default" in field)) return false;
  return !(field.default === null && !field.nullable);
}

/** Alphabetical, so a parameter is always in the same place across snippets. */
function orderFields(fields) {
  return Object.entries(fields)
    .filter(isWritable)
    .sort(([a], [b]) => a.localeCompare(b));
}

/**
 * Render a block of `key: value` lines at a given indent depth.
 * Returns the body lines and the next free tabstop index.
 */
function renderFields(fields, depth, startIndex) {
  const lines = [];
  let index = startIndex;
  for (const [name, field] of orderFields(fields)) {
    lines.push("\t".repeat(depth) + `${name}: ${placeholder(index++, field)}`);
  }
  return { lines, index };
}

// --- snippet builders -------------------------------------------------------

const files = new Map(); // relative path -> { [name]: snippet }

function addSnippet(file, name, prefixes, body, description) {
  if (!files.has(file)) files.set(file, {});
  const bucket = files.get(file);
  if (bucket[name]) throw new Error(`duplicate snippet name "${name}" in ${file}`);

  const canonical = Array.isArray(prefixes) ? prefixes[0] : prefixes;
  const all = [...(Array.isArray(prefixes) ? prefixes : [prefixes]), ...(LEGACY_ALIASES[canonical] || [])];

  bucket[name] = {
    prefix: all,
    body: [...body, "$0"],
    description,
  };
}

/**
 * Emit the minimal/full pair for a `type:`-selected block such as an encoder.
 *
 * Ludwig defaults every parameter of these blocks, so the minimal form is just
 * the `type:` line — which is exactly what you want when you know the encoder
 * and not its 30 knobs. The `-full` form lists every writable parameter.
 */
function addTypedBlock({ file, name, prefix, key, typeName, fields, description, depth = 1 }) {
  const head = key ? [`${key}:`, `${"\t".repeat(depth)}type: ${typeName}`] : [`type: ${typeName}`];

  addSnippet(file, name, prefix, head, description);

  const { lines } = renderFields(fields, key ? depth : 0, 1);
  if (lines.length) {
    addSnippet(
      file,
      `${name} (all parameters)`,
      `${Array.isArray(prefix) ? prefix[0] : prefix}-full`,
      [...head, ...lines],
      `${description} Includes every parameter with its Ludwig default.`
    );
  }
}

/** Emit a plain block of fields with no `type:` selector. */
function addFieldBlock({ file, name, prefix, key, fields, description, depth = 1 }) {
  const head = key ? [`${key}:`] : [];
  const { lines } = renderFields(fields, key ? depth : 0, 1);
  addSnippet(file, name, prefix, [...head, ...lines], description);
}

// --- 1. config scaffolds ----------------------------------------------------

function buildConfigScaffolds() {
  const file = "config.code-snippets";
  const inputTypes = Object.keys(surface.models.ecd.input_features).sort();
  const outputTypes = Object.keys(surface.models.ecd.output_features).sort();
  const inChoice = `\${2|${inputTypes.join(",")}|}`;
  const outChoice = `\${4|${outputTypes.join(",")}|}`;

  addSnippet(
    file,
    "ECD config",
    "ecd-config",
    [
      "model_type: ecd",
      "",
      "input_features:",
      `\t- name: \${1:input_column}`,
      `\t\ttype: ${inChoice}`,
      "",
      "output_features:",
      `\t- name: \${3:target_column}`,
      `\t\ttype: ${outChoice}`,
      "",
      "trainer:",
      "\tepochs: ${5:100}",
    ],
    "Starter ECD (Encoder-Combiner-Decoder) configuration."
  );

  const llmInput = Object.keys(surface.models.llm.input_features).sort();
  const llmOutput = Object.keys(surface.models.llm.output_features).sort();
  addSnippet(
    file,
    "LLM config",
    ["llm-config", "bootstrap-llm"],
    [
      "model_type: llm",
      "base_model: ${1:meta-llama/Llama-3.1-8B-Instruct}",
      "",
      "input_features:",
      `\t- name: \${2:prompt_column}`,
      `\t\ttype: \${3|${llmInput.join(",")}|}`,
      "",
      "output_features:",
      `\t- name: \${4:response_column}`,
      `\t\ttype: \${5|${llmOutput.join(",")}|}`,
      "",
      "prompt:",
      "\ttemplate: >-",
      "\t\t${6:Answer the question: {__sample__\\}}",
      "",
      "adapter:",
      "\ttype: ${7|lora,adalora,ia3|}",
      "",
      "trainer:",
      "\ttype: finetune",
      "\tepochs: ${8:3}",
    ],
    "Starter LLM fine-tuning configuration."
  );

  addSnippet(
    file,
    "Input feature list",
    "input-features",
    [
      "input_features:",
      `\t- name: \${1:column_1}`,
      `\t\ttype: ${inChoice}`,
      `\t- name: \${3:column_2}`,
      `\t\ttype: \${4|${inputTypes.join(",")}|}`,
    ],
    "Declare the input feature list."
  );

  addSnippet(
    file,
    "Output feature list",
    "output-features",
    [
      "output_features:",
      `\t- name: \${1:target_1}`,
      `\t\ttype: \${2|${outputTypes.join(",")}|}`,
    ],
    "Declare the output feature list."
  );

  addSnippet(
    file,
    "Backend: local",
    "backend-local",
    ["backend:", "\ttype: local"],
    "Run training in-process on the local machine."
  );

  addSnippet(
    file,
    "Backend: Ray",
    "backend-ray",
    [
      "backend:",
      "\ttype: ray",
      "\tcache_format: ${1|parquet,memory|}",
      "\tprocessor:",
      "\t\ttype: ${2|dask,modin|}",
      "\t\tparallelism: ${3:200}",
      "\ttrainer:",
      "\t\tstrategy: ${4|ddp,fsdp,horovod|}",
      "\t\tuse_gpu: ${5|true,false|}",
      "\t\tnum_workers: ${6:2}",
      "\t\tresources_per_worker:",
      "\t\t\tCPU: ${7:1}",
      "\t\t\tGPU: ${8:1}",
    ],
    "Distributed training and preprocessing on a Ray cluster."
  );
}

// --- 2. features ------------------------------------------------------------

function buildFeatures() {
  const file = "features.code-snippets";

  for (const [modelType, model] of Object.entries(surface.models)) {
    for (const [kind, group] of [
      ["input", model.input_features],
      ["output", model.output_features],
    ]) {
      for (const [ftype, entry] of Object.entries(group)) {
        const abbrev = ABBREV[ftype] || ftype.replace(/_/g, "-");
        const scope = modelType === "llm" ? "llm-" : "";
        const label = `${modelType.toUpperCase()} ${kind} feature: ${ftype}`;
        const prefix = `${scope}${abbrev}-${kind === "input" ? "in" : "out"}`;

        const common = { ...entry.common };
        delete common.name;
        delete common.column;

        const body = [`- name: \${1:${ftype}_column}`, `\ttype: ${ftype}`];
        const { lines } = renderFields(common, 1, 2);

        const article = /^[aeiou]/.test(ftype) ? "an" : "a";
        addSnippet(file, `${label}`, prefix, body, `Add ${article} ${ftype} ${kind} feature.`);
        if (lines.length) {
          addSnippet(
            file,
            `${label} (all parameters)`,
            `${prefix}-full`,
            [...body, ...lines],
            `Add ${article} ${ftype} ${kind} feature with every top-level parameter.`
          );
        }
      }
    }
  }
}

// --- 3. encoders / decoders / losses ---------------------------------------

function buildEncoders() {
  for (const [modelType, model] of Object.entries(surface.models)) {
    for (const [ftype, entry] of Object.entries(model.input_features)) {
      const options = entry.encoder?.options || {};
      const abbrev = ABBREV[ftype] || ftype;
      const scope = modelType === "llm" ? "llm-" : "";
      for (const [encoder, fields] of Object.entries(options)) {
        addTypedBlock({
          file: `encoders/${modelType === "llm" ? "llm-" : ""}${ftype}.code-snippets`,
          name: `${ftype} encoder: ${encoder}`,
          prefix: `${scope}${abbrev}-enc-${encoder.replace(/_/g, "-")}`,
          key: "encoder",
          typeName: encoder,
          fields,
          description: `\`${encoder}\` encoder for ${ftype} input features.`,
        });
      }
    }
  }
}

function buildDecoders() {
  for (const [modelType, model] of Object.entries(surface.models)) {
    for (const [ftype, entry] of Object.entries(model.output_features)) {
      const options = entry.decoder?.options || {};
      const abbrev = ABBREV[ftype] || ftype.replace(/_/g, "-");
      const scope = modelType === "llm" ? "llm-" : "";
      for (const [decoder, fields] of Object.entries(options)) {
        addTypedBlock({
          file: `decoders/${modelType === "llm" ? "llm-" : ""}${ftype}.code-snippets`,
          name: `${ftype} decoder: ${decoder}`,
          prefix: `${scope}${abbrev}-dec-${decoder.replace(/_/g, "-")}`,
          key: "decoder",
          typeName: decoder,
          fields,
          description: `\`${decoder}\` decoder for ${ftype} output features.`,
        });
      }
    }
  }
}

function buildLosses() {
  const file = "losses.code-snippets";
  const seen = new Set();

  for (const [modelType, model] of Object.entries(surface.models)) {
    for (const [ftype, entry] of Object.entries(model.output_features)) {
      const options = entry.loss?.options || {};
      const abbrev = ABBREV[ftype] || ftype.replace(/_/g, "-");
      for (const [loss, fields] of Object.entries(options)) {
        const name = `${ftype} loss: ${loss}`;
        if (seen.has(name)) continue; // ECD and LLM share loss definitions
        seen.add(name);
        addTypedBlock({
          file,
          name,
          prefix: `${abbrev}-loss-${loss.replace(/_/g, "-")}`,
          key: "loss",
          typeName: loss,
          fields,
          description: `\`${loss}\` loss for ${ftype} output features.`,
        });
      }
    }
  }
}

// --- 4. combiners -----------------------------------------------------------

function buildCombiners() {
  const file = "combiners.code-snippets";
  for (const [combiner, fields] of Object.entries(surface.combiners.options || {})) {
    addTypedBlock({
      file,
      name: `Combiner: ${combiner}`,
      prefix: `comb-${combiner.replace(/_/g, "-")}`,
      key: "combiner",
      typeName: combiner,
      fields,
      description: `\`${combiner}\` combiner.`,
    });
  }
}

// --- 5. preprocessing -------------------------------------------------------

function buildPreprocessing() {
  const file = "preprocessing.code-snippets";

  const global = { ...surface.global_preprocessing };
  delete global.split;
  addFieldBlock({
    file,
    name: "Global preprocessing",
    prefix: "global-preprocessing",
    key: "preprocessing",
    fields: global,
    description: "Dataset-level preprocessing: sampling, balancing and splitting.",
  });

  for (const [splitType, fields] of Object.entries(surface.splits.options || {})) {
    const { lines } = renderFields(fields, 2, 1);
    addSnippet(
      file,
      `Split: ${splitType}`,
      `split-${splitType}`,
      ["preprocessing:", "\tsplit:", `\t\ttype: ${splitType}`, ...lines],
      `\`${splitType}\` train/validation/test split.`
    );
  }

  for (const [ftype, entry] of Object.entries(surface.models.ecd.input_features)) {
    const abbrev = ABBREV[ftype] || ftype;
    const fields = entry.preprocessing?.fields || {};
    if (!Object.keys(fields).length) continue;

    // A few types (audio) also take a `type:` of their own inside preprocessing.
    const types = entry.preprocessing?.types || [];
    const head = ["preprocessing:"];
    let start = 1;
    if (types.length) {
      head.push(`\ttype: \${1|${types.join(",")}|}`);
      start = 2;
    }
    const { lines } = renderFields(fields, 1, start);

    addSnippet(
      file,
      `${ftype} preprocessing`,
      [`${ftype}-preprocessing`, `${abbrev}-pre`],
      [...head, ...lines],
      `Preprocessing options for ${ftype} features.`
    );
  }
}

// --- 6. trainer -------------------------------------------------------------

function buildTrainer() {
  const file = "trainer.code-snippets";

  const ecdFields = surface.trainer.ecd.fields || {};
  const commonKeys = [
    "epochs", "train_steps", "batch_size", "learning_rate", "early_stop",
    "optimizer", "validation_field", "validation_metric",
  ];
  const common = Object.fromEntries(
    commonKeys.filter((k) => k in ecdFields).map((k) => [k, ecdFields[k]])
  );

  // `optimizer` is a nested block, so render it inline rather than as a scalar.
  // Ludwig defaults to adam, so offer that first rather than whatever sorts first.
  const optimizers = orderByDefault(
    Object.keys(surface.trainer_blocks.ecd.optimizer?.options || {}).sort(),
    "adam"
  );
  const trainerBody = renderFields(common, 1, 1);
  addSnippet(
    file,
    "Trainer (ECD)",
    ["trainer", "trainer-ecd"],
    [
      "trainer:",
      ...trainerBody.lines,
      ...(optimizers.length
        ? ["\toptimizer:", `\t\ttype: \${${trainerBody.index}|${optimizers.join(",")}|}`]
        : []),
    ],
    "ECD trainer with the most commonly tuned parameters."
  );

  addFieldBlock({
    file,
    name: "Trainer (ECD, all parameters)",
    prefix: "trainer-ecd-full",
    key: "trainer",
    fields: ecdFields,
    description: "ECD trainer with every parameter and its Ludwig default.",
  });

  for (const [variant, fields] of Object.entries(surface.trainer.llm.options || {})) {
    addTypedBlock({
      file,
      name: `LLM trainer: ${variant}`,
      prefix: `llm-trainer-${variant}`,
      key: "trainer",
      typeName: variant,
      fields,
      description: `LLM \`${variant}\` trainer.`,
    });
  }

  const blocks = surface.trainer_blocks.ecd || {};
  for (const [optimizer, fields] of Object.entries(blocks.optimizer?.options || {})) {
    addTypedBlock({
      file,
      name: `Optimizer: ${optimizer}`,
      prefix: `opt-${optimizer.replace(/_/g, "-")}`,
      key: "optimizer",
      typeName: optimizer,
      fields,
      description: `\`${optimizer}\` optimizer.`,
    });
  }

  for (const [key, label, prefix] of [
    ["learning_rate_scheduler", "Learning rate scheduler", "lr-scheduler"],
    ["gradient_clipping", "Gradient clipping", "gradient-clipping"],
    ["profiler", "Profiler", "profiler"],
  ]) {
    const fields = blocks[key]?.fields || {};
    if (!Object.keys(fields).length) continue;
    addFieldBlock({
      file,
      name: label,
      prefix,
      key,
      fields,
      description: `${label} settings inside \`trainer\`.`,
    });
  }
}

// --- 7. hyperopt ------------------------------------------------------------

function buildHyperopt() {
  const file = "hyperopt.code-snippets";
  const fields = { ...surface.hyperopt.fields };
  for (const key of ["executor", "search_alg", "parameters"]) delete fields[key];

  const { lines, index } = renderFields(fields, 1, 1);
  addSnippet(
    file,
    "Hyperopt block",
    "hyperopt",
    [
      "hyperopt:",
      ...lines,
      "\tparameters:",
      `\t\t\${${index}:trainer.learning_rate}:`,
      "\t\t\tspace: loguniform",
      "\t\t\tlower: 0.0001",
      "\t\t\tupper: 0.1",
      "\texecutor:",
      "\t\ttype: ray",
      `\t\tnum_samples: \${${index + 1}:10}`,
      "\tsearch_alg:",
      `\t\ttype: \${${index + 2}|variant_generator,random,hyperopt,optuna,bayesopt|}`,
    ],
    "Hyperparameter optimization block."
  );

  const searchTypes = surface.hyperopt.search_alg.types || [];
  if (searchTypes.length) {
    addSnippet(
      file,
      "Hyperopt search algorithm",
      "hyperopt-search-alg",
      ["search_alg:", `\ttype: \${1|${searchTypes.join(",")}|}`],
      "Search algorithm for hyperopt."
    );
  }

  const executor = surface.hyperopt.executor.fields || {};
  if (Object.keys(executor).length) {
    const exec = { ...executor };
    delete exec.scheduler;
    addFieldBlock({
      file,
      name: "Hyperopt executor",
      prefix: "hyperopt-executor",
      key: "executor",
      fields: exec,
      description: "Ray Tune executor settings for hyperopt.",
    });
  }

  for (const [scheduler, fields] of Object.entries(surface.hyperopt.scheduler?.options || {})) {
    addTypedBlock({
      file,
      name: `Hyperopt scheduler: ${scheduler}`,
      prefix: `hyperopt-sched-${scheduler.replace(/_/g, "-")}`,
      key: "scheduler",
      typeName: scheduler,
      fields,
      description: `\`${scheduler}\` trial scheduler.`,
    });
  }

  // Search spaces are documented by Ray Tune rather than Ludwig's own schema.
  const spaces = [
    ["choice", ["\t\tspace: choice", "\t\tcategories: [${1:a}, ${2:b}]"]],
    ["uniform", ["\t\tspace: uniform", "\t\tlower: ${1:0.0}", "\t\tupper: ${2:1.0}"]],
    ["loguniform", ["\t\tspace: loguniform", "\t\tlower: ${1:0.0001}", "\t\tupper: ${2:0.1}"]],
    ["randint", ["\t\tspace: randint", "\t\tlower: ${1:1}", "\t\tupper: ${2:10}"]],
    ["grid_search", ["\t\tspace: grid_search", "\t\tvalues: [${1:1}, ${2:2}]"]],
  ];
  for (const [space, lines] of spaces) {
    addSnippet(
      file,
      `Hyperopt parameter: ${space}`,
      `hyperopt-space-${space.replace(/_/g, "-")}`,
      ["parameters:", "\t${3:trainer.learning_rate}:", ...lines],
      `\`${space}\` hyperopt search space.`
    );
  }
}

// --- 8. LLM blocks ----------------------------------------------------------

function buildLLM() {
  const file = "llm.code-snippets";
  const llm = surface.llm || {};

  const presets = llm.base_model?.values || [];
  if (presets.length) {
    addSnippet(
      file,
      "LLM base model",
      "llm-base-model",
      [`base_model: \${1:${presets[0]}}`],
      `Base model to fine-tune. Accepts a Hugging Face model id or a Ludwig preset (${presets.length} presets available).`
    );
  }

  for (const [adapter, fields] of Object.entries(llm.adapter?.options || {})) {
    addTypedBlock({
      file,
      name: `LLM adapter: ${adapter}`,
      prefix: `llm-adapter-${adapter.replace(/_/g, "-")}`,
      key: "adapter",
      typeName: adapter,
      fields,
      description: `\`${adapter}\` PEFT adapter.`,
    });
  }

  for (const [key, label, prefix] of [
    ["prompt", "LLM prompt", "llm-prompt"],
    ["quantization", "LLM quantization", "llm-quantization"],
    ["generation", "LLM generation", "llm-generation"],
    ["model_parameters", "LLM model parameters", "llm-model-parameters"],
  ]) {
    const fields = llm[key]?.fields || {};
    if (!Object.keys(fields).length) continue;
    addFieldBlock({
      file,
      name: label,
      prefix,
      key,
      fields,
      description: `${label} block.`,
    });
  }
}

// --- 9. defaults ------------------------------------------------------------

function buildDefaults() {
  const file = "defaults.code-snippets";
  for (const [ftype, entry] of Object.entries(surface.models.ecd.input_features)) {
    const abbrev = ABBREV[ftype] || ftype;
    const encoders = Object.keys(entry.encoder?.options || {});
    const fields = entry.preprocessing?.fields || {};
    const preprocessingLines = renderFields(fields, 3, 2).lines.slice(0, 6);

    const body = ["defaults:", `\t${ftype}:`];
    if (encoders.length) {
      body.push("\t\tencoder:", `\t\t\ttype: \${1|${encoders.join(",")}|}`);
    }
    if (preprocessingLines.length) {
      body.push("\t\tpreprocessing:", ...preprocessingLines);
    }

    addSnippet(
      file,
      `Defaults: ${ftype}`,
      `defaults-${abbrev}`,
      body,
      `Type-wide defaults applied to every ${ftype} feature.`
    );
  }
}

// --- write ------------------------------------------------------------------

function build() {
  buildConfigScaffolds();
  buildFeatures();
  buildEncoders();
  buildDecoders();
  buildLosses();
  buildCombiners();
  buildPreprocessing();
  buildTrainer();
  buildHyperopt();
  buildLLM();
  buildDefaults();
}

function renderFile(bucket) {
  const ordered = Object.fromEntries(Object.entries(bucket).sort(([a], [b]) => a.localeCompare(b)));
  return `${JSON.stringify(ordered, null, 2)}\n`;
}

/** A browsable index of every prefix, kept in sync with the snippets themselves. */
function renderReference() {
  const groups = new Map();
  for (const [file, bucket] of [...files.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const section = file.includes("/") ? file.split("/")[0] : file.replace(".code-snippets", "");
    if (!groups.has(section)) groups.set(section, []);
    for (const [name, snippet] of Object.entries(bucket)) {
      groups.get(section).push({ name, prefixes: snippet.prefix, description: snippet.description });
    }
  }

  const total = [...files.values()].reduce((sum, b) => sum + Object.keys(b).length, 0);
  const out = [
    "# Snippet reference",
    "",
    `Generated from Ludwig ${surface.ludwig_version} — ${total} snippets.`,
    "Do not edit by hand; run `npm run generate`.",
    "",
    "Most blocks come in two flavours: the bare prefix inserts only what Ludwig",
    "cannot infer, and the `-full` variant lists every parameter with its default.",
    "",
  ];

  const titles = {
    config: "Config scaffolds",
    features: "Features",
    encoders: "Encoders",
    decoders: "Decoders",
    losses: "Losses",
    combiners: "Combiners",
    preprocessing: "Preprocessing",
    trainer: "Trainer, optimizers and schedulers",
    hyperopt: "Hyperparameter optimization",
    llm: "LLM fine-tuning",
    defaults: "Type-wide defaults",
  };

  for (const [section, entries] of [...groups.entries()].sort(([a], [b]) => {
    const order = Object.keys(titles);
    return order.indexOf(a) - order.indexOf(b);
  })) {
    out.push(`## ${titles[section] || section} (${entries.length})`, "");
    out.push("| Prefix | Description |", "| --- | --- |");
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const prefixes = entry.prefixes.map((p) => `\`${p}\``).join(", ");
      out.push(`| ${prefixes} | ${entry.description.replace(/\|/g, "\\|")} |`);
    }
    out.push("");
  }

  return `${out.join("\n")}\n`;
}

function packageContribution() {
  return [...files.keys()]
    .sort()
    .map((file) => ({ language: "yaml", path: `./snippets/${file}` }));
}

function main() {
  const check = process.argv.includes("--check");
  build();

  const written = new Map();
  for (const [file, bucket] of files) written.set(join(SNIPPETS_DIR, file), renderFile(bucket));

  const pkgPath = join(ROOT, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.contributes = pkg.contributes || {};
  pkg.contributes.snippets = packageContribution();
  pkg.ludwig = { ...(pkg.ludwig || {}), generatedFrom: surface.ludwig_version };
  written.set(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  written.set(join(ROOT, "SNIPPETS.md"), renderReference());

  if (check) {
    let stale = 0;
    for (const [path, content] of written) {
      const current = existsSync(path) ? readFileSync(path, "utf8") : null;
      if (current !== content) {
        console.error(`out of date: ${relative(ROOT, path)}`);
        stale += 1;
      }
    }
    if (stale) {
      console.error(`\n${stale} file(s) out of date. Run: node tools/generate-snippets.mjs`);
      process.exit(1);
    }
    console.log("snippets are up to date");
    return;
  }

  // Generated output is fully owned by this script, so clear it first.
  if (existsSync(SNIPPETS_DIR)) rmSync(SNIPPETS_DIR, { recursive: true });
  for (const [path, content] of written) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }

  const total = [...files.values()].reduce((sum, bucket) => sum + Object.keys(bucket).length, 0);
  console.log(`Ludwig ${surface.ludwig_version}: ${total} snippets across ${files.size} files.`);
  for (const file of [...files.keys()].sort()) {
    console.log(`  ${file.padEnd(38)} ${Object.keys(files.get(file)).length}`);
  }
}

main();
