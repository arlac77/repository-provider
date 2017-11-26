import test from 'ava';
import { Provider } from '../src/repository-provider';

test('provider config', async t => {
  const provider = new Provider({ key: 'value' });

  const repository = await provider.config;

  t.deepEqual(provider.config, { key: 'value' });
  t.is(provider.rateLimitReached, false);
});
