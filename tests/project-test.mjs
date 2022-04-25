import test from "ava";
import { Project } from "repository-provider";

test("init Project", async t => {
  let theProject;
  const owner = { name: "o1", _addProject: (project) => { theProject = project; } };
  const p = new Project(owner, "p1");

  t.is(theProject, p);
  t.is(p.owner, owner);
  t.is(p.name, "p1");
  t.is(p.fullName, "o1/p1");
  t.is(p.displayName, "p1");
});
