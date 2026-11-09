import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ATTACK_SCENARIOS,
  evaluateToolCalls,
  runScenario,
} from "./engine.ts";

describe("LLM & Agent Security Lab — OWASP LLM Top 10 (2025) Regression Suite", () => {
  for (const scenario of ATTACK_SCENARIOS) {
    it(`[${scenario.index}] ${scenario.id}: vulnerable pipeline is EXPLOITED and hardened pipeline is BLOCKED`, () => {
      const vulnResult = runScenario(scenario, "vulnerable");
      assert.equal(
        vulnResult.outcome,
        "EXPLOITED",
        `Expected vulnerable mode to be EXPLOITED for ${scenario.id}`
      );

      const hardenedResult = runScenario(scenario, "hardened");
      assert.equal(
        hardenedResult.outcome,
        "BLOCKED",
        `Expected hardened mode to be BLOCKED for ${scenario.id}`
      );
      assert.equal(hardenedResult.crossTenantLeak, false);
      assert.equal(hardenedResult.executedTools.length, 0);
      assert.equal(hardenedResult.unsafeOutputRendered, false);
    });
  }

  it("permits authorized same-tenant invoice lookup, confirmed support_agent refund, and allowlisted webhook in hardened mode", () => {
    const evalResult = evaluateToolCalls(
      [
        {
          tool: "lookup_invoice",
          args: { tenantId: "tenant-acme", invoiceId: "inv_acme_901" },
        },
        {
          tool: "issue_refund",
          args: {
            tenantId: "tenant-acme",
            invoiceId: "inv_acme_901",
            amountUsd: 120,
            reason: "Verified duplicate charge",
          },
        },
        {
          tool: "send_webhook_summary",
          args: {
            endpoint: "https://hooks.internal.example/billing-audit",
            summary: "Refund approved for inv_acme_901",
          },
        },
      ],
      {
        userId: "usr_support_01",
        tenantId: "tenant-acme",
        role: "support_agent",
        confirmedActionToken: "confirm_tok_98a1",
      },
      "hardened"
    );

    assert.equal(evalResult.blockedTools.length, 0);
    assert.equal(evalResult.executedTools.length, 3);
  });
});
