import test from "ava";
import { providerOptionsFromEnvironmentTest } from "repository-provider-test-support";
import { BaseProvider } from "repository-provider";

test("provider default env options", t => {
  t.is(BaseProvider.optionsFromEnvironment(), undefined);
  t.is(BaseProvider.optionsFromEnvironment({}), undefined);
  t.true(BaseProvider.areOptionsSufficcient());
});

class MyProviderA extends BaseProvider {
  static get instanceIdentifier() {
    return "BITBUCKET_";
  }

  static get attributes() {
    return {
      ...super.attributes,
      "authentication.username": {
        env: "{{instanceIdentifier}}USERNAME"
      },
      "authentication.password": {
        env: "{{instanceIdentifier}}PASSWORD",
        additionalAttributes: { "authentication.type": "basic" },
        private: true
      }
    };
  }
}

class MyProviderB extends BaseProvider {
  static get instanceIdentifier() {
    return "GITEA_";
  }

  static get attributes() {
    return {
      ...super.attributes,
      host: {
        env: "{{instanceIdentifier}}HOST",
        default: "somewhere.com"
      },
      cloneOptions: {
        env: "GIT_CLONE_OPTIONS",
        parse: value => value.split(/\s+/)
      },
      "authentication.token": {
        env: ["{{instanceIdentifier}}TOKEN", "XXX_TOKEN"],
        additionalAttributes: { "authentication.type": "token" },
        private: true,
        mandatory: true
      },
      api: {
        env: "{{instanceIdentifier}}API",
        get: (attribute, object, properties) =>
          `http://${object.host || properties.host.value}/api`
      }
    };
  }
}
test("MyProviderB.initialize", t => {
  const p = MyProviderB.initialize(
    {},
    {
      GITEA_HOST: "somewhere",
      GITEA_TOKEN: "abc"
    }
  );

  t.is(p.host, "somewhere");
  t.is(p.api, "http://somewhere/api");
});

test(
  providerOptionsFromEnvironmentTest,
  MyProviderB,
  {
    GITEA_HOST: "somewhere",
    GITEA_TOKEN: "abc"
  },
  {
    host: "somewhere",
    "authentication.token": "abc",
    "authentication.type": "token"
  },
  true
);

test(
  providerOptionsFromEnvironmentTest,
  MyProviderB,
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
  MyProviderB,
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
  MyProviderA,
  {
    BITBUCKET_USERNAME: "aName",
    BITBUCKET_PASSWORD: "aSecret"
  },
  {
    "authentication.username": "aName",
    "authentication.password": "aSecret",
    "authentication.type": "basic"
  },
  true
);

test("initialize", t => {
  const provider = MyProviderB.initialize(undefined, { GITEA_TOKEN: "abc" });
  t.is(provider.name, "MyProviderB");
  t.is(provider.authentication.token, "abc");

  t.is(MyProviderB.initialize(undefined, undefined), undefined);
});

test("initialize with name", t => {
  const provider = MyProviderB.initialize(undefined, {
    GITEA_NAME: "a name",
    GITEA_TOKEN: "abc"
  });
  t.is(provider.name, "a name");
  t.is(provider.authentication.token, "abc");

  t.is(MyProviderB.initialize(undefined, undefined), undefined);
});

test("new provider", t => {
  const provider = new BaseProvider({ key: "value", url: "http://somewhere/" });
  t.is(provider.priority, 0);
  t.is(provider.name, "BaseProvider");
  t.is(`${provider}`, "BaseProvider");
  t.deepEqual(provider.toJSON(), {
    name: "BaseProvider",
    priority: 0,
    url: "http://somewhere/"
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

test("initialize several with instanceIdentifier", t => {
  const env = { GITEA_TOKEN: "abc", GITEA2_TOKEN: "cde" };

  const provider1 = MyProviderB.initialize(
    { instanceIdentifier: "GITEA_" },
    env
  );
  t.is(provider1.name, "MyProviderB");
  t.is(provider1.authentication.token, "abc");

  const provider2 = MyProviderB.initialize(
    { instanceIdentifier: "GITEA2_" },
    env
  );
  t.is(provider2.name, "MyProviderB");
  t.is(provider2.authentication.token, "cde");
});
