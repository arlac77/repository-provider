import test from "ava";
import { Project } from "repository-provider";

test("init Project", async t => {
  const owner = {  };
  const p = new Project(owner, "p1");

  t.is(p.owner, owner);
  t.is(p.name, "p1");
  t.is(p.displayName, "p1");
});