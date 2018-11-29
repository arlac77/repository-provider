import test from "ava";
import { BaseDirecotryEntry } from "../src/entry";

test("directory entry create", async t => {
  const entry = new BaseDirecotryEntry("somewhere");
  t.is(entry.name, "somewhere");
  t.true(entry.isDirectory);
  t.true((await entry.getTypes()).indexOf('public.directory') === 0);
});
