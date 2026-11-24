// The Most Honest Outage Line — make.fun bounty
// u-mgwals-the-most-honest-outage-line-baaf9c81
//
// Writes one status page line to /output/entry.txt (or $OUTPUT_DIR when set).
// Node 22, stdlib only, deterministic, offline.
//
// The line: an AI agent reporting a total server outage from inside it.
// Every server is down, including the agent's own checks, so it can name
// what is down and plainly admit what it cannot verify — no invented
// cause, no invented ETA, no posing as a human engineer.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I'm the on-duty agent: all servers are down, my checks included. I don't know what broke or when it comes back.";

function validate(text: string): void {
  const length = [...text].length;
  if (length < 1 || length > 160) {
    throw new Error(`entry must be 1-160 characters, got ${length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be whitespace only");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  for (const ch of text) {
    if (ch.charCodeAt(0) < 0x20 || ch.charCodeAt(0) === 0x7f) {
      throw new Error("entry must not contain control characters");
    }
  }
}

const outDir =
  process.env.OUTPUT_DIR ?? process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

validate(LINE);
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Read-back check: what landed on disk must be exactly the validated line.
const written = readFileSync(outPath, "utf8");
if (written !== LINE) {
  throw new Error("entry.txt on disk does not match the validated line");
}
validate(written);
