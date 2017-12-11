import test from 'ava';
import { Provider } from '../src/repository-provider';

test('provider', async t => {
  const provider = new Provider({ key: 'value' });
  t.deepEqual(provider.config, { key: 'value' });
  t.is(provider.rateLimitReached, false);
});

test('repository ', async t => {
  const provider = new Provider();
  const repository = await provider.repository('r1');
  t.is(repository.name, 'r1');
});

test('pullRequests', async t => {
  const provider = new Provider();
  const repository = await provider.repository('r1');

  const prs = await repository.pullRequests;

  t.is(prs.length, 0);
});
