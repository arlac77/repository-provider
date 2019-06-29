import test from "ava";
import { Provider } from "../src/provider.mjs";


test("provider default env options", async t => {
    t.is(Provider.optionsFromEnvironment(), undefined);
    t.is(Provider.optionsFromEnvironment({}), undefined);
    t.true(Provider.areOptionsSufficciant());
});


class MyProvider extends Provider {

    static areOptionsSufficciant(options) {
        return options.authentication ? true : false;
    }

    static get environmentOptions() {
        return {
            GIT_CLONE_OPTIONS: { path: 'cloneOptions', parse: value => value.split(/\s+/) },
            GITEA_TOKEN: { path: 'authentication.token', template: { type: 'token' } },
            GITEA_API: 'api',
            BITBUCKET_USERNAME: { path: 'authentication.username', template: { type: 'basic' } },
            BITBUCKET_PASSWORD: { path: 'authentication.password', template: { type: 'basic' } }
        };
    }
}

test("provider env options", async t => {
    t.deepEqual(MyProvider.optionsFromEnvironment({ GITEA_API: 'http:/somewhere/api', GITEA_TOKEN: 'abc', GIT_CLONE_OPTIONS: '-A 1' }),
        {
            authentication: { type: 'token', token: 'abc' },
            api: 'http:/somewhere/api',
            cloneOptions: ['-A', '1']
        });
});

test("provider env options multiple keys on template", async t => {
    t.deepEqual(MyProvider.optionsFromEnvironment({ BITBUCKET_USERNAME: 'aName', BITBUCKET_PASSWORD: 'aSecret' }),
        {
            authentication: { type: 'basic', username: 'aName', password: 'aSecret' }
        });
});

test("initialize", async t => {
    const provider = MyProvider.initialize(undefined, { GITEA_TOKEN: 'abc' });
    t.is(provider.name, 'MyProvider');
    t.is(MyProvider.initialize(undefined, undefined), undefined);
});

test("new provider", async t => {
    const provider = new Provider({ key: "value" });
    t.is(provider.type, "git");
    t.is(provider.priority, 0);
    t.is(provider.name, "Provider");
    t.is(`${provider}`, "Provider");
    t.deepEqual(provider.toJSON(), {
      name: "Provider",
      logLevel: "info",
      priority: 0
    });
  });
  
test("provider with priority", async t => {
    const provider = new Provider({ priority: 77 });
    t.is(provider.priority, 77);
  });
  