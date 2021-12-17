import test from "ava";
import { BaseObject } from "repository-provider";

test("object writableAttributes", t => {
  t.deepEqual(Object.keys(BaseObject.writableAttributes), [
    "description",
    "homePageURL"
  ]);
});
