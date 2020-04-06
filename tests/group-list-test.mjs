import test from "ava";
import { groupListTest } from "repository-provider-test-support";
import { Provider } from "../src/provider.mjs";

const provider = new Provider();
provider.addRepositoryGroup("g1");
provider.addRepositoryGroup("g2");

test(groupListTest, provider, undefined, { g1: {}, g2: {}});
test(groupListTest, provider, "*", { g1: {}, g2: {} });
test(groupListTest, provider, "g1", 1);
test(groupListTest, provider, "*2", 1);
test(groupListTest, provider, "g*", { g1: {}, g2: {} });
