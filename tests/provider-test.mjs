import test from "ava";
import { providerTest } from "repository-provider-test-support/src/provider-test.mjs";
import { Provider } from "../src/provider.mjs";

test(providerTest,new Provider());