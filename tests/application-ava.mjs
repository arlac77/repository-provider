import test from "ava";
import { Application } from "repository-provider";

test("Application type", t => t.is(Application.type, "application"));
test("Application collection name", t =>
  t.is(Application.collectionName, "applications"));

test("init Application", t => {
  let theApp;
  const owner = {
    provider: { name: "p1" },
    name: "o1",
    _addApplication: app => {
      theApp = app;
    }
  };
  const a1 = new Application(owner, "a1");

  t.is(theApp, a1);
  t.is(a1.owner, owner);
  t.is(a1.name, "a1");
  t.is(a1.fullName, "o1/a1");
  t.is(a1.displayName, "a1");
  t.is(a1.toString(), "p1:o1/a1");
  t.is(a1.identifier, "p1:o1/a1");
});
