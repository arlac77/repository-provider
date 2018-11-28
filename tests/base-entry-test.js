import test from "ava";
import { BaseEntry } from "../src/entry";

test("base entry create", t => {
  const entry = new BaseEntry("somewhere");
  t.is(entry.name, "somewhere");
});
