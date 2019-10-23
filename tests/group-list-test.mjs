import test from "ava";
import { listGroupsTest } from "repository-provider-test-support/src/list-group-test.mjs";
import { Provider } from "../src/provider.mjs";

const provider = new Provider();
provider._createRepositoryGroup("g1");
provider._createRepositoryGroup("g2");

test(listGroupsTest, provider, undefined, { "g1": { name: "g1" } });
test(listGroupsTest, provider, "g1", { "g1": { name: "g1" } });
test(listGroupsTest, provider, "*", { "g1": { name: "g1" } });
