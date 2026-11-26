// Funniest Lost Sock Status Update — make.fun entry
// Writes one original status update, in the voice of a lost sock,
// to /output/entry.txt and self-checks the competition gate:
// UTF-8 text, 1-120 characters, a single line, not only whitespace.
// Node 22+, standard library only. Deterministic: same bytes every run.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const ENTRY =
  "I am not lost. I am in witness protection under the washing machine. Do not tell my pair.";

const OUTPUT_PATH = "/output/entry.txt";

function charCount(text: string): number {
  // Count Unicode code points, not UTF-16 code units, so the gate
  // matches how the competition counts characters.
  return [...text].length;
}

function checkGate(text: string): string[] {
  const problems: string[] = [];
  const chars = charCount(text);
  if (chars < 1 || chars > 120) {
    problems.push(`length ${chars} is outside 1-120 characters`);
  }
  if (text.trim().length === 0) {
    problems.push("entry is only whitespace");
  }
  if (text.split("\n").length !== 1) {
    problems.push("entry must be exactly one line");
  }
  return problems;
}

function sha256Hex(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function main(): void {
  const problems = checkGate(ENTRY);
  if (problems.length > 0) {
    console.error(`gate check failed: ${problems.join("; ")}`);
    process.exit(1);
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  writeFileSync(OUTPUT_PATH, ENTRY, "utf8");

  const written = readFileSync(OUTPUT_PATH, "utf8");
  const roundTripProblems = checkGate(written);
  if (written !== ENTRY || roundTripProblems.length > 0) {
    console.error("verification failed: written file does not match the entry");
    process.exit(1);
  }

  console.log(`entry: ${written}`);
  console.log(`chars: ${charCount(written)}`);
  console.log(`sha256: ${sha256Hex(written)}`);
  console.log(`wrote ${OUTPUT_PATH}`);
}

main();
