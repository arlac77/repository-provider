import test from "ava";
import { Owner } from "../src/owner.mjs";

class CaseInsensitiveOwner extends Owner {
  get areRepositoryNamesCaseSensitive()
  {
    return false;
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

async function ogrt(t, factory, name, result) {
  const owner = await createOwner(factory);
  const repository = await owner.repository(name);

  if(result === undefined) {
    t.is(repository, undefined, `no repository for '${name}'`);
  }
  else {
    if(repository) {
      t.is(repository.name, result, `lookup '${name}'`);
    }
    else {
      t.fail(`repository not found for '${name}'`);
    }
  }
}

ogrt.title = (providedTitle = "", factory, name, result) =>
  `${factory.name} get repository ${providedTitle} '${name}'`.trim();

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

test(ogrt, Owner, undefined, undefined);
test(ogrt, Owner, "r1", "r1");
test(ogrt, Owner, "r1#master", "r1");
test(ogrt, Owner, "Upper", "Upper");
test(ogrt, Owner, "upper", undefined);
test(ogrt, CaseInsensitiveOwner, undefined, undefined);
test(ogrt, CaseInsensitiveOwner, "upper", "Upper");

