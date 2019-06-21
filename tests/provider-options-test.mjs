import test from "ava";
import { Provider } from "../src/provider.mjs";


test("provider default env options", async t => {
    t.is(Provider.optionsFromEnvironment(), undefined);
    t.is(Provider.optionsFromEnvironment({}), undefined);
});

test("provider env options", async t => {
    class MyProvider extends Provider {
        static get environmentOptions() {
            return {
                'GITEA_TOKEN': { path: 'authentication.token', template: { type: 'token' } },
                'GITEA_API': 'api'
            };
        }
    }

    t.deepEqual(MyProvider.optionsFromEnvironment({ GITEA_API: 'http:/somewhere/api', GITEA_TOKEN: 'abc' }),
        {
            authentication: { type: 'token', token: 'abc' },
            api: 'http:/somewhere/api'
        });
});

