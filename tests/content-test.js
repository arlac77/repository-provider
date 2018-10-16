import test from "ava";
import { join } from "path";
import { createReadStream } from "fs";
import { Content, emptyContent } from "../src/content";

test("content create", t => {
  const content = new Content("somewhere");
  t.is(content.path, "somewhere");
  t.is(content.type, "blob");
  t.is(content.mode, "100644");
  t.true(content.isFile);
  t.false(content.isDirectory);
});

test("content alter content", t => {
  const content = new Content("somewhere");
  content.content = "new content";
  t.is(content.content, "new content");
});

test("content json", t => {
  const content = new Content("somewhere");
  t.deepEqual(JSON.parse(JSON.stringify(content)), {
    path: "somewhere",
    type: "blob",
    mode: "100644"
  });
});

test("content create invalid path", t => {
  t.throws(() => new Content("/somewhere"), TypeError);
  t.throws(() => new Content("somewhere\\abc"), TypeError);
});

test("content create Directory", t => {
  const content = new Content("somewhere", undefined, "tree");
  t.is(content.path, "somewhere");
  t.true(content.isDirectory);
  t.false(content.isFile);
});

test("content create from Buffer", t => {
  const content = new Content("somewhere", Buffer.from("abc", "utf-8"));
  t.is(content.content.toString("utf-8"), "abc");
  t.is(content.toString(), "abc");
  t.true(content.isFile);
  t.false(content.isDirectory);
});

test("content create empty", t => {
  const content = emptyContent("somewhere", { encoding: "utf-8" });
  t.is(content.content.toString("utf-8"), "");
  t.is(content.toString(), "");
  t.true(content.isFile);
  t.false(content.isDirectory);
});

test("content equals Buffer", t => {
  const contenta = new Content("somewhere", Buffer.from("A"));

  t.true(contenta.equals(contenta));
  t.false(contenta.equals(undefined));

  const contenta2 = new Content("somewhere", Buffer.from("A"));
  t.true(contenta.equals(contenta2));

  const contentb = new Content("somewhere", Buffer.from("B"));
  t.false(contenta.equals(contentb));
});

test("content equals String", t => {
  const contenta = new Content("somewhere", "A");

  t.true(contenta.equals(contenta));
  t.false(contenta.equals(undefined));

  const contenta2 = new Content("somewhere", "A");
  t.true(contenta.equals(contenta2));

  const contentb = new Content("somewhere", "B");
  t.false(contenta.equals(contentb));
});

test("content equals Buffer <> String", t => {
  const contenta = new Content("somewhere", "A");

  t.true(contenta.equals(contenta));

  const contenta2 = new Content("somewhere", Buffer.from("A"));
  t.true(contenta.equals(contenta2));

  const contentb = new Content("somewhere", Buffer.from("B"));
  t.false(contenta.equals(contentb));
});

test("content equals ReadStream", t => {
  const contenta = new Content(
    "file1.txt",
    createReadStream(join(__dirname, "..", "tests", "fixtures", "file1.txt"))
  );

  t.true(contenta.equals(contenta));

  const contenta2 = new Content(
    "file1.txt",
    createReadStream(join(__dirname, "..", "tests", "fixtures", "file1.txt"))
  );
  t.true(contenta.equals(contenta2));
});
