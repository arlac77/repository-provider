import test from "ava";
import {
  ownerTypeListTest,
  ownerTypeLookupTest
} from "./helpers/repository-owner-test-support.mjs";
import {
  RepositoryOwner,
  NamedObject,
  Branch,
  Tag,
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

const allTags = ["r1#1.0.0", "r1#2.0.0", "r1#3.0.0"];

const allRepositories = [...new Set(withoutBranch(allBranches))];

function createOwner(names = [...allBranches, ...allTags]) {
  const owner = new MyOwnerClass();

  for (const name of names) {
    const [r, b] = name.split(/#/);

    const repo = owner.addRepository(r);

    if (b.match(/^[\d\.]+$/)) {
      new Tag(repo, b);
    } else {
      new Branch(repo, b);
    }
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
test.skip(
  ownerTypeListTest,
  "branches",
  createOwner(),
  "https://mydomain.com/*#*",
  allBranches
);

test(ownerTypeListTest, "tags", createOwner(), "r1#*", [
  "r1#1.0.0",
  "r1#2.0.0",
  "r1#3.0.0"
]);

test(ownerTypeLookupTest, "branch", createOwner(), "r1#master", "r1#master");
test(ownerTypeLookupTest, "branch", createOwner(), "r1#b1", "r1#b1");
test(ownerTypeLookupTest, "branch", createOwner(), "r1#notexisting", undefined);
test(ownerTypeLookupTest, "branch", createOwner(), "rx#master", undefined);
test(ownerTypeLookupTest, "branch", createOwner(), "r1", "r1#master");

test(ownerTypeLookupTest, "tag", createOwner(), "r1#1.0.0", "r1#1.0.0");
test(ownerTypeLookupTest, "tag", createOwner(), "r1#9.9.9", undefined);
test(ownerTypeLookupTest, "tag", createOwner(), "r1", undefined);
test(ownerTypeLookupTest, "tag", createOwner(), undefined, undefined);
