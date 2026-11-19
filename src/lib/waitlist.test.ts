import test from "node:test";
import assert from "node:assert/strict";
import { getWaitlistCount, addWaitlistEntry } from "./waitlist.ts";
import { academyCohort } from "../content/academy.ts";
import { academyChapters } from "../content/academy-lessons.ts";

test("interactive academy studio curriculum integrity", () => {
  assert.equal(academyChapters.length, 3, "Curriculum must have 3 structured chapters");
  const allLessons = academyChapters.flatMap((ch) => ch.lessons);
  assert.equal(allLessons.length, 11, "Curriculum must feature 11 comprehensive lessons");

  for (const lesson of allLessons) {
    assert.ok(lesson.id, "Lesson must have an id");
    assert.ok(lesson.title, "Lesson must have a title");
    assert.ok(lesson.steps.length >= 4, `Lesson ${lesson.id} must have at least 4 steps`);
    for (const step of lesson.steps) {
      assert.ok(step.title, "Step must have title");
      assert.ok(step.explanation, "Step must have explanation");
      assert.ok(step.hudMetrics.length >= 4, "Step must have at least 4 HUD metrics");
      assert.ok(step.diff.length > 0, "Step must provide code/state diff");
    }
  }
});

test("academy cohort content integrity", () => {
  assert.equal(academyCohort.modules.length, 4, "Cohort must have 4 core modules");
  for (const mod of academyCohort.modules) {
    assert.ok(mod.id, "Module must have an id");
    assert.ok(mod.title, "Module must have a title");
    assert.ok(mod.domain, "Module must specify domain");
    assert.ok(mod.skills.length > 0, "Module must list skills");
    assert.ok(mod.labProject.deliverable, "Module must have a deliverable");
  }
  assert.ok(academyCohort.faqs.length >= 4, "Must have comprehensive FAQs");
});

test("waitlist count is seeded properly and responds", async () => {
  const count = await getWaitlistCount();
  assert.ok(typeof count === "number");
  assert.ok(count >= 24, "Seeded count should be at least 24");
});

test("addWaitlistEntry normalizes email and deduplicates", async () => {
  const testEmail = `test_engineer_${Date.now()}@example.com`;
  const res1 = await addWaitlistEntry({
    email: testEmail.toUpperCase(),
    name: "Alex Security",
    role: "Full-Stack Engineer",
    focus: "both",
    note: "Excited for AI security",
  });
  assert.equal(res1.success, true);
  assert.ok(!res1.alreadyExists);

  // Duplicate submission
  const res2 = await addWaitlistEntry({
    email: testEmail.toLowerCase(),
    name: "Alex Security",
  });
  assert.equal(res2.success, true);
  assert.equal(res2.alreadyExists, true);
});
