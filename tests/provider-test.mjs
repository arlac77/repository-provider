import test from "ava";
import { providerTest } from "repository-provider-test-support";
import { SingleGroupProvider, MultiGroupProvider } from "repository-provider";

test(providerTest, new SingleGroupProvider());
test(providerTest, new MultiGroupProvider());
