import test from "ava";
import { Owner } from "../src/owner";
import { RepositoryGroup } from "../src/repository-group";

test.only("repository-group create with options", t => {
  const owner = new Owner();
  const rg = new RepositoryGroup(owner, "rg", {
    description: "a description",
    id: "4711"
  });
  t.is(rg.name, "rg");
  t.is(rg.description, "a description");
  t.is(rg.id, "4711");
});
