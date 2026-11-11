import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const files = [
  "src/components/site/RequestTrace.tsx",
  "src/components/site/AgentLabDemo.tsx",
  "src/components/site/DetectionsStream.tsx",
  "src/lib/trace.ts",
];

const banned = ["fetch(", "XMLHttpRequest", "WebSocket", "sendBeacon"];

for (const file of files) {
  test(`${file} does not touch the network`, () => {
    const src = readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
    for (const token of banned) {
      assert.equal(src.includes(token), false, `${file} contains ${token}`);
    }
  });
}
