import test from "ava";
import { OwnedObject } from "repository-provider";

class myBranchClass {}
class myEntryClass {}
class myTagClass {}
class myHookClass {}
class myPullRequestClass {}
class myRepositoryClass {}

const owner = {
  equals(other) {
    return this === other;
  },
  error(...args) {
    this._error = [...args];
  },
  warn(...args) {
    this._warn = [...args];
  },
  info(...args) {
    this._info = [...args];
  },
  trace(...args) {
    this._trace = [...args];
  },
  debug(...args) {
    this._debug = [...args];
  },

  name: "aOwner",
  api: "myAPI",
  provider: {
    name: "aProvider",
    equals(other) {
      return this === other;
    }
  },
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

test("OwnedObject equals", t => {
  const object = new OwnedObject(owner, "aName");
  t.true(object.equals(object));
  t.false(object.equals(undefined));
  t.false(object.equals("other"));

  const object2 = new OwnedObject(owner, "aName");
  t.true(object.equals(object2));

  const object3 = new OwnedObject(owner, "other name");
  t.false(object.equals(object3));
});

test("OwnedObject name", t => {
  const object = new OwnedObject(owner, "aName");
  t.is(object.name, "aName");
});

test("OwnedObject provider", t => {
  const object = new OwnedObject(owner, "aName");
  t.is(object.provider.name, "aProvider");
});

test("OwnedObject identifier", t => {
  const object = new OwnedObject(owner, "aName");
  t.is(object.identifier, "aProvider:aOwner/aName");
});

test("OwnedObject error", t => {
  const object = new OwnedObject(owner, "aName");
  object.error("error");

  t.deepEqual(owner._error, ["error"]);
});

test("OwnedObject warn", t => {
  const object = new OwnedObject(owner, "aName");
  object.warn("warn");

  t.deepEqual(owner._warn, ["warn"]);
});

test("OwnedObject info", t => {
  const object = new OwnedObject(owner, "aName");
  object.info("info");

  t.deepEqual(owner._info, ["info"]);
});

test("OwnedObject trace", t => {
  const object = new OwnedObject(owner, "aName");
  object.trace("trace");

  t.deepEqual(owner._trace, ["trace"]);
});

test("OwnedObject debug", t => {
  const object = new OwnedObject(owner, "aName");
  object.debug("debug");

  t.deepEqual(owner._debug, ["debug"]);
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
