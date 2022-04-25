import test from "ava";
import { Issue } from "repository-provider";

test("init Issue", async t => {
  let theIssue;

  const owner = { _addIssue: (issue) => { theIssue = issue; } };
  const i = new Issue(owner, "i1");

  t.is(theIssue, i);
  t.is(i.owner, owner);
  t.is(i.name, "i1");
  t.is(i.displayName, "i1");
});
