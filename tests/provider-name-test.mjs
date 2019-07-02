import test from "ava";
import { Provider } from "../src/provider.mjs";

class MyProvider extends Provider {
  get repositoryBases() {
    return ["https://github.com/"];
  }
}

test("provider normalize repo name", t => {
  const provider = new Provider();
  t.is(provider.normalizeRepositoryName("abc"), "abc");
  t.is(provider.normalizeRepositoryName("abc/def"), "abc/def");
  t.is(provider.normalizeRepositoryName("abc/def#mybranch"), "abc/def");
  t.is(provider.normalizeRepositoryName("abc/def.git"), "abc/def");
  t.is(provider.normalizeRepositoryName("abc/def.git#mybranch"), "abc/def");
});

test("provider parseName", t => {
  const provider = new MyProvider();
  const nameFixtures = {
    abc: { repository: "abc" },
    "abc/def": { group: "abc", repository: "def" },
    "abc/def#mybranch": { group: "abc", repository: "def", branch: "mybranch" },
    "abc/def.git": { group: "abc", repository: "def" },
    "abc/def.git#mybranch": {
      group: "abc",
      repository: "def",
      branch: "mybranch"
    },
    "https://github.com/arlac77/sync-test-repository.git#mybranch": {
      group: "arlac77",
      repository: "sync-test-repository",
      branch: "mybranch"
    },
    "https://user:password@github.com/arlac77/sync-test-repository.git#mybranch": {
      group: "arlac77",
      repository: "sync-test-repository",
      branch: "mybranch"
    },
    "https://user@github.com/arlac77/sync-test-repository.git#mybranch": {
      group: "arlac77",
      repository: "sync-test-repository",
      branch: "mybranch"
    }
  };

  for (const name of Object.keys(nameFixtures)) {
    t.deepEqual(provider.parseName(name), nameFixtures[name]);
  }
});
