import test from "ava";
import { groupListTest } from "repository-provider-test-support";
import { MultiGroupProvider } from "repository-provider";

class CaseSensitiveProvider extends MultiGroupProvider {
  get repositoryBases() {
    return ["https://myrepo/"];
  }
}

function initProvider(factory) {
  const provider = new factory();

  provider.addRepositoryGroup("g1");
  provider.addRepositoryGroup("g2");
  provider.addRepositoryGroup("Upper");

  return provider;
}

const allGroups = {
  g1: {},
  g2: {}
};

test(groupListTest, initProvider(CaseSensitiveProvider), undefined, allGroups);
test(groupListTest, initProvider(CaseSensitiveProvider), "*", allGroups);
test(
  groupListTest,
  initProvider(CaseSensitiveProvider),
  "https://user@myrepo/*",
  allGroups
);
test(groupListTest, initProvider(CaseSensitiveProvider), "*", 3);
test(groupListTest, initProvider(CaseSensitiveProvider), "g1", 1);
test(
  groupListTest,
  initProvider(CaseSensitiveProvider),
  "https://user@myrepo/g1",
  1
);
test(groupListTest, initProvider(CaseSensitiveProvider), "*2", 1);
test(groupListTest, initProvider(CaseSensitiveProvider), "g*", allGroups);
test(groupListTest, initProvider(CaseSensitiveProvider), "upper", 0);
test(
  groupListTest,
  initProvider(CaseSensitiveProvider),
  "https://user@myrepo/upper",
  0
);
test(groupListTest, initProvider(CaseSensitiveProvider), "Upper", 1);
test(
  groupListTest,
  initProvider(CaseSensitiveProvider),
  "https://user@myrepo/Upper",
  1
);

class CaseInsensitiveProvider extends CaseSensitiveProvider {
  get areRepositoryNamesCaseSensitive() {
    return false;
  }

  get areGroupNamesCaseSensitive() {
    return false;
  }
}

test(
  groupListTest,
  initProvider(CaseInsensitiveProvider),
  undefined,
  allGroups
);
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

test(pgrt, initProvider(CaseSensitiveProvider), "g1", "g1");
test.skip(pgrt, initProvider(CaseSensitiveProvider), "https://myrepo/g1", "g1");
test(pgrt, initProvider(CaseSensitiveProvider), "Upper", "Upper");
test.skip(
  pgrt,
  initProvider(CaseSensitiveProvider),
  "https://myrepo/Upper",
  "Upper"
);
test(pgrt, initProvider(CaseInsensitiveProvider), "Upper", "Upper");
test.skip(
  pgrt,
  initProvider(CaseInsensitiveProvider),
  "https://myrepo/Upper",
  "Upper"
);
test(pgrt, initProvider(CaseInsensitiveProvider), "upper", "Upper");
test.skip(
  pgrt,
  initProvider(CaseInsensitiveProvider),
  "https://myrepo/upper",
  "Upper"
);
