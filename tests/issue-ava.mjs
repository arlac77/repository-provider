import test from "ava";
import { Issue } from "repository-provider";

test("Issue type", t => t.is(Issue.type, "issue"));
test("Issue collection name", t => t.is(Issue.collectionName, "issues"));

test("init Issue", t => {
  let theIssue;

  const owner = { _addIssue: (issue) => { theIssue = issue; } };
  const i = new Issue(owner, "i1");

  t.is(theIssue, i);
  t.is(i.owner, owner);
  t.is(i.name, "i1");
  t.is(i.displayName, "i1");
});
