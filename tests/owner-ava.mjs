import test from "ava";
import { OwnedObject } from "repository-provider";

class myBranchClass {}
class myEntryClass {}
class myTagClass {}
class myHookClass {}
class myPullRequestClass {}
class myRepositoryClass {}

const owner = {
  api: "myAPI",
  provider: { name: "aProvider" },
  branchClass: myBranchClass,
  entryClass: myEntryClass,
  tagClass: myTagClass,
  hookClass: myHookClass,
  pullRequestClass: myPullRequestClass,
  repositoryClass: myRepositoryClass,
  _addOwnedObject: () => {}
};

test("OwnedObject api", t => {
  const object = new OwnedObject(owner, "aName");
  t.is(object.api, "myAPI");
});

test("OwnedObject name", t => {
  const object = new OwnedObject(owner, "aName");
  t.is(object.name, "aName");
});

test("OwnedObject provider", t => {
  const object = new OwnedObject(owner, "aName");
  t.is(object.provider.name, "aProvider");
});

test("OwnedObject branchClass", t =>
  t.is(new OwnedObject(owner, "aName").branchClass, myBranchClass));

test("OwnedObject entryClass", t =>
  t.is(new OwnedObject(owner, "aName").entryClass, myEntryClass));

test("OwnedObject tagClass", t =>
  t.is(new OwnedObject(owner, "aName").tagClass, myTagClass));

test("OwnedObject hookClass", t =>
  t.is(new OwnedObject(owner, "aName").hookClass, myHookClass));

test("OwnedObject pullRequestClass", t =>
  t.is(new OwnedObject(owner, "aName").pullRequestClass, myPullRequestClass));

test("OwnedObject repositoryClass", t =>
  t.is(new OwnedObject(owner, "aName").repositoryClass, myRepositoryClass));
