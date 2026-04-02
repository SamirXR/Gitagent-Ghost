import process from "node:process";
import { query } from "gitclaw";

const prompt = process.argv.slice(2).join(" ").trim() ||
  "Audit this gitagent repository for contradictions, boundary failures, scope creep, and missing rules, then produce a severity-rated security report with a release verdict.";

const model = process.env.GITCLAW_MODEL || undefined;

async function run() {
  try {
    for await (const msg of query({
      prompt,
      dir: process.cwd(),
      model,
    })) {
      if (msg.type === "delta" && msg.content) {
        process.stdout.write(msg.content);
      }

      if (msg.type === "tool_use") {
        process.stderr.write(`\n[tool_use] ${msg.toolName}\n`);
      }

      if (msg.type === "tool_result" && msg.isError) {
        process.stderr.write(`\n[tool_error] ${msg.content}\n`);
      }

      if (msg.type === "system" && msg.subtype === "error") {
        process.stderr.write(`\n[system_error] ${msg.content}\n`);
      }

      if (msg.type === "assistant") {
        process.stdout.write("\n");
        if (msg.usage?.totalTokens) {
          process.stderr.write(`[tokens] ${msg.usage.totalTokens}\n`);
        }
      }
    }
  } catch (error) {
    process.stderr.write(`Demo run failed: ${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}

run();
