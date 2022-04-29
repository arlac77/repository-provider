import test from "ava";
import { BaseObject } from "repository-provider";

test("object writableAttributes", t => {
  t.deepEqual(Object.keys(BaseObject.writableAttributes), [
    "description",
    "homePageURL"
  ]);
});

test("object base ics", t => {
  const b = new BaseObject();
  t.false(b.isWritable);
});
