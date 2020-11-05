import test from "ava";
import { ownerTypeListTest } from "./helpers/repository-owner-test-support.mjs";
import {
  RepositoryOwner,
  NamedObject,
  Branch,
  Repository
} from "repository-provider";

class MyOwnerClass extends RepositoryOwner(NamedObject) {
  removeProviderBase(name) {
    return name;
  }
  get repositoryClass() {
    return Repository;
  }
}

const allRepositories = ["r1", "r2", "x", "yr2"];

function createOwner(names = allRepositories) {
  const owner = new MyOwnerClass();

  for (const name of names) {
    new Branch(owner.addRepository(name));
  }
  return owner;
}

test("RepositoryOwner create", t => {
  const owner = new MyOwnerClass();
  t.truthy(owner);
});

test(ownerTypeListTest, "repositories", createOwner(), "*", allRepositories);
test(
  ownerTypeListTest,
  "repositories",
  createOwner(),
  undefined,
  allRepositories
);
test(ownerTypeListTest, "repositories", createOwner(), ["r*"], ["r1", "r2"]);
test(ownerTypeListTest, "repositories", createOwner(), ["x*"], 1);
