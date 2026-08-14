#!/usr/bin/env node
/**
 * Validate every snippet in `snippets/`.
 *
 *   npm test
 *
 * Checks, in order of how much they would hurt a user:
 *   1. each file is strict JSON (VS Code tolerates trailing commas, editors do not)
 *   2. each snippet has a prefix, a body and a description
 *   3. placeholder syntax is well formed and tabstops are contiguous from 1
 *   4. expanding the snippet with its defaults yields parseable YAML
 *   5. every key the snippet writes exists in Ludwig's schema for that block
 *
 * Check 5 is the one that catches the class of bug that made older snippets
 * emit configs Ludwig rejects (`weight_initializer` for `weights_initializer`,
 * `fc_layer` for `fc_layers`, and so on).
 */

import { readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SNIPPETS_DIR = join(ROOT, "snippets");
const surface = JSON.parse(readFileSync(join(ROOT, "tools", "ludwig-surface.json"), "utf8"));

const errors = [];
const fail = (where, message) => errors.push(`${where}: ${message}`);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    else if (entry.endsWith(".code-snippets")) out.push(path);
  }
  return out;
}

/** Undo snippet-body escaping. */
function unescape(text) {
  return text.replace(/\\([$}\\,|])/g, "$1");
}

/**
 * Expand a snippet body the way VS Code would if the user accepted every
 * default: choices collapse to their first option, placeholders to their text.
 */
function expand(body) {
  let text = body.join("\n");

  // ${n|a,b,c|} -> a   (commas inside options are escaped as \,)
  text = text.replace(/\$\{\d+\|((?:[^|\\]|\\.)*)\|\}/g, (_, options) => {
    const first = options.split(/(?<!\\),/)[0];
    return unescape(first);
  });

  // ${n:default} -> default, innermost first so nesting unwinds cleanly.
  let previous;
  do {
    previous = text;
    text = text.replace(/\$\{\d+:((?:[^{}\\]|\\.)*)\}/g, (_, value) => unescape(value));
  } while (text !== previous);

  text = text.replace(/\$\{\d+\}/g, "").replace(/\$0/g, "");
  text = unescape(text);
  return text.replace(/\t/g, "  ");
}

/** Collect the keys a snippet writes at each indent depth, per top-level block. */
function keysByBlock(yamlText) {
  const blocks = new Map();
  let current = null;
  for (const rawLine of yamlText.split("\n")) {
    const line = rawLine.replace(/\s+$/, "");
    if (!line.trim() || line.trim().startsWith("#")) continue;

    const indent = line.length - line.trimStart().length;
    const match = line.trim().match(/^-?\s*([A-Za-z_][A-Za-z0-9_]*):/);
    if (!match) continue;

    if (indent === 0) {
      current = match[1];
      if (!blocks.has(current)) blocks.set(current, new Set());
    } else if (current) {
      if (indent === 2) blocks.get(current).add(match[1]);
    }
  }
  return blocks;
}

/** Every field name Ludwig accepts for a given top-level block, across all types. */
function knownKeys(block) {
  const keys = new Set();
  const addFields = (node) => {
    if (!node) return;
    for (const name of Object.keys(node.fields || {})) keys.add(name);
    for (const option of Object.values(node.options || {})) {
      for (const name of Object.keys(option)) keys.add(name);
    }
  };

  switch (block) {
    case "encoder":
      for (const model of Object.values(surface.models))
        for (const feature of Object.values(model.input_features)) addFields(feature.encoder);
      break;
    case "decoder":
      for (const model of Object.values(surface.models))
        for (const feature of Object.values(model.output_features)) addFields(feature.decoder);
      break;
    case "loss":
      for (const model of Object.values(surface.models))
        for (const feature of Object.values(model.output_features)) addFields(feature.loss);
      break;
    case "combiner":
      addFields(surface.combiners);
      break;
    case "preprocessing":
      addFields({ fields: surface.global_preprocessing });
      for (const feature of Object.values(surface.models.ecd.input_features))
        addFields(feature.preprocessing);
      keys.add("split");
      break;
    case "trainer":
      for (const node of Object.values(surface.trainer)) addFields(node);
      break;
    case "optimizer":
      addFields(surface.trainer_blocks.ecd.optimizer);
      break;
    case "learning_rate_scheduler":
      addFields(surface.trainer_blocks.ecd.learning_rate_scheduler);
      break;
    case "gradient_clipping":
      addFields(surface.trainer_blocks.ecd.gradient_clipping);
      break;
    case "profiler":
      addFields(surface.trainer_blocks.ecd.profiler);
      break;
    case "hyperopt":
      addFields({ fields: surface.hyperopt.fields });
      break;
    case "executor":
      addFields(surface.hyperopt.executor);
      break;
    case "scheduler":
      addFields(surface.hyperopt.scheduler);
      break;
    case "search_alg":
      addFields(surface.hyperopt.search_alg);
      break;
    case "adapter":
    case "prompt":
    case "quantization":
    case "generation":
    case "model_parameters":
      addFields(surface.llm[block]);
      break;
    default:
      return null; // block we do not schema-check (scaffolds, defaults, ...)
  }

  keys.add("type");
  return keys;
}

function validateSnippet(where, name, snippet) {
  const prefixes = Array.isArray(snippet.prefix) ? snippet.prefix : [snippet.prefix];
  if (!prefixes.length || prefixes.some((p) => typeof p !== "string" || !p.trim()))
    fail(where, `"${name}" has an empty prefix`);
  if (!Array.isArray(snippet.body) || !snippet.body.length)
    fail(where, `"${name}" has an empty body`);
  if (!snippet.description) fail(where, `"${name}" has no description`);

  const body = snippet.body.join("\n");

  // Tabstops must run 1..n with no gaps, and $0 must appear exactly once.
  const stops = [...body.matchAll(/\$\{(\d+)[:|}]/g)].map((m) => Number(m[1]));
  const unique = [...new Set(stops)].filter((n) => n > 0).sort((a, b) => a - b);
  unique.forEach((stop, i) => {
    if (stop !== i + 1) fail(where, `"${name}" tabstop numbering jumps at \${${stop}}`);
  });
  if ((body.match(/\$0/g) || []).length !== 1) fail(where, `"${name}" must contain exactly one $0`);

  // Unbalanced braces mean the placeholder will render literally for the user.
  const opens = (body.match(/(?<!\\)\$\{/g) || []).length;
  const closes = (body.match(/(?<!\\)\}/g) || []).length;
  if (opens !== closes) fail(where, `"${name}" has ${opens} \${ but ${closes} unescaped }`);

  let yamlText;
  try {
    yamlText = expand(snippet.body);
    parseYaml(yamlText);
  } catch (error) {
    fail(where, `"${name}" does not expand to valid YAML: ${error.message}`);
    return prefixes;
  }

  for (const [block, used] of keysByBlock(yamlText)) {
    const known = knownKeys(block);
    if (!known) continue;
    for (const key of used) {
      if (!known.has(key)) fail(where, `"${name}" writes unknown ${block} key "${key}"`);
    }
  }

  return prefixes;
}

function main() {
  const files = walk(SNIPPETS_DIR).sort();
  if (!files.length) {
    console.error("no snippet files found");
    process.exit(1);
  }

  const prefixOwners = new Map();
  const expanded = [];
  let snippetCount = 0;

  for (const path of files) {
    const where = relative(ROOT, path);
    const raw = readFileSync(path, "utf8");

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (error) {
      fail(where, `invalid JSON: ${error.message}`);
      continue;
    }

    for (const [name, snippet] of Object.entries(parsed)) {
      snippetCount += 1;
      const prefixes = validateSnippet(where, name, snippet) || [];
      try {
        expanded.push({ file: where, name, yaml: expand(snippet.body) });
      } catch {
        // already reported by validateSnippet
      }
      for (const prefix of prefixes) {
        if (prefixOwners.has(prefix))
          fail(where, `prefix "${prefix}" already used by ${prefixOwners.get(prefix)}`);
        else prefixOwners.set(prefix, `${where} > ${name}`);
      }
    }
  }

  // package.json must list every snippet file, or VS Code silently ignores it.
  const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
  const contributed = new Set((pkg.contributes?.snippets || []).map((s) => s.path));
  for (const path of files) {
    const expected = `./snippets/${relative(SNIPPETS_DIR, path).split(/[\\/]/).join("/")}`;
    if (!contributed.has(expected)) fail("package.json", `does not contribute ${expected}`);
  }
  if (contributed.size !== files.length)
    fail("package.json", `contributes ${contributed.size} files but ${files.length} exist`);

  // `--emit-expanded <path>` feeds tools/verify-against-ludwig.py.
  const emitAt = process.argv.indexOf("--emit-expanded");
  if (emitAt !== -1 && process.argv[emitAt + 1]) {
    writeFileSync(process.argv[emitAt + 1], `${JSON.stringify(expanded, null, 1)}\n`);
    console.log(`wrote ${expanded.length} expanded snippets to ${process.argv[emitAt + 1]}`);
  }

  if (errors.length) {
    for (const error of errors) console.error(`  ${error}`);
    console.error(`\n${errors.length} problem(s) in ${snippetCount} snippets.`);
    process.exit(1);
  }

  console.log(
    `OK: ${snippetCount} snippets in ${files.length} files, ` +
      `${prefixOwners.size} unique prefixes, Ludwig ${surface.ludwig_version}.`
  );
}

main();
