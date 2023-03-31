import test from "ava";
import { boolean_attribute } from "repository-provider";

test("boolean attribute", t => {
  t.true(boolean_attribute.writeable);
  t.false(boolean_attribute.default);
  t.is(boolean_attribute.type, "boolean");
});
