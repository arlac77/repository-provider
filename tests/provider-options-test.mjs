import test from "ava";
import { BaseProvider } from "repository-provider";

test("provider default env options", t => {
  t.is(BaseProvider.optionsFromEnvironment(), undefined);
  t.is(BaseProvider.optionsFromEnvironment({}), undefined);
  t.true(BaseProvider.areOptionsSufficciant());
});

class MyProvider extends BaseProvider {
  static areOptionsSufficciant(options) {
    return options.authentication ? true : false;
  }

  static get environmentOptions() {
    return {
      GIT_CLONE_OPTIONS: {
        path: "cloneOptions",
        parse: value => value.split(/\s+/)
      },
      GITEA_TOKEN: {
        path: "authentication.token",
        template: { type: "token" }
      },
      GITEA_API: "api",
      BITBUCKET_USERNAME: {
        path: "authentication.username",
        template: { type: "basic" }
      },
      BITBUCKET_PASSWORD: {
        path: "authentication.password",
        template: { type: "basic" }
      }
    };
  }
}

test("provider env options", t => {
  t.deepEqual(
    MyProvider.optionsFromEnvironment({
      GITEA_API: "http:/somewhere/api",
      GITEA_TOKEN: "abc",
      GIT_CLONE_OPTIONS: "-A 1"
    }),
    {
      authentication: { type: "token", token: "abc" },
      api: "http:/somewhere/api",
      cloneOptions: ["-A", "1"]
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
      authentication: { type: "basic", username: "aName", password: "aSecret" }
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
