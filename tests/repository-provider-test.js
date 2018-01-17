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

test('get repository', async t => {
  const provider = new Provider();
  await provider.createRepository('r1');
  const repository = await provider.repository('r1');
  t.is(repository.name, 'r1');
});

test('get repository#branch', async t => {
  const provider = new Provider();
  const r = await provider.createRepository('r1');
  const b = await r.createBranch('b1');

  const branch = await provider.branch('r1#b1');
  t.is(branch.name, 'b1');
  t.is(branch.repository, r);
  t.is(branch.provider, provider);
});

test('get repository + default branch', async t => {
  const provider = new Provider();
  const r = await provider.createRepository('r1');
  const b = await r.createBranch('master');

  const branch = await provider.branch('r1');
  t.is(branch.name, 'master');
  t.is(branch.repository, r);
  t.is(branch.provider, provider);
});

test('get unknown repository + branch', async t => {
  const provider = new Provider();
  const r = await provider.createRepository('r1');
  const b = await r.createBranch('master');

  try {
    const branch = await provider.branch('r2#master');
  } catch (err) {
    t.is(err.message, 'Unknown repository r2');
  }

  try {
    const branch = await provider.branch('r2');
  } catch (err) {
    t.is(err.message, 'Unknown repository r2');
  }
});

test('repository urls', async t => {
  const provider = new Provider();
  const repository = await provider.createRepository('r1');
  t.deepEqual(repository.urls, []);
});
