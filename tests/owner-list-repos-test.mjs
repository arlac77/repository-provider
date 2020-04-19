import test from "ava";
import { Owner } from "../src/owner.mjs";

class CaseInsensitiveOwner extends Owner {
  normalizeRepositoryName(name,forLookup) {
    name = super.normalizeRepositoryName(name,forLookup);
    return forLookup ? name.toLowerCase() : name;
  }
}

async function olrt(t, factory, pattern, result) {
  const owner = await createOwner(factory);
  const found = [];

  for await (const r of owner.repositories(pattern)) {
    found.push(r.name);
  }

  t.deepEqual(found.sort(), result.sort());
}

olrt.title = (providedTitle = "", factory, pattern, result) =>
  `${factory.name} list repositories ${providedTitle} '${pattern}'`.trim();

async function createOwner(factory) {
  const owner = new factory();
  await owner.createRepository("r1#b1");
  await owner.createRepository("r2");
  await owner.createRepository("x");
  await owner.createRepository("Upper");
  return owner;
}

test(olrt, Owner, "r1", ["r1"]);
test(olrt, Owner, "r*", ["r1", "r2"]);
test(olrt, Owner, "*r*", ["r1", "r2", "Upper"]);
test(olrt, Owner, "*", ["r1", "r2", "x", "Upper"]);
test(olrt, Owner, undefined, ["r1", "r2", "x", "Upper"]);
test(olrt, Owner, "abc", []);
test(olrt, Owner, "", []);

test(olrt, CaseInsensitiveOwner, "*r*", [ "r1", "r2", "Upper" ]);

test("repository case insensitive", async t => {
  const owner = await createOwner(CaseInsensitiveOwner);
  t.is(await owner.repository("upper"), await owner.repository("Upper"));
});

test("repository case sensitive", async t => {
  const owner = await createOwner(Owner);
  t.is(await owner.repository("Upper"), await owner.repository("Upper"));
  t.is(await owner.repository("upper"), undefined);
});
