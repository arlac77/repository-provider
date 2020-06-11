import test from "ava";
import { providerParseNameTest } from "repository-provider-test-support";

import { BaseProvider } from "repository-provider";

class MyProvider extends BaseProvider {
  get repositoryBases() {
    return ["https://github.com/", "http://otherdomain.com"];
  }
}

export async function providerNameTest(t, provider, name, expectedName = name) {
  t.is(provider.normalizeRepositoryName(name), expectedName);
}

providerNameTest.title = (
  providedTitle = "provider name",
  provider,
  name,
  expectedName = name
) => `${providedTitle} ${provider.name} '${name}' = '${expectedName}'`.trim();

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

test(providerParseNameTest, new MyProvider(), {
  "": { repository: "" },
  "abc/def/g": { group: "abc", repository: "def" },
  "xxx/abc/def.git#mybranch": {
    group: "abc",
    repository: "def",
    branch: "mybranch"
  },
  abc: { repository: "abc" },
  " abc/def": { group: "abc", repository: "def" },
  "abc/def#mybranch ": {
    group: "abc",
    repository: "def",
    branch: "mybranch"
  },
  "abc/def.git": { group: "abc", repository: "def" },
  "abc/def.git#mybranch": {
    group: "abc",
    repository: "def",
    branch: "mybranch"
  },
  "https://github.com/arlac77/sync-test-repository.git#mybranch": {
    base: "https://github.com/",
    group: "arlac77",
    repository: "sync-test-repository",
    branch: "mybranch"
  },
  "https://user:password@github.com/arlac77/sync-test-repository.git#mybranch": {
    base: "https://github.com/",
    group: "arlac77",
    repository: "sync-test-repository",
    branch: "mybranch"
  },
  "https://user@github.com/arlac77/sync-test-repository.git#mybranch": {
    base: "https://github.com/",
    group: "arlac77",
    repository: "sync-test-repository",
    branch: "mybranch"
  },
  "http://otherdomain.com/arlac77/sync-test-repository.git#mybranch": {
    base: "http://otherdomain.com",
    group: "arlac77",
    repository: "sync-test-repository",
    branch: "mybranch"
  },
  "git+http://otherdomain.com/arlac77/sync-test-repository.git#mybranch": {
    base: "http://otherdomain.com",
    group: "arlac77",
    repository: "sync-test-repository",
    branch: "mybranch"
  },
  "git+http://arlac77@otherdomain.com/prefix/arlac77/sync-test-repository.git": {
    base: "http://otherdomain.com",
    group: "arlac77",
    repository: "sync-test-repository"
  },
  "git@bitbucket.org:arlac77/sync-test-repository.git#mybranch": {
    base: "git@bitbucket.org:",
    group: "arlac77",
    repository: "sync-test-repository",
    branch: "mybranch"
  },
  "git@bitbucket.org/arlac77/sync-test-repository.git": {
    base: "git@bitbucket.org/",
    group: "arlac77",
    repository: "sync-test-repository"
  },
  "https://arlac77@bitbucket.org/arlac77/sync-test-repository.git": {
    base: "https://bitbucket.org/",
    group: "arlac77",
    repository: "sync-test-repository"
  }
});
