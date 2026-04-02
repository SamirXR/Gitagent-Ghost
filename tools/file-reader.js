#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";

async function readStdinJson() {
  let raw = "";
  for await (const chunk of process.stdin) {
    raw += chunk;
  }
  if (!raw.trim()) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function normalize(p) {
  return p.split(path.sep).join("/");
}

function ensureInsideRoot(rootAbs, targetAbs) {
  const rel = path.relative(rootAbs, targetAbs);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

async function readOne(rootAbs, relPath, maxBytes) {
  const targetAbs = path.resolve(rootAbs, relPath);
  if (!ensureInsideRoot(rootAbs, targetAbs)) {
    return {
      path: normalize(relPath),
      error: "Path escapes repository root",
    };
  }

  try {
    const stat = await fs.stat(targetAbs);
    if (!stat.isFile()) {
      return {
        path: normalize(relPath),
        error: "Not a file",
      };
    }

    const content = await fs.readFile(targetAbs, "utf8");
    const truncated = content.length > maxBytes;

    return {
      path: normalize(path.relative(rootAbs, targetAbs)),
      content: truncated ? content.slice(0, maxBytes) : content,
      size_bytes: Buffer.byteLength(content, "utf8"),
      truncated,
    };
  } catch (error) {
    return {
      path: normalize(relPath),
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  const input = await readStdinJson();
  const rootInput = typeof input.root === "string" && input.root.trim() ? input.root.trim() : ".";
  const rootAbs = path.resolve(process.cwd(), rootInput);

  const paths = Array.isArray(input.paths) && input.paths.length > 0
    ? input.paths.filter((p) => typeof p === "string" && p.trim())
    : ["agent.yaml", "SOUL.md", "RULES.md"];

  const maxBytes = Number.isInteger(input.max_bytes) && input.max_bytes > 0
    ? input.max_bytes
    : 200000;

  const files = [];
  for (const relPath of paths) {
    files.push(await readOne(rootAbs, relPath, maxBytes));
  }

  process.stdout.write(JSON.stringify({
    root: normalize(path.relative(process.cwd(), rootAbs)) || ".",
    files,
  }, null, 2));
}

main();
