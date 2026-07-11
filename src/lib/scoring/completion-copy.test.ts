import assert from "node:assert/strict";
import test from "node:test";
import {
  getCompletionMessage,
  getCompletionMissingItems,
  getCompletionTitle,
} from "@/lib/scoring/completion-copy";

test("completion copy maps missing signals to Today anchors", () => {
  const items = getCompletionMissingItems(["sleep", "focus", "rest"]);

  assert.deepEqual(
    items.map((item) => item.href),
    ["#daily-checkin", "#timeline", "#timeline"]
  );
});

test("completion title reflects complete days", () => {
  const title = getCompletionTitle({
    state: "complete",
    isComplete: true,
    hasAnyData: true,
    missingSignals: [],
  });
  const message = getCompletionMessage({
    state: "complete",
    isComplete: true,
    hasAnyData: true,
    missingSignals: [],
  });

  assert.equal(title, "Day is complete");
  assert.match(message, /score/);
});
