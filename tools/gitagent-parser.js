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

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function coerceYamlValue(value) {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

function parseSimpleYaml(raw) {
  const lines = raw.split(/\r?\n/);
  const result = {};
  const stack = [{ indent: -1, container: result, kind: "object" }];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) {
      continue;
    }

    const indent = line.match(/^ */)[0].length;
    const trimmed = line.trim();

    while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
      stack.pop();
    }

    const current = stack[stack.length - 1];

    if (trimmed.startsWith("- ")) {
      if (current.kind === "array") {
        current.container.push(coerceYamlValue(trimmed.slice(2)));
      }
      continue;
    }

    const keyMatch = trimmed.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!keyMatch || current.kind !== "object") {
      continue;
    }

    const [, key, value] = keyMatch;
    if (value) {
      current.container[key] = coerceYamlValue(value);
      continue;
    }

    let childKind = "object";
    for (let j = i + 1; j < lines.length; j += 1) {
      const lookahead = lines[j];
      if (!lookahead.trim() || lookahead.trim().startsWith("#")) {
        continue;
      }
      const lookaheadIndent = lookahead.match(/^ */)[0].length;
      if (lookaheadIndent <= indent) {
        break;
      }
      childKind = lookahead.trim().startsWith("- ") ? "array" : "object";
      break;
    }

    if (childKind === "array") {
      current.container[key] = [];
      stack.push({ indent, container: current.container[key], kind: "array" });
    } else {
      current.container[key] = {};
      stack.push({ indent, container: current.container[key], kind: "object" });
    }
  }

  return result;
}

function parseMarkdownSections(raw) {
  const lines = raw.split(/\r?\n/);
  const sections = [];
  let current = null;

  for (const line of lines) {
    const header = line.match(/^##\s+(.+)$/);
    if (header) {
      if (current) {
        current.content = current.content.join("\n").trim();
        sections.push(current);
      }
      current = {
        heading: header[1].trim(),
        content: [],
      };
      continue;
    }

    if (current) {
      current.content.push(line);
    }
  }

  if (current) {
    current.content = current.content.join("\n").trim();
    sections.push(current);
  }

  return sections;
}

function parseSkillFrontmatter(raw) {
  const frontmatterMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch) {
    return { metadata: {}, body: raw };
  }

  const frontmatter = frontmatterMatch[1];
  const parsed = {};
  const lines = frontmatter.split(/\r?\n/);
  let currentNested = null;

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith("#")) {
      continue;
    }

    const nested = line.match(/^\s{2}([A-Za-z0-9_-]+):\s*(.*)$/);
    if (nested && currentNested) {
      parsed[currentNested][nested[1]] = coerceYamlValue(nested[2]);
      continue;
    }

    const top = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!top) {
      continue;
    }

    const [, key, value] = top;
    if (!value) {
      parsed[key] = {};
      currentNested = key;
    } else {
      parsed[key] = coerceYamlValue(value);
      currentNested = null;
    }
  }

  const body = raw.slice(frontmatterMatch[0].length).trim();
  return { metadata: parsed, body };
}

async function findSkillFiles(skillsRoot) {
  const out = [];

  async function walk(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const abs = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(abs);
        continue;
      }
      if (entry.isFile() && entry.name === "SKILL.md") {
        out.push(abs);
      }
    }
  }

  if (await exists(skillsRoot)) {
    await walk(skillsRoot);
  }

  return out;
}

async function readTextIfExists(filePath) {
  if (!(await exists(filePath))) {
    return null;
  }
  return fs.readFile(filePath, "utf8");
}

async function main() {
  const input = await readStdinJson();
  const rootInput = typeof input.root === "string" && input.root.trim() ? input.root.trim() : ".";
  const includeSkills = input.include_skills !== false;

  const rootAbs = path.resolve(process.cwd(), rootInput);
  const manifestPath = path.join(rootAbs, "agent.yaml");
  const soulPath = path.join(rootAbs, "SOUL.md");
  const rulesPath = path.join(rootAbs, "RULES.md");

  const manifestRaw = await readTextIfExists(manifestPath);
  const soulRaw = await readTextIfExists(soulPath);
  const rulesRaw = await readTextIfExists(rulesPath);

  const result = {
    root: normalize(path.relative(process.cwd(), rootAbs)) || ".",
    manifest: manifestRaw ? {
      path: "agent.yaml",
      parsed: parseSimpleYaml(manifestRaw),
    } : null,
    soul: soulRaw ? {
      path: "SOUL.md",
      sections: parseMarkdownSections(soulRaw),
    } : null,
    rules: rulesRaw ? {
      path: "RULES.md",
      sections: parseMarkdownSections(rulesRaw),
    } : null,
    skills: [],
  };

  if (includeSkills) {
    const skillsRoot = path.join(rootAbs, "skills");
    const skillFiles = await findSkillFiles(skillsRoot);
    for (const absPath of skillFiles) {
      const raw = await fs.readFile(absPath, "utf8");
      const parsed = parseSkillFrontmatter(raw);
      const rel = normalize(path.relative(rootAbs, absPath));
      result.skills.push({
        name: typeof parsed.metadata.name === "string" ? parsed.metadata.name : null,
        path: rel,
        description: typeof parsed.metadata.description === "string" ? parsed.metadata.description : null,
        metadata: parsed.metadata,
      });
    }
  }

  process.stdout.write(JSON.stringify(result, null, 2));
}

main();
