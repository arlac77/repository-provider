import test from "ava";
import { Milestone } from "repository-provider";

test("init Milestone", async t => {
  const owner = { _addMilestone: () => {} };
  const m = new Milestone(owner, "m1");

  t.is(m.owner, owner);
  t.is(m.name, "m1");
  t.is(m.displayName, "m1");
});
