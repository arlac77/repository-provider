import test from "ava";
import { Content } from "../src/content";

test("create", t => {
  const content = new Content("somewhere");
  t.is(content.path, "somewhere");
});
