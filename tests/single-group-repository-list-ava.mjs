import test from "ava";
import { SingleGroupProvider } from "repository-provider";

class CaseSensitiveOwner extends SingleGroupProvider {
  get name() {
    return "csp";
  }

  get repositoryBases() {
    return super.repositoryBases.concat(["https://myrepo/"]);
  }
}

class CaseInsensitiveOwner extends CaseSensitiveOwner {
  get name() {
    return "cip";
  }

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

test(olrt, CaseSensitiveOwner, "r1", ["r1"]);
test(olrt, CaseSensitiveOwner, "r*", ["r1", "r2"]);
test(olrt, CaseSensitiveOwner, "https://myrepo/r*", ["r1", "r2"]);
test(olrt, CaseSensitiveOwner, "otherProvider:xyz", []);
test(olrt, CaseSensitiveOwner, "otherProvider:r*", []);
test(olrt, CaseSensitiveOwner, "csp:r*", ["r1", "r2"]);
test(olrt, CaseSensitiveOwner, "*r*", ["r1", "r2", "Upper"]);

test(olrt, CaseSensitiveOwner, "csp:", ["r1", "r2", "x", "Upper"]);
test(olrt, CaseSensitiveOwner, "csp:*", ["r1", "r2", "x", "Upper"]);
test(olrt, CaseSensitiveOwner, "*", ["r1", "r2", "x", "Upper"]);
test(olrt, CaseSensitiveOwner, undefined, ["r1", "r2", "x", "Upper"]);
test(olrt, CaseSensitiveOwner, "", ["r1", "r2", "x", "Upper"]);
test(olrt, CaseSensitiveOwner, "https://myrepo/", ["r1", "r2", "x", "Upper"]);

test(olrt, CaseSensitiveOwner, "abc", []);

test(olrt, CaseInsensitiveOwner, "*r*", ["r1", "r2", "Upper"]);
test(olrt, CaseInsensitiveOwner, "https://myrepo/*r*", ["r1", "r2", "Upper"]);

test(ogrt, CaseSensitiveOwner, undefined, undefined);
test(ogrt, CaseSensitiveOwner, "otherProvider:r1", undefined);
test(ogrt, CaseSensitiveOwner, "csp:r1", "r1");
test(ogrt, CaseSensitiveOwner, "r1", "r1");
test(ogrt, CaseSensitiveOwner, "r1#master", "r1");
test(ogrt, CaseSensitiveOwner, "https://myrepo/r1#master", "r1");
test(ogrt, CaseSensitiveOwner, "Upper", "Upper");
test(ogrt, CaseSensitiveOwner, "https://myrepo/Upper", "Upper");
test(ogrt, CaseSensitiveOwner, "upper", undefined);

test(ogrt, CaseInsensitiveOwner, undefined, undefined);
test(ogrt, CaseInsensitiveOwner, "upper", "Upper");
test(ogrt, CaseInsensitiveOwner, "otherProvider:upper", undefined);
test(ogrt, CaseInsensitiveOwner, "cip:upper", "Upper");
test(ogrt, CaseInsensitiveOwner, "https://myrepo/upper", "Upper");
