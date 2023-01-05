import test from "ava";
import { BaseObject } from "repository-provider";

test("BaseObject writableAttributes", t => {
  t.deepEqual(Object.keys(BaseObject.writableAttributes), ["description"]);
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

test("BaseObject updateAttributes", async t => {
  const b = new BaseObject();
  b.updateAttributes({ description: "my new description" });
  t.is(b.description, "my new description");
});
