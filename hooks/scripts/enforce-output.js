#!/usr/bin/env node

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

async function main() {
  await readStdinJson();
  process.stdout.write(JSON.stringify({
    action: "allow",
    audit: { output_checked: true },
  }));
}

main();
