import test from "ava";
import { Content, emptyContent } from "../src/content";

test("create", t => {
  const content = new Content("somewhere");
  t.is(content.path, "somewhere");
  t.is(content.type, "blob");
  t.is(content.mode, "100644");
  t.false(content.isDirectory);
});

test("create Directory", t => {
  const content = new Content("somewhere", undefined, "tree");
  t.is(content.path, "somewhere");
  t.true(content.isDirectory);
});

test("create from Buffer", t => {
  const content = new Content("somewhere", Buffer.from("abc", "utf-8"));
  t.is(content.content.toString("utf-8"), "abc");
});

test("create empty", t => {
  const content = emptyContent("somewhere", { encoding: "utf-8" });
  t.is(content.content.toString("utf-8"), "");
});

test("equals", t => {
  const contenta = new Content("somewhere", Buffer.from('A'), "tree");

  t.true(contenta.equals(contenta));
  t.false(contenta.equals(undefined));

  const contenta2 = new Content("somewhere", Buffer.from('A'), "tree");
  t.true(contenta.equals(contenta2));

  const contentb = new Content("somewhere", Buffer.from('B'), "tree");
  t.false(contenta.equals(contentb));

});
