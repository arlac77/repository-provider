import test from "ava";
import { providerOptionsFromEnvironmentTest } from "repository-provider-test-support";

import { BaseProvider } from "repository-provider";

test("provider default env options", t => {
  t.is(BaseProvider.optionsFromEnvironment(), undefined);
  t.is(BaseProvider.optionsFromEnvironment({}), undefined);
  t.true(BaseProvider.areOptionsSufficcient());
});

class MyProvider extends BaseProvider {
  static get attributes() {
    return {
      ...super.attributes,
      cloneOptions: {
        env: "GIT_CLONE_OPTIONS",
        parse: value => value.split(/\s+/)
      },
      "authentication.token": {
        env: ["GITEA_TOKEN", "XXX_TOKEN"],
        additionalAttributes: { "authentication.type": "token" },
        private: true,
        mandatory: true
      },
      api: {
        env: "GITEA_API"
      },
      "authentication.username": {
        env: "BITBUCKET_USERNAME"
      },
      "authentication.password": {
        env: "BITBUCKET_PASSWORD",
        additionalAttributes: { "authentication.type": "basic" },
        private: true
      }
    };
  }
}

test(
  providerOptionsFromEnvironmentTest,
  MyProvider,
  {
    GITEA_API: "http://somewhere/api",
    GITEA_TOKEN: "abc",
    GIT_CLONE_OPTIONS: "-A 1"
  },
  {
    "authentication.token": "abc",
    "authentication.type": "token",
    api: "http://somewhere/api",
    cloneOptions: "-A 1"
  },
  true
);

test(
  providerOptionsFromEnvironmentTest,
  MyProvider,
  {
    XXX_TOKEN: "abc"
  },
  {
    "authentication.token": "abc",
    "authentication.type": "token"
  },
  true
);

test(
  providerOptionsFromEnvironmentTest,
  MyProvider,
  {
    BITBUCKET_USERNAME: "aName",
    BITBUCKET_PASSWORD: "aSecret"
  },
  {
    "authentication.username": "aName",
    "authentication.password": "aSecret",
    "authentication.type": "basic"
  },
  false
);

test("initialize", t => {
  const provider = MyProvider.initialize(undefined, { GITEA_TOKEN: "abc" });
  t.is(provider.name, "MyProvider");
  t.is(provider.authentication.token, "abc");

  t.is(MyProvider.initialize(undefined, undefined), undefined);
});

test("new provider", t => {
  const provider = new BaseProvider({ key: "value" });
  t.is(provider.priority, 0);
  t.is(provider.name, "BaseProvider");
  t.is(`${provider}`, "BaseProvider");
  t.deepEqual(provider.toJSON(), {
    name: "BaseProvider",
    priority: 0,
    messageDestination: console
  });
});

test("provider with priority", t => {
  const provider = new BaseProvider({ priority: 77 });
  t.is(provider.priority, 77);
});

test("provider with name", t => {
  const sp = new BaseProvider({ name: "myName" });
  t.is(sp.name, "myName");
});


test.skip("initialize several", t => {
  const provider = MyProvider.initialize({ instance: "GITEA2" }, { GITEA_TOKEN: "abc", GITEA2_TOKEN: "cde" });
  t.is(provider.name, "MyProvider");
  t.is(provider.authentication.token, "cde");
});
