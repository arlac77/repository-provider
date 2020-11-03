import test from "ava";
import { Issue } from "repository-provider";

test("init Issue", async t => {
  const owner = { _addIssue: () => {} };
  const i = new Issue(owner, "i1");

  t.is(i.name, "i1");
  t.is(i.displayName, "i1");
});
