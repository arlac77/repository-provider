import test from "ava";
import { repositories } from "./fixtures/repositories.mjs";
import { providerParseNameTest } from "repository-provider-test-support";

import { BaseProvider } from "repository-provider";

export async function providerNameTest(t, provider, name, expectedName = name) {
  t.is(provider.normalizeRepositoryName(name), expectedName);
}

providerNameTest.title = (
  providedTitle = "provider name",
  provider,
  name,
  expectedName = name
) => `${providedTitle} ${provider.name} '${name}' = '${expectedName}'`.trim();


class MyProvider extends BaseProvider {
  get repositoryBases() {
    return ["https://github.com/", "http://otherdomain.com/"];
  }
}

test(providerNameTest, new BaseProvider(), "", "");
test(providerNameTest, new BaseProvider(), "abc", "abc");
test(providerNameTest, new BaseProvider(), "abc#branch", "abc");
test(providerNameTest, new BaseProvider(), " abc", "abc");
test(providerNameTest, new BaseProvider(), "abc ", "abc");
test(providerNameTest, new BaseProvider(), " abc ", "abc");
test(providerNameTest, new BaseProvider(), "abc/def", "abc/def");
test(providerNameTest, new BaseProvider(), "abc/def#mybranch", "abc/def");
test(providerNameTest, new BaseProvider(), "abc/def.git", "abc/def");
test(providerNameTest, new BaseProvider(), "abc/def.git#mybranch", "abc/def");

test(providerParseNameTest, new BaseProvider(), repositories);
