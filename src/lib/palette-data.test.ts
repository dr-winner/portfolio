import assert from "node:assert/strict";
import test from "node:test";
import { paletteFindings } from "./palette-data.ts";

test("palette findings keep the lab scenario list intact", () => {
  assert.equal(paletteFindings.length, 5);
  assert.deepEqual(
    paletteFindings.map((item) => item.index),
    ["01", "02", "03", "04", "05"],
  );
  assert.deepEqual(
    paletteFindings.map((item) => item.cvss),
    ["8.1", "7.5", "7.5", "8.6", "7.3"],
  );
  for (const row of paletteFindings) {
    assert.equal(row.href, "/work/llm-agent-security-lab");
    assert.equal(row.severity, "High");
    assert.ok(row.title.length > 0);
  }
});
