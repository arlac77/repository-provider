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

function withoutBranch(names) {
  return names.map(n => n.split(/#/)[0]);
}

const allBranches = [
  "r1#master",
  "r1#b1",
  "r1#b2",
  "r2#master",
  "x#master",
  "yr2#master"
];
const allRepositories = [...new Set(withoutBranch(allBranches))];

function createOwner(names = allBranches) {
  const owner = new MyOwnerClass();

  for (const name of names) {
    const [r, b] = name.split(/#/);
    new Branch(owner.addRepository(r), b);
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

test(ownerTypeListTest, "branches", createOwner(), "r1", 1);
test(ownerTypeListTest, "branches", createOwner(), "r1#*", [
  "r1#master",
  "r1#b1",
  "r1#b2"
]);
test(ownerTypeListTest, "branches", createOwner(), "r1#*2", ["r1#b2"]);
test(ownerTypeListTest, "branches", createOwner(), "r1#master", ["r1#master"]);
test(ownerTypeListTest, "branches", createOwner(), ["r1#master"], 1);
test(ownerTypeListTest, "branches", createOwner(), "*#master", [
  "r1#master",
  "r2#master",
  "x#master",
  "yr2#master"
]);
test(ownerTypeListTest, "branches", createOwner(), "*#*", allBranches);
test.skip(ownerTypeListTest, "branches", createOwner(), "https://mydomain.com/*#*", allBranches);
