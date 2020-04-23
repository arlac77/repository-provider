import test from "ava";
import { groupListTest } from "repository-provider-test-support";
import { Provider } from "../src/provider.mjs";

function initProvider(factory) {
  const provider = new factory();

  provider.addRepositoryGroup("g1");
  provider.addRepositoryGroup("g2");
  provider.addRepositoryGroup("Upper");

  return provider;
}

test(groupListTest, initProvider(Provider), undefined, { g1: {}, g2: {} });
test(groupListTest, initProvider(Provider), "*", { g1: {}, g2: {} });
test(groupListTest, initProvider(Provider), "*", 3);
test(groupListTest, initProvider(Provider), "g1", 1);
test(groupListTest, initProvider(Provider), "*2", 1);
test(groupListTest, initProvider(Provider), "g*", { g1: {}, g2: {} });
test(groupListTest, initProvider(Provider), "upper", 0);
test(groupListTest, initProvider(Provider), "Upper", 1);

class CaseInsensitiveProvider extends Provider {
  get areRepositoryNamesCaseSensitive() {
    return false;
  }

  get areGroupNamesCaseSensitive() {
    return false;
  }
}

test(groupListTest, initProvider(CaseInsensitiveProvider), undefined, { g1: {}, g2: {} });
test(groupListTest, initProvider(CaseInsensitiveProvider), "*", { g1: {}, g2: {}, Upper: {}});
test(groupListTest, initProvider(CaseInsensitiveProvider), "g1", { g1: {} });
test(groupListTest, initProvider(CaseInsensitiveProvider), "*2", { g2: {} });
test(groupListTest, initProvider(CaseInsensitiveProvider), "g*", { g1: {}, g2: {} });
test(groupListTest, initProvider(CaseInsensitiveProvider), "u*", { Upper: {} });

