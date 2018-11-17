import test from "ava";
import { join, dirname } from "path";
import { createReadStream } from "fs";
import { Stream } from "stream";
import { Content, emptyContent } from "../src/content";
import { fileURLToPath } from "url";

const here = dirname(fileURLToPath(import.meta.url));
const file1 = join(here, "..", "tests", "fixtures", "file1.txt");

test("content create", t => {
  const content = new Content("somewhere");
  t.is(content.name, "somewhere");
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
  content.sha = "12345";

  t.deepEqual(JSON.parse(JSON.stringify(content)), {
    name: "somewhere",
    type: "blob",
    mode: "100644",
    sha: "12345"
  });
});

test("content create invalid name", t => {
  t.throws(() => new Content("/somewhere"), TypeError);
  t.throws(() => new Content("somewhere\\abc"), TypeError);
});

test("content create as Directory", t => {
  const content = new Content("somewhere", undefined, "tree");
  t.is(content.name, "somewhere");
  t.true(content.isDirectory);
  t.false(content.isFile);
});

test("content create from Buffer", async t => {
  const content = new Content("somewhere", Buffer.from("abc", "utf-8"));
  t.is(content.content.toString("utf-8"), "abc");
  t.is(content.toString(), "abc");
  t.deepEqual(
    (await content.getReadStream()).read(),
    Buffer.from("abc", "utf-8")
  );
  t.true(content.isFile);
  t.false(content.isDirectory);
});

test("content create from stream", async t => {
  const content = new Content("somewhere", createReadStream(file1));
  //  t.is(content.toString(), "abc");
  t.true((await content.getReadStream()) instanceof Stream);
  t.true(content.isFile);
  t.false(content.isDirectory);
});

test("content create empty", async t => {
  const content = emptyContent("somewhere", { encoding: "utf-8" });
  t.is(content.content.toString("utf-8"), "");
  t.is(content.toString(), "");
  t.is((await content.getReadStream()).read(), null);
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
  const contenta = new Content("file1.txt", createReadStream(file1));

  t.true(contenta.equals(contenta));

  const contenta2 = new Content("file1.txt", createReadStream(file1));
  t.true(contenta.equals(contenta2));
});
