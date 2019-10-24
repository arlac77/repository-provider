import test from "ava";
import { groupListTest } from "repository-provider-test-support/src/group-list-test.mjs";
import { Provider } from "../src/provider.mjs";

const provider = new Provider();
provider._createRepositoryGroup("g1");
provider._createRepositoryGroup("g2");

test(groupListTest, provider, undefined, { "g1": { name: "g1" } });
test(groupListTest, provider, "g1", { "g1": { name: "g1" } });
test(groupListTest, provider, "*", { "g1": { name: "g1" } });
