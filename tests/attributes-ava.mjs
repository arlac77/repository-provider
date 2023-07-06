import test from "ava";
import { boolean_attribute, boolean_read_only_attribute } from "repository-provider";

test("boolean attribute", t => {
  t.true(boolean_attribute.writable);
  t.false(boolean_attribute.default);
  t.is(boolean_attribute.type, "boolean");
});

test("boolean_read_only_attribute attribute", t => {
  t.false(boolean_read_only_attribute.writable);
  t.false(boolean_read_only_attribute.default);
  t.is(boolean_read_only_attribute.type, "boolean");
});
