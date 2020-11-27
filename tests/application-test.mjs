import test from "ava";
import { Application } from "repository-provider";

test("init Application", async t => {
  const owner = { _addApplication: () => {} };
  const i = new Application(owner, "a1");

  t.is(i.owner, owner);
  t.is(i.name, "a1");
  t.is(i.displayName, "a1");
});
