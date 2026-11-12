import assert from "node:assert/strict";
import test from "node:test";
import { ATTACK_SCENARIOS } from "../lab/llm-agent-security/engine.ts";
import { paletteFindings } from "./palette-data.ts";

test("palette findings match the lab scenarios", () => {
  assert.equal(paletteFindings.length, ATTACK_SCENARIOS.length);
  for (const scenario of ATTACK_SCENARIOS) {
    const row = paletteFindings.find((item) => item.index === scenario.index);
    assert.ok(row, scenario.index);
    assert.equal(row?.title, scenario.title);
    assert.equal(scenario.cvssScore.startsWith(row?.cvss ?? ""), true);
  }
  assert.deepEqual(
    paletteFindings.map((item) => item.cvss),
    ["8.1", "7.5", "7.5", "8.6", "7.3"],
  );
});
