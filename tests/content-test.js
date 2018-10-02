import test from "ava";
import { Content, emptyContent } from "../src/content";

test("create", t => {
  const content = new Content("somewhere");
  t.is(content.path, "somewhere");
  t.is(content.type, "blob");
  t.is(content.mode, "100644");
  t.true(content.isFile);
  t.false(content.isDirectory);
});

test("create invalid path", t => {
  t.throws(() => new Content("/somewhere"), TypeError);
  t.throws(() => new Content("somewhere\\abc"), TypeError);
});

test("create Directory", t => {
  const content = new Content("somewhere", undefined, "tree");
  t.is(content.path, "somewhere");
  t.true(content.isDirectory);
  t.false(content.isFile);
});

test("create from Buffer", t => {
  const content = new Content("somewhere", Buffer.from("abc", "utf-8"));
  t.is(content.content.toString("utf-8"), "abc");
  t.is(content.toString(), "abc");
  t.true(content.isFile);
  t.false(content.isDirectory);
});

test("create empty", t => {
  const content = emptyContent("somewhere", { encoding: "utf-8" });
  t.is(content.content.toString("utf-8"), "");
  t.is(content.toString(), "");
  t.true(content.isFile);
  t.false(content.isDirectory);
});

test("equals Buffer", t => {
  const contenta = new Content("somewhere", Buffer.from("A"));

  t.true(contenta.equals(contenta));
  t.false(contenta.equals(undefined));

  const contenta2 = new Content("somewhere", Buffer.from("A"));
  t.true(contenta.equals(contenta2));

  const contentb = new Content("somewhere", Buffer.from("B"));
  t.false(contenta.equals(contentb));
});

test("equals String", t => {
  const contenta = new Content("somewhere", "A");

  t.true(contenta.equals(contenta));
  t.false(contenta.equals(undefined));

  const contenta2 = new Content("somewhere", "A");
  t.true(contenta.equals(contenta2));

  const contentb = new Content("somewhere", "B");
  t.false(contenta.equals(contentb));
});
