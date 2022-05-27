import test from "ava";
import { BaseObject } from "repository-provider";

test("BaseObject writableAttributes", t => {
  t.deepEqual(Object.keys(BaseObject.writableAttributes), [
    "description",
    "homePageURL"
  ]);
});

test("BaseObject isWritable", t => {
  const b = new BaseObject();
  t.false(b.isWritable);
});

test("BaseObject update", async t => {
  const b = new BaseObject();
  await b.update();
  t.true(true);
});

test("BaseOBject api", t => {
  const b = new BaseObject();
  b.owner = { api: "myAPI" };
  t.is(b.api, "myAPI");
});
