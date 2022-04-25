import test from "ava";
import { Milestone } from "repository-provider";

test("init Milestone", async t => {
  let theMilestone;
  const owner = { _addMilestone: ( milestone) => { theMilestone = milestone; } };
  const m = new Milestone(owner, "m1");

  t.is(theMilestone, m);
  t.is(m.owner, owner);
  t.is(m.name, "m1");
  t.is(m.displayName, "m1");
});
