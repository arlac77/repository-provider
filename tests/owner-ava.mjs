import test from "ava";
import { OwnedObject } from "repository-provider";

const owner = {
  api: "myAPI",
  provider: { name: "aProvider" },
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
