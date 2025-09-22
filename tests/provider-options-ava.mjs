import test from "ava";
import {
  string_attribute,
  string_collection_attribute,
  token_attribute,
  object_attribute
} from "pacc";
import { BaseProvider } from "repository-provider";

class MyProviderA extends BaseProvider {
  static get instanceIdentifier() {
    return "BITBUCKET_";
  }

  static attributes = {
    ...super.attributes,
    authentication: {
      attributes: {
        username: {
          env: "{{instanceIdentifier}}USERNAME"
        },
        password: {
          env: ["BITBUCKET_APP_PASSWORD", "{{instanceIdentifier}}PASSWORD"],
          additionalValues: { "authentication.type": "basic" },
          private: true
        }
      }
    }
  };
}

class MyProviderB extends BaseProvider {
  static instanceIdentifier = "GITEA_";

  static attributes = {
    ...super.attributes,
    host: {
      ...string_attribute,
      env: "{{instanceIdentifier}}HOST",
      default: "somewhere.com"
    },
    cloneOptions: {
      ...string_collection_attribute,
      env: "GIT_CLONE_OPTIONS",
      prepareValue: value => value.split(/\s+/)
    },
    authentication: {
      ...object_attribute,
      attributes: {
        token: {
          ...token_attribute,
          env: ["{{instanceIdentifier}}TOKEN", "XXX_TOKEN"],
          additionalValues: { "authentication.type": "token" },
          mandatory: true
        }
      }
    },
    api: {
      env: "{{instanceIdentifier}}API"
    }
  };

  get api() {
    return `http://${this.host}/api`;
  }
}

test("initialize sufficiant", t => {
  const provider = MyProviderB.initialize(undefined, { GITEA_TOKEN: "abc" });
  t.is(provider.name, "MyProviderB");
  t.is(provider.authentication.token, "abc");
});

test("initialize insufficiant", t => {
  t.is(MyProviderB.initialize(undefined, undefined), undefined);
});

test("initialize with name", t => {
  const provider = MyProviderB.initialize(undefined, {
    GITEA_NAME: "a name",
    GITEA_TOKEN: "abc"
  });
  t.is(provider.name, "a name");
  t.is(provider.authentication.token, "abc");
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
