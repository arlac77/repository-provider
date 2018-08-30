import test from "ava";
import { Owner } from "../src/owner";
import { Provider } from "../src/provider";
import { Repository } from "../src/repository";
import { Branch } from "../src/branch";
import { Content } from "../src/content";

test("repository create with options", t => {
  const owner = new Owner();
  const repository = new Repository(owner, "r1", {
    description: "a description",
    id: "4711"
  });
  t.is(repository.owner, owner);
  t.is(repository.name, "r1");
  t.is(repository.fullName, "r1");
  t.is(repository.type, "git");
  t.is(repository.description, "a description");
  t.is(repository.id, "4711");
});

test("repository create without options", t => {
  const owner = new Owner();
  const repository = new Repository(owner, "r1");
  t.is(repository.owner, owner);
  t.is(repository.name, "r1");
  t.is(repository.fullName, "r1");
  t.is(repository.type, "git");
  t.is(repository.description, undefined);
});

test("repository normalize name", t => {
  const owner = new Owner();
  const repository = new Repository(owner, "r1#branch");
  t.is(repository.owner, owner);
  t.is(repository.name, "r1");
  t.is(repository.fullName, "r1");
});

test.only("repository classes", t => {
  const owner = new Provider();
  const repository = new Repository(owner, "r1#branch");
  t.is(repository.branchClass, Branch);
  t.is(repository.contentClass, Content);
});
