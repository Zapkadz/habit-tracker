import assert from "node:assert/strict";
import test from "node:test";
import {
  validateOptionalText,
  validateRequiredText,
} from "@/lib/validation/text";

test("required text is trimmed and bounded", () => {
  assert.equal(validateRequiredText("  Study N2  ", "Habit name"), "Study N2");
  assert.throws(
    () => validateRequiredText("x", "Habit name"),
    /at least 2 characters/
  );
});

test("optional text rejects oversized notes", () => {
  assert.equal(validateOptionalText("  context  ", "Note"), "context");
  assert.throws(
    () => validateOptionalText("abcd", "Note", 3),
    /3 characters or fewer/
  );
});
