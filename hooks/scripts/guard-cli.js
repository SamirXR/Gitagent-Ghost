#!/usr/bin/env node

const blockedPatterns = [
  /rm\s+-rf/i,
  /git\s+reset\s+--hard/i,
  /del\s+\/f\s+\/s\s+\/q/i,
  /format\s+[a-z]:/i,
];

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
  const payload = await readStdinJson();
  const args = payload?.data?.arguments || payload?.data?.args || {};
  const command = typeof args.command === "string" ? args.command : "";

  for (const pattern of blockedPatterns) {
    if (pattern.test(command)) {
      process.stdout.write(JSON.stringify({
        action: "block",
        reason: "Blocked potentially destructive command.",
      }));
      return;
    }
  }

  process.stdout.write(JSON.stringify({ action: "allow" }));
}

main();
