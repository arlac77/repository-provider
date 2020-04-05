import test from "ava";
import { Owner } from "../src/owner.mjs";

async function olrt(t, owner, pattern, result) {
  owner = await owner;
  const found = [];

  for await (const r of owner.repositories(pattern)) {
    found.push(r.name);
  }

  t.deepEqual(found.sort(), result.sort());
}

olrt.title = (providedTitle = "", owner, pattern, result) =>
  `owner list repositories ${providedTitle} ${pattern}`.trim();

async function createOwner() {
  const owner = new Owner();
  await owner.createRepository("r1");
  await owner.createRepository("r2");
  await owner.createRepository("x");
  await owner.createRepository("yr2");
  return owner;
}

test(olrt, createOwner(), "r1", ["r1"]);
test(olrt, createOwner(), "r*", ["r1", "r2", "yr2"]);
test(olrt, createOwner(), "*", ["r1", "r2", "x", "yr2"]);
test(olrt, createOwner(), "abc", []);
