import test from "ava";
import { providerTest } from "repository-provider-test-support";
import { Provider } from "repository-provider";

test(providerTest, new Provider());
