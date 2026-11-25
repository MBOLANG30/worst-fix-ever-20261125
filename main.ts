// Worst Fix Ever: Funniest Commit Message
// Writes a single commit-message line to /output/entry.txt.
// The line is a deadpan commit subject for a fix that backfired:
// the memory leak was "fixed" by removing the memory itself.
import { mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE = "fix: stop the memory leak by removing memory";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outFile = join(outDir, "entry.txt");

// Validate the line before writing anything.
if (LINE.length < 1 || LINE.length > 100) {
  throw new Error(`line must be 1-100 chars, got ${LINE.length}`);
}
if (LINE !== LINE.trim()) {
  throw new Error("line must not have leading or trailing whitespace");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("line must be a single line");
}
for (const ch of LINE) {
  if (ch.charCodeAt(0) < 0x20 || ch.charCodeAt(0) === 0x7f) {
    throw new Error("line must not contain control characters");
  }
}

mkdirSync(outDir, { recursive: true });
writeFileSync(outFile, LINE, "utf8");

// Read-back verification: byte-identical, no trailing newline.
const back = readFileSync(outFile, "utf8");
if (back !== LINE) {
  throw new Error("read-back mismatch: entry.txt does not match the line");
}
const byteLen = Buffer.byteLength(LINE, "utf8");
if (statSync(outFile).size !== byteLen) {
  throw new Error(
    `entry.txt is ${statSync(outFile).size} bytes, expected ${byteLen}`,
  );
}

console.log(`Wrote ${LINE.length} chars to ${outFile}: ${LINE}`);
