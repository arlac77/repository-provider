import test from "ava";
import { groupListTest } from "repository-provider-test-support";
import { MultiGroupProvider } from "repository-provider";

function initProvider(factory) {
  const provider = new factory();

  provider.addRepositoryGroup("g1");
  provider.addRepositoryGroup("g2");
  provider.addRepositoryGroup("Upper");

  return provider;
}

test(groupListTest, initProvider(MultiGroupProvider), undefined, {
  g1: {},
  g2: {}
});
test(groupListTest, initProvider(MultiGroupProvider), "*", { g1: {}, g2: {} });
test(groupListTest, initProvider(MultiGroupProvider), "*", 3);
test(groupListTest, initProvider(MultiGroupProvider), "g1", 1);
test(groupListTest, initProvider(MultiGroupProvider), "*2", 1);
test(groupListTest, initProvider(MultiGroupProvider), "g*", { g1: {}, g2: {} });
test(groupListTest, initProvider(MultiGroupProvider), "upper", 0);
test(groupListTest, initProvider(MultiGroupProvider), "Upper", 1);

class CaseInsensitiveProvider extends MultiGroupProvider {
  get areRepositoryNamesCaseSensitive() {
    return false;
  }

  get areGroupNamesCaseSensitive() {
    return false;
  }
}

test(groupListTest, initProvider(CaseInsensitiveProvider), undefined, {
  g1: {},
  g2: {}
});
test(groupListTest, initProvider(CaseInsensitiveProvider), "*", {
  g1: {},
  g2: {},
  Upper: {}
});
test(groupListTest, initProvider(CaseInsensitiveProvider), "g1", { g1: {} });
test(groupListTest, initProvider(CaseInsensitiveProvider), "*2", { g2: {} });
test(groupListTest, initProvider(CaseInsensitiveProvider), "g*", {
  g1: {},
  g2: {}
});
test(groupListTest, initProvider(CaseInsensitiveProvider), "u*", { Upper: {} });


async function pgrt(t, provider, name, result) {
  const group = await provider.repositoryGroup(name);

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

pgrt.title = (providedTitle = "", provider, name, result) =>
  `${provider.name} get group ${providedTitle} '${name}'`.trim();

test(pgrt, initProvider(MultiGroupProvider), "g1", "g1");
test(pgrt, initProvider(MultiGroupProvider), "Upper", "Upper");
test(pgrt, initProvider(CaseInsensitiveProvider), "Upper", "Upper");
test(pgrt, initProvider(CaseInsensitiveProvider), "upper", "Upper");
