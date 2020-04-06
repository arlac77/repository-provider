import test from "ava";
import { Owner } from "../src/owner.mjs";
import { RepositoryGroup } from "../src/group.mjs";
import { Repository } from "../src/repository.mjs";
import { Branch } from "../src/branch.mjs";
import { PullRequest } from "../src/pull-request.mjs";

test("repository-group create with options", t => {
  const owner = new Owner();
  const rg = new RepositoryGroup(owner, "rg", {
    description: "a description",
    id: "4711",
    uuid: "12345"
  });
  t.is(rg.name, "rg");
  t.is(rg.description, "a description");
  t.is(rg.id, "4711");
  t.is(rg.uuid, "12345");
  t.is(rg.toString(), "rg");
  t.deepEqual(rg.toJSON(), {
    name: "rg",
    uuid: "12345",
    id: "4711",
    description: "a description"
  });
});

test("repository-group classes", t => {
  const owner = new Owner();
  const rg = new RepositoryGroup(owner, "rg");

  t.is(rg.repositoryClass, Repository);
  t.is(rg.branchClass, Branch);
  t.is(rg.entryClass, undefined);
  t.is(rg.pullRequestClass, PullRequest);
});

test("repository-group add repo", async t => {
  const owner = new Owner();
  const rg = new RepositoryGroup(owner, "rg");

  const r1 = rg.addRepository("r1");
  t.is(await rg.repository("r1"), r1);
});
