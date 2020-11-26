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

async function olgt(t, factory, pattern, result) {
  const owner = new factory();
  const found = [];

  for await (const r of owner.repositoryGroups(pattern)) {
    found.push(r.name);
  }

  if (typeof result === "number") {
    t.true(found.length >= result);
  } else {
    t.deepEqual(found.sort(), result.sort());
  }
}

olgt.title = (providedTitle = "", factory, pattern, result) =>
  `${factory.name} list groups${
    providedTitle ? " " + providedTitle : ""
  } '${pattern}'`.trim();

async function oggt(t, factory, name, result) {
  const owner = new factory();
  const group = await owner.repositoryGroup(name);

  if (result === undefined) {
    t.is(group, undefined, `no group for '${name}'`);
  } else {
    if (group) {
      t.is(group.name, result, `lookup '${name}'`);
    } else {
      t.fail(`group not found for '${name}'`);
    }
  }
}

oggt.title = (providedTitle = "", factory, name, result) =>
  `${factory.name} get group${
    providedTitle ? " " + providedTitle : ""
  } '${name}'`.trim();

test(olgt, CaseSensitiveOwner, undefined, 0);
test(olgt, CaseSensitiveOwner, "", 0);
test(olgt, CaseSensitiveOwner, "csp:*", 1);
test(oggt, CaseSensitiveOwner, undefined, undefined);
//test(oggt, CaseSensitiveOwner, "csp:", undefined);
//test(oggt, CaseSensitiveOwner, "otherProvider:r1", undefined);
