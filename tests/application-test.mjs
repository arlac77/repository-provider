import test from "ava";
import { Application } from "repository-provider";

test("init Application", async t => {
  const owner = { name: "o1", _addApplication: () => {} };
  const a1 = new Application(owner, "a1");

  t.is(a1.owner, owner);
  t.is(a1.name, "a1");
  t.is(a1.fullName, "o1/a1");
  t.is(a1.displayName, "a1");
});
