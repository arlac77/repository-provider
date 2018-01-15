import test from 'ava';
import { Provider } from '../src/repository-provider';

test('provider', async t => {
  const provider = new Provider({ key: 'value' });
  t.deepEqual(provider.config, { key: 'value' });
  t.is(provider.rateLimitReached, false);
  t.is(provider.type, 'git');
});

test('repository', async t => {
  const provider = new Provider();
  const repository = await provider.createRepository('r1');
  t.is(repository.name, 'r1');
  t.is(repository.type, 'git');
});

test('repository urls', async t => {
  const provider = new Provider();
  const repository = await provider.createRepository('r1');
  t.deepEqual(repository.urls, []);
});
