import test from "ava";
import { Provider } from "../src/provider.mjs";


test("provider default env options", async t => {
    t.is(Provider.optionsFromEnvironment(), undefined);
    t.is(Provider.optionsFromEnvironment({}), undefined);
});


class MyProvider extends Provider {
    static get environmentOptions() {
        return {
            GITEA_TOKEN: { path: 'authentication.token', template: { type: 'token' } },
            GITEA_API: 'api',
            BITBUCKET_USERNAME: { path: 'authentication.username', template: { type: 'basic' } },
            BITBUCKET_PASSWORD: { path: 'authentication.password', template: { type: 'basic' } }          
        };
    }
}

test("provider env options", async t => {
    t.deepEqual(MyProvider.optionsFromEnvironment({ GITEA_API: 'http:/somewhere/api', GITEA_TOKEN: 'abc' }),
        {
            authentication: { type: 'token', token: 'abc' },
            api: 'http:/somewhere/api'
        });
});

test.only("provider env options multiple keys on template", async t => {
    t.deepEqual(MyProvider.optionsFromEnvironment({ BITBUCKET_USERNAME: 'aName', BITBUCKET_PASSWORD: 'aSecret' }),
        {
            authentication: { type: 'basic', username: 'aName', password: 'aSecret' }
        });
});

