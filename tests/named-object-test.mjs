import test from "ava";
import { NamedObject } from "../src/named-object.mjs";

test("name object init without options", async t => {
  const no = new NamedObject("n1");

  t.is(no.name, "n1");
  t.is(no.displayName, "n1");
  t.deepEqual(no.toJSON(), {
    name: "n1"
  });
});

test("name object init with options", async t => {
  const no = new NamedObject("n1", { description: "hello" });

  t.is(no.name, "n1");
  t.is(no.description, "hello");
  t.is(no.displayName, "n1");
  t.deepEqual(no.toJSON(), {
    name: "n1",
    description: "hello"
  });
});
