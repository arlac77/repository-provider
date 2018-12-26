import test from "ava";
import { join, dirname } from "path";
import { createReadStream } from "fs";
import { Stream } from "stream";
import { Entry } from "content-entry/src/entry";
import { fileURLToPath } from "url";

const here = dirname(fileURLToPath(import.meta.url));
const file1 = join(here, "..", "tests", "fixtures", "file1.txt");

test("entry create", t => {
  const entry = new Entry("somewhere");
  t.is(entry.name, "somewhere");
  t.is(entry.type, "blob");
  t.is(entry.mode, "100644");
  //  t.true(entry.isFile);
  //  t.false(entry.isDirectory);
});

test("entry alter entry", t => {
  const entry = new Entry("somewhere");
  entry.content = "new content";
  t.is(entry.content, "new content");
});

test("entry json", t => {
  const entry = new Entry("somewhere");
  entry.sha = "12345";

  t.deepEqual(JSON.parse(JSON.stringify(entry)), {
    name: "somewhere",
    type: "blob",
    mode: "100644",
    sha: "12345"
  });
});

test("entry create invalid name", t => {
  t.throws(() => new Entry("/somewhere"), TypeError);
  t.throws(() => new Entry("somewhere\\abc"), TypeError);
});

test("entry create as Directory", t => {
  const entry = new Entry("somewhere", undefined, "tree");
  t.is(entry.name, "somewhere");
  //t.true(entry.isDirectory);
  //t.false(entry.isFile);
});

test("entry create from Buffer", async t => {
  const entry = new Entry("somewhere", Buffer.from("abc", "utf-8"));
  t.is(entry.content.toString("utf-8"), "abc");
  t.is(await entry.getString(), "abc");
  t.deepEqual(
    (await entry.getReadStream()).read(),
    Buffer.from("abc", "utf-8")
  );
  //t.true(entry.isFile);
  //t.false(entry.isDirectory);
});

test("entry create from stream", async t => {
  const entry = new Entry("somewhere", createReadStream(file1));
  t.true((await entry.getReadStream()) instanceof Stream);
  //t.true(entry.isFile);
  //t.false(entry.isDirectory);
});

test("entry equals Buffer", async t => {
  const entrya = new Entry("somewhere", Buffer.from("A"));

  t.true(await entrya.equals(entrya));
  t.false(await entrya.equals(undefined));

  const entrya2 = new Entry("somewhere", Buffer.from("A"));
  t.true(await entrya.equals(entrya2));

  const entryb = new Entry("somewhere", Buffer.from("B"));
  t.false(await entrya.equals(entryb));
});

test("entry equals String", async t => {
  const entrya = new Entry("somewhere", "A");

  t.true(await entrya.equals(entrya));
  t.false(await entrya.equals(undefined));

  const entrya2 = new Entry("somewhere", "A");
  t.true(await entrya.equals(entrya2));

  const entryb = new Entry("somewhere", "B");
  t.false(await entrya.equals(entryb));
});

test("entry equals Buffer <> String", async t => {
  const entrya = new Entry("somewhere", "A");

  t.true(await entrya.equals(entrya));

  const entrya2 = new Entry("somewhere", Buffer.from("A"));
  t.true(await entrya.equals(entrya2));

  const entryb = new Entry("somewhere", Buffer.from("B"));
  t.false(await entrya.equals(entryb));
});

test("entry equals ReadStream", async t => {
  const entrya = new Entry("file1.txt", createReadStream(file1));

  t.true(await entrya.equals(entrya));

  const entrya2 = new Entry("file1.txt", createReadStream(file1));
  t.true(await entrya.equals(entrya2));
});
