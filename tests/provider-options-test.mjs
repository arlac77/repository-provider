import test from "ava";
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
        env: ["GITEA_TOKEN","XXX_TOKEN"],
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

test("provider env options", t => {
  t.deepEqual(
    MyProvider.optionsFromEnvironment({
      GITEA_API: "http://somewhere/api",
      GITEA_TOKEN: "abc",
      GIT_CLONE_OPTIONS: "-A 1"
    }),
    {
      "authentication.token": "abc",
      "authentication.type": "token",
      api: "http://somewhere/api",
      cloneOptions: "-A 1"
    }
  );
});

test("provider env options 2nd. efrom list", t => {
  t.deepEqual(
    MyProvider.optionsFromEnvironment({
      XXX_TOKEN: "abc",
    }),
    {
      "authentication.token": "abc",
      "authentication.type": "token"
    }
  );
});

test("provider env options multiple keys on template", t => {
  t.deepEqual(
    MyProvider.optionsFromEnvironment({
      BITBUCKET_USERNAME: "aName",
      BITBUCKET_PASSWORD: "aSecret"
    }),
    {
      "authentication.username": "aName",
      "authentication.password": "aSecret",
      "authentication.type": "basic"
    }
  );
});

test("initialize", t => {
  const provider = MyProvider.initialize(undefined, { GITEA_TOKEN: "abc" });
  t.is(provider.name, "MyProvider");
  t.is(MyProvider.initialize(undefined, undefined), undefined);
});

test("new provider", t => {
  const provider = new BaseProvider({ key: "value" });
  t.is(provider.priority, 0);
  t.is(provider.name, "BaseProvider");
  t.is(`${provider}`, "BaseProvider");
  t.deepEqual(provider.toJSON(), {
    name: "BaseProvider",
    priority: 0
  });
});

test("provider with priority", t => {
  const provider = new BaseProvider({ priority: 77 });
  t.is(provider.priority, 77);
});
