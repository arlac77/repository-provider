import test from "ava";
import { Milestone } from "repository-provider";

test("Milestone type", t => t.is(Milestone.type, "milestone"));
test("Milestone collection name", t =>
  t.is(Milestone.collectionName, "milestones"));

test("init Milestone", t => {
  let theMilestone;
  const owner = {
    provider: { name: "p1" },
    _addMilestone: milestone => {
      theMilestone = milestone;
    }
  };
  const m = new Milestone(owner, "m1");

  t.is(theMilestone, m);
  t.is(m.owner, owner);
  t.is(m.name, "m1");
  t.is(m.displayName, "m1");
});
