import test from "ava";
import { Owner } from "../src/owner.mjs";

class CaseInsensitiveOwner extends Owner {
  normalizeRepositoryName(name) {
    return super.normalizeRepositoryName(name).toLowerCase();
  }
}

async function olrt(t, owner, pattern, result) {
  owner = await owner;
  const found = [];

  for await (const r of owner.repositories(pattern)) {
    found.push(r.name);
  }

  t.deepEqual(found.sort(), result.sort());
}

olrt.title = (providedTitle = "", owner, pattern, result) =>
  `${owner.constructor.name} list repositories ${providedTitle} ${pattern}`.trim();

async function createOwner(factory) {
  const owner = new factory();
  await owner.createRepository("r1#b1");
  await owner.createRepository("r2");
  await owner.createRepository("x");
  await owner.createRepository("Yr2");
  return owner;
}

test(olrt, createOwner(Owner), "r1", ["r1"]);
test(olrt, createOwner(Owner), "r*", ["r1", "r2"]);
test(olrt, createOwner(Owner), "*r*", ["r1", "r2", "Yr2"]);
test(olrt, createOwner(Owner), "*", ["r1", "r2", "x", "Yr2"]);
test(olrt, createOwner(Owner), undefined, ["r1", "r2", "x", "Yr2"]);
test(olrt, createOwner(Owner), "abc", []);
test(olrt, createOwner(Owner), "", []);

test("Case sensitive", olrt, createOwner(CaseInsensitiveOwner), "*r*", [
  "r1",
  "r2",
  "yr2"
]);

test("repository case insensitive", async t => {
  const owner = await createOwner(CaseInsensitiveOwner);
  t.is(await owner.repository("yr2"), await owner.repository("Yr2"));
});

test("repository case sensitive", async t => {
  const owner = await createOwner(Owner);
  t.is(await owner.repository("Yr2"), await owner.repository("Yr2"));
  t.is(await owner.repository("yr2"), undefined);
});
