import test from "ava";
import { NamedObject } from "repository-provider";

test("name object init without options", t => {
  const no = new NamedObject("n1");

  t.is(no.name, "n1");
  t.is(no.toString(), "n1");
  t.is("" + no, "n1");

  t.is(no.displayName, "n1");
  t.deepEqual(no.toJSON(), {
    name: "n1"
  });
});

test("name object init with options", t => {
  const no = new NamedObject("n1", { description: "hello" });

  t.is(no.name, "n1");
  t.is(no.description, "hello");
  t.is(no.displayName, "n1");
  t.deepEqual(no.toJSON(), {
    name: "n1",
    description: "hello"
  });
});
