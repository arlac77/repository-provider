import test from "ava";
import { SingleGroupProvider } from "repository-provider";

class CaseInsensitiveOwner extends SingleGroupProvider {
  get areRepositoryNamesCaseSensitive() {
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
  `${factory.name} list repositories${
    providedTitle ? " " + providedTitle : ""
  } '${pattern}'`.trim();

async function ogrt(t, factory, name, result) {
  const owner = await createOwner(factory);
  const repository = await owner.repository(name);

  if (result === undefined) {
    t.is(repository, undefined, `no repository for '${name}'`);
  } else {
    if (repository) {
      t.is(repository.name, result, `lookup '${name}'`);
    } else {
      t.fail(`repository not found for '${name}'`);
    }
  }
}

ogrt.title = (providedTitle = "", factory, name, result) =>
  `${factory.name} get repository${
    providedTitle ? " " + providedTitle : ""
  } '${name}'`.trim();

async function createOwner(factory) {
  const owner = new factory();
  await owner.createRepository("r1#b1");
  await owner.createRepository("r2");
  await owner.createRepository("x");
  await owner.createRepository("Upper");
  return owner;
}

test(olrt, SingleGroupProvider, "r1", ["r1"]);
test(olrt, SingleGroupProvider, "r*", ["r1", "r2"]);
test(olrt, SingleGroupProvider, "*r*", ["r1", "r2", "Upper"]);
test(olrt, SingleGroupProvider, "*", ["r1", "r2", "x", "Upper"]);
test(olrt, SingleGroupProvider, undefined, ["r1", "r2", "x", "Upper"]);
test(olrt, SingleGroupProvider, "abc", []);
test(olrt, SingleGroupProvider, "", []);
test(olrt, CaseInsensitiveOwner, "*r*", ["r1", "r2", "Upper"]);

test(ogrt, SingleGroupProvider, undefined, undefined);
test(ogrt, SingleGroupProvider, "r1", "r1");
test(ogrt, SingleGroupProvider, "r1#master", "r1");
test(ogrt, SingleGroupProvider, "Upper", "Upper");
test(ogrt, SingleGroupProvider, "upper", undefined);
test(ogrt, CaseInsensitiveOwner, undefined, undefined);
test(ogrt, CaseInsensitiveOwner, "upper", "Upper");
