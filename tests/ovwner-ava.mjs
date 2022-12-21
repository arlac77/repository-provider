import test from "ava";
import { OwnedObject } from "repository-provider";

test("OwnedObject api", t => {
  const owner = { api: "myAPI", _addOwnedObject: () => {} };
  const b = new OwnedObject(owner, "aName");
  t.is(b.api, "myAPI");
});
