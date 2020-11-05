import test from "ava";
import { ownerTypeListTest } from "./helpers/repository-owner-test-support.mjs";
import {
  RepositoryOwner,
  NamedObject,
  Branch,
  Repository,
  stripBaseNames
} from "repository-provider";

class MyOwnerClass extends RepositoryOwner(NamedObject) {
  removeProviderBase(names) {
    return names ? stripBaseNames(names, ["https://mydomain.com/"]) : undefined;
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
test(
  ownerTypeListTest,
  "repositories",
  createOwner(),
  "https://mydomain.com/*",
  allRepositories
);

test(ownerTypeListTest, "repositories", createOwner(), ["r*"], ["r1", "r2"]);
test(ownerTypeListTest, "repositories", createOwner(), "x*", 1);
test.skip(ownerTypeListTest, "repositories", createOwner(), "x*#master", 1);

test(ownerTypeListTest, "branches", createOwner(), "r1#master", 1);
//test(ownerTypeListTest, "branches", createOwner(), ["r1#master"], 1);
