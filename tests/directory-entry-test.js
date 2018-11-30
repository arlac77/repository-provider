import test from "ava";
import { BaseDirectoryEntry } from "../src/entry";

test("directory entry create", async t => {
  const entry = new BaseDirectoryEntry("somewhere");
  t.is(entry.name, "somewhere");
  t.true(entry.isDirectory);
  t.true((await entry.getTypes()).indexOf("public.directory") === 0);
});
