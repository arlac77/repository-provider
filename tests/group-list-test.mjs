import test from "ava";
import { groupListTest } from "repository-provider-test-support";
import { Provider } from "../src/provider.mjs";

const provider = new Provider();
provider._createRepositoryGroup("g1");
provider._createRepositoryGroup("g2");

test(groupListTest, provider, undefined, { g1: {}, g2: {}});
test(groupListTest, provider, "*", { g1: {}, g2: {} });
test(groupListTest, provider, "g1", { g1: {} });
