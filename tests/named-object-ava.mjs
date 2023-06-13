import test from "ava";
import { NamedObject } from "repository-provider";

test("name object init without options", t => {
  const no = new NamedObject("n1");

  t.is(no.name, "n1");
  t.is(no.fullName, "n1");
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

test.skip("name object set / get", t => {
  const no = new NamedObject("n1");

  no.name = "n2";
  t.is(no.name, "n2");
});
