import test from "ava";
import { Application } from "repository-provider";

test("init Application", async t => {
  let theApp;
  const owner = { name: "o1", _addApplication: (app) => { theApp = app; } };
  const a1 = new Application(owner, "a1");

  t.is(theApp, a1);
  t.is(a1.owner, owner);
  t.is(a1.name, "a1");
  t.is(a1.fullName, "o1/a1");
  t.is(a1.displayName, "a1");
});
