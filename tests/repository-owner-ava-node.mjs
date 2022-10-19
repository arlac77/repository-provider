import test from "ava";
import {
  ownerTypeListTest,
  ownerTypeLookupTest
} from "repository-provider-test-support";
import {
  RepositoryOwner,
  Repository,
  NamedObject,
  Branch,
  Tag,
  Hook,
  PullRequest,
  Milestone,
  Project,
  Application
} from "repository-provider";

class MyOwnerClass extends RepositoryOwner(NamedObject) {
  get provider() {
    return { repositoryBases: ["https://mydomain.com/"] };
  }

  get repositoryClass() {
    return Repository;
  }

  get pullRequestClass() {
    return PullRequest;
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
const allRepositories = [...new Set(withoutBranch(allBranches)) /*,"r3"*/];
const allHooks = ["r1/h1", "r1/h2"];
const allPullRequests = ["r1/p1", "r1/p2"];
const allMilestones = ["r1/m1", "r1/m2"];
const allProjects = ["r1/p1", "r1/p2"];
const allApplications = ["r1/a1", "r1/a2"];

function createOwner(
  branches = allBranches,
  tags = allTags,
  pullRequests = allPullRequests,
  hooks = allHooks,
  milestones = allMilestones,
  projects = allProjects,
  applications = allApplications
) {
  const bm = {};
  const owner = new MyOwnerClass();

  for (const name of branches) {
    const [r, b] = name.split(/#/);
    const repository = owner.addRepository(r);
    if (b) {
      const bo = new Branch(repository, b);
      bm[bo.fullCondensedName] = bo;
    }
  }

  for (const name of tags) {
    const [r, b] = name.split(/#/);
    new Tag(owner.addRepository(r), b);
  }

  for (const name of hooks) {
    const [r, b] = name.split("/");
    new Hook(owner.addRepository(r), b);
  }

  for (const name of pullRequests) {
    const [b, p] = name.split("/");
    const branch = bm[b];
    const pr = new PullRequest( undefined, branch, p);
    branch.repository._addPullRequest(pr);
  }

  for (const name of milestones) {
    const [r, b] = name.split("/");
    new Milestone(owner.addRepository(r), b);
  }

  for (const name of projects) {
    const [r, b] = name.split("/");
    new Project(owner.addRepository(r), b);
  }

  for (const name of applications) {
    const [r, b] = name.split("/");
    new Application(owner.addRepository(r), b);
  }

  //console.log([...owner._repositories.get("r1")._pullRequests.keys()]);
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
test(ownerTypeListTest, "repositories", createOwner(), "x*#master", 1);

test(ownerTypeListTest, "branches", createOwner(), "r1", 1);
test(ownerTypeListTest, "branches", createOwner(), "r1#*", [
  "r1#master",
  "r1#b1",
  "r1#b2"
]);
test(ownerTypeListTest, "branches", createOwner(), "r1#*2", ["r1#b2"]);
test(ownerTypeListTest, "branches", createOwner(), "r1#master", ["r1#master"]);
test(
  ownerTypeListTest,
  "branches",
  createOwner(),
  "https://mydomain.com/r1#master",
  ["r1#master"]
);
test(ownerTypeListTest, "branches", createOwner(), ["r1#master"], 1);
test(ownerTypeListTest, "branches", createOwner(), "*#master", [
  "r1#master",
  "r2#master",
  "x#master",
  "yr2#master"
]);
test(ownerTypeListTest, "branches", createOwner(), "*#*", allBranches);
test(
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

test(ownerTypeListTest, "tags", createOwner(), "https://mydomain.com/r1#*", [
  "r1#1.0.0",
  "r1#2.0.0",
  "r1#3.0.0"
]);
test(ownerTypeListTest, "pullRequests", createOwner(), "r1/*", ["r1/p1"]);
test(ownerTypeListTest, "hooks", createOwner(), "r1/*", ["r1/h1"]);

test(ownerTypeLookupTest, "branch", createOwner(), "r1#master", "r1#master");
test(ownerTypeLookupTest, "branch", createOwner(), "r1#b1", "r1#b1");
test(ownerTypeLookupTest, "branch", createOwner(), "https://mydomain.com/r1#b1", "r1#b1");

test(ownerTypeLookupTest, "branch", createOwner(), "r1", "r1#master");
test(ownerTypeLookupTest, "branch", createOwner(), "https://mydomain.com/r1", "r1#master");
test(ownerTypeLookupTest, "branch", createOwner(), "r1#notexisting", undefined);
test(ownerTypeLookupTest, "branch", createOwner(), "rx#master", undefined);

test(ownerTypeLookupTest, "tag", createOwner(), "r1#1.0.0", "r1#1.0.0");
test(
  ownerTypeLookupTest,
  "tag",
  createOwner(),
  "https://mydomain.com/r1#1.0.0",
  "r1#1.0.0"
);

test(ownerTypeLookupTest, "tag", createOwner(), "r1#9.9.9", undefined);
test(ownerTypeLookupTest, "tag", createOwner(), "r1", undefined);
test(ownerTypeLookupTest, "tag", createOwner(), undefined, undefined);

test(ownerTypeLookupTest, "pullRequest", createOwner(), undefined, undefined);
test(ownerTypeLookupTest, "pullRequest", createOwner(), "r1/p1", "r1/p1");

test(ownerTypeLookupTest, "application", createOwner(), undefined, undefined);
test(ownerTypeLookupTest, "application", createOwner(), "r1/a1", "r1/a1");

test(ownerTypeLookupTest, "milestone", createOwner(), undefined, undefined);
test(ownerTypeLookupTest, "milestone", createOwner(), "r1/m1", "r1/m1");

test(ownerTypeLookupTest, "project", createOwner(), undefined, undefined);
test(ownerTypeLookupTest, "project", createOwner(), "r1/p1", "r1/p1");
